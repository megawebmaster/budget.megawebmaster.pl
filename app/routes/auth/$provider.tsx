import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth.server";

export let loader: LoaderFunction = () => redirect("/");

export let action: ActionFunction = ({ request, params }) => {
  invariant(params.provider, "Must specify a provider.");

  return authenticator.authenticate(params.provider, request);
};
