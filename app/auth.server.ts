import invariant from "tiny-invariant";
import { Authenticator } from "remix-auth";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { getUser, sessionStorage, USER_SESSION_KEY } from "~/session.server";
import type { User } from "~/models/user.server";
import {
  ensureAccountExists,
  getAccount as getAccountById,
} from "~/models/account.server";

invariant(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID must be set");
invariant(process.env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET must be set");

export const authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: USER_SESSION_KEY,
});

authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ["openid", "email", "profile"],
      callbackURL: `/auth/${SocialsProvider.GOOGLE}/callback`,
    },
    async ({ profile }) => {
      await ensureAccountExists(profile.id);

      return {
        id: profile.id,
        picture: profile._json.picture,
        name: profile.name.givenName,
        locale: profile._json.locale,
      };
    }
  )
);

export async function getAccount(request: Request) {
  const user = await getUser(request);
  return !user ? undefined : await getAccountById(user.id);
}

export async function requireUser(request: Request) {
  const user = await getUser(request);
  if (user) return user;

  throw await authenticator.logout(request, { redirectTo: "/" });
}
