import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { requireUser } from "~/auth.server";
import { createBudget } from "~/models/budget.server";

export const meta: MetaFunction = () => ({
  title: "New budget - SimplyBudget",
});

type ActionData = {
  errors?: {
    name?: string;
    password?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const encryptionPassword = formData.get("password");
  const isDefault = formData.get("is-default");

  if (typeof name !== "string" || name.length === 0) {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }

  if (
    typeof encryptionPassword !== "string" ||
    encryptionPassword.length === 0
  ) {
    return json<ActionData>(
      { errors: { password: "Encryption password is required" } },
      { status: 400 }
    );
  }
  if (encryptionPassword.length < 12) {
    return json<ActionData>(
      {
        errors: {
          password: "Encryption password must be at least 12 characters long",
        },
      },
      { status: 400 }
    );
  }

  // TODO: Generate key for encryption based on password
  const budget = await createBudget({
    accountId: user.id,
    isDefault: isDefault === "yes",
    name,
    key: encryptionPassword,
  });

  return redirect(`/budget/${budget.budgetId}`);
};

// TODO: Style new budget page
export default function NewBudgetPage() {
  const actionData = useActionData() as ActionData;
  const nameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post">
      <div>
        <h2 className="mb-4 text-3xl">Create new budget</h2>
        <label className="flex w-full flex-col gap-1">
          <span>Name: </span>
          <input
            ref={nameRef}
            name="name"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "name-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.name && (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData.errors.name}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Encryption password: </span>
          <input
            ref={passwordRef}
            name="password"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-errormessage={
              actionData?.errors?.password ? "password-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.password && (
          <div className="pt-1 text-red-700" id="password-error">
            {actionData.errors.password}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Create
        </button>
      </div>
    </Form>
  );
}
