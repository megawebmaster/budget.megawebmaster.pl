import Dexie from "dexie";
import type { Budget } from "@prisma/client";

class BudgetDatabase extends Dexie {
  keys!: Dexie.Table<CryptoKey, Budget["id"]>;

  constructor() {
    super("BudgetDatabase");

    this.version(1).stores({
      keys: "key",
      budgets: "name",
    });
  }
}

export const db = new BudgetDatabase();
