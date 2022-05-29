import { useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import type { BudgetAccess } from "@prisma/client";
import { useAsync } from "react-async-hook";

import { useEncryptionKeys } from "~/hooks/use-encryption-keys";

type LoaderData = {
  budget?: BudgetAccess;
};

export const useBudget = () => {
  const { budget } = useLoaderData() as LoaderData;
  const { getKey } = useEncryptionKeys();
  const decryptBudget = async () => {};
  // TODO: Figure out a way to properly decrypt data, but not too often
};
