import type { Budget, BudgetAccess } from "@prisma/client";
import type { Account } from "~/models/account.server";
import { prisma } from "~/db.server";

export type { Budget, BudgetAccess } from "@prisma/client";

export function getBudgetList({
  accountId,
}: {
  accountId: BudgetAccess["accountId"];
}) {
  return prisma.budgetAccess.findMany({
    where: { accountId },
    orderBy: {
      budget: {
        name: "asc",
      },
    },
  });
}

export function getDefaultBudget({
  accountId,
}: {
  accountId: BudgetAccess["accountId"];
}) {
  return prisma.budgetAccess.findFirst({
    where: { accountId, isDefault: true },
    orderBy: {
      budget: {
        name: "asc",
      },
    },
  });
}

export async function getBudget({ budgetId }: { budgetId: Budget["id"] }) {
  return prisma.budget.findUnique({
    where: { id: budgetId },
  });
}

export async function createBudget({
  accountId,
  isDefault,
  key,
  name,
}: Pick<Budget, "name"> &
  Pick<BudgetAccess, "isDefault"> & {
    accountId: Account["id"];
    key: BudgetAccess["key"];
  }) {
  const budget = await prisma.budget.create({
    data: { name },
  });

  return await prisma.budgetAccess.create({
    data: {
      key,
      isDefault,
      account: {
        connect: {
          id: accountId,
        },
      },
      budget: {
        connect: {
          id: budget.id,
        },
      },
    },
  });
}
