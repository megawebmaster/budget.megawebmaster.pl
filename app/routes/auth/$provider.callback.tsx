import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth.server";

export let loader: LoaderFunction = ({ request, params }) => {
  invariant(params.provider, "Must specify a provider.");

  return authenticator.authenticate(params.provider, request, {
    successRedirect: "/notes",
    failureRedirect: "/",
  });
};
