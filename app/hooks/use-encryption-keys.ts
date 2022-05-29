import type { BudgetAccess } from "@prisma/client";

import { db } from "~/db.client";

const generateWrappingKey = async (password: string, salt: Uint8Array) => {
  const enc = new TextEncoder();
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  return await globalThis.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      iterations: 100000,
      hash: "SHA-256",
      salt,
    },
    keyMaterial,
    { name: "AES-KW", length: 256 },
    false,
    ["wrapKey", "unwrapKey"]
  );
};

const generateKey = async (password: string) => {
  const key = await globalThis.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const salt = await globalThis.crypto.getRandomValues(new Uint8Array(16));
  const wrappingKey = await generateWrappingKey(password, salt);
  const decoder = new TextDecoder();

  return {
    key: decoder.decode(
      await globalThis.crypto.subtle.wrapKey("raw", key, wrappingKey, "AES_KW")
    ),
    salt: decoder.decode(salt),
  };
};

const unwrapKey = async (password: string, key: string, salt: string) => {
  const encoder = new TextEncoder();
  const wrappingKey = await generateWrappingKey(password, encoder.encode(salt));

  return await globalThis.crypto.subtle.unwrapKey(
    "raw",
    encoder.encode(key),
    wrappingKey,
    "AES-KW",
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );
};

const getKey = async (budget: BudgetAccess) => {
  const key = await db.keys.where("id").equals(budget.budgetId).first();

  if (!key) {
    const password = window.prompt("Enter encryption password");

    if (!password) {
      throw new Error("Unable to obtain password, cannot access the budget.");
    }

    const unwrappedKey = await unwrapKey(password, budget.key, budget.salt);
    db.keys.add(unwrappedKey, budget.budgetId);

    return unwrappedKey;
  }

  return key;
};

export const useEncryptionKeys = () => ({
  generateKey,
  getKey,
});
