import { propOr } from "ramda";
import type { BudgetAccess } from "~/models/budget.server";
import { useMatchesData } from "~/hooks/use-matches-data";

export function useOptionalBudgets(): BudgetAccess[] | undefined {
  const data = useMatchesData("root");

  return propOr(undefined, "budgets")(data);
}

export function useBudgets(): BudgetAccess[] {
  const maybeBudgets = useOptionalBudgets();
  if (!maybeBudgets) {
    throw new Error(
      "No budgets found in root loader, but they are required by useBudgets. If budgets are optional, try useOptionalBudgets instead."
    );
  }
  return maybeBudgets;
}
