import type { FC } from "react";
import { Form } from "@remix-run/react";
import type { SocialsProvider } from "remix-auth-socials";
import { MenuButton } from "~/components/menu/menu-button";

type LoginButtonProps = {
  provider: SocialsProvider;
};

export const LoginButton: FC<LoginButtonProps> = ({ children, provider }) => (
  <Form action={`/auth/${provider}`} method="post">
    <MenuButton as="button" type="submit">
      {children}
    </MenuButton>
  </Form>
);
