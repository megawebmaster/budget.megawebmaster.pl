import type { Budget as DBBudget, BudgetAccess } from "@prisma/client";
import type { Account } from "~/models/account.server";
import { prisma } from "~/db.server";
import invariant from "tiny-invariant";

export type { BudgetAccess } from "@prisma/client";

export type Budget = {
  id: DBBudget["id"];
  name: DBBudget["name"];
  key: BudgetAccess["key"];
  salt: BudgetAccess["salt"];
  isDefault: BudgetAccess["isDefault"];
};

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

export async function getBudget({
  accountId,
  budgetId,
}: {
  accountId: BudgetAccess["accountId"];
  budgetId: BudgetAccess["budgetId"];
}): Promise<Budget> {
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
  });

  invariant(budget, "Budget not found!");

  const access = await prisma.budgetAccess.findFirst({
    where: { accountId, budgetId },
  });

  invariant(access, "This user has no right to access the budget!");

  return {
    id: budget.id,
    name: budget.name,
    key: access.key,
    salt: access.salt,
    isDefault: access.isDefault,
  };
}

export async function createBudget({
  accountId,
  isDefault,
  key,
  name,
  salt,
}: Omit<Budget, "id"> & {
  accountId: Account["id"];
}) {
  const budget = await prisma.budget.create({
    data: { name },
  });

  return await prisma.budgetAccess.create({
    data: {
      isDefault,
      key,
      salt,
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
