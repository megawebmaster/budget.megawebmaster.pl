import type { Account } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Account } from "@prisma/client";

export async function getAccount(id: Account["id"]) {
  return prisma.account.findUnique({ where: { id } });
}

export async function ensureAccountExists(id: Account["id"]) {
  if ((await getAccount(id)) === null) {
    await createAccount(id);
  }
}

export async function createAccount(id: Account["id"]) {
  return prisma.account.create({
    data: { id },
  });
}

export async function deleteAccount(id: Account["id"]) {
  return prisma.account.delete({ where: { id } });
}
