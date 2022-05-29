import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { requireUser } from "~/auth.server";
import type { Budget } from "~/models/budget.server";
import { getBudget } from "~/models/budget.server";

export const meta: MetaFunction = ({ data }) => ({
  title: `Budget ${data.budget.name} - SimplyBudget`,
});

type LoaderData = {
  budget?: Budget;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.budgetId, "Budget ID is required");
  const user = await requireUser(request);
  const budget = await getBudget({
    accountId: user.id,
    budgetId: params.budgetId,
  });
  if (!budget) {
    throw new Response("Budget not found", { status: 404 });
  }
  return json({ budget });
};

// export const action: ActionFunction = async ({ request, params }) => {
//   const user = await requireUser(request);
//   invariant(params.noteId, "noteId not found");
//
//   await deleteNote({ accountId: user.id, id: params.noteId });
//
//   return redirect("/notes");
// };

export default function BudgetPage() {
  const { budget } = useLoaderData() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{budget?.name}</h3>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Budget has not been found.</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
