import { propOr } from "ramda";
import type { User } from "~/models/user.server";
import { useMatchesData } from "~/hooks/use-matches-data";

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");

  return propOr(undefined, "user")(data);
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}
