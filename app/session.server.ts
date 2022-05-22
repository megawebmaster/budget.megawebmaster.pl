import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { User } from "~/models/user.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const USER_SESSION_KEY = "user";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 24 * 3600,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUser(request: Request) {
  const session = await getSession(request);
  return session.get(USER_SESSION_KEY) as User | undefined;
}
