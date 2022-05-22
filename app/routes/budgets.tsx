import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { AppContainer } from "~/components/app-container";
import { Menu } from "~/components/menu";
import { getDefaultBudget } from "~/models/budget.server";
import { requireUser } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  if (request.url.endsWith("/budgets/new")) {
    return json({});
  }

  const budget = await getDefaultBudget({ accountId: user.id });
  if (!budget) {
    return redirect("/budgets/new");
  }

  return redirect(`/budgets/${budget.budgetId}`);
};

export default function Budgets() {
  return (
    <AppContainer>
      <Menu />
      <noscript>
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-white/75 px-10 py-6">
          <h2 className="text-3xl">
            This page requires JavaScript to function properly
          </h2>
        </div>
      </noscript>
      <main className="px-10 py-6">
        <Outlet />
      </main>
    </AppContainer>
  );
}
