import type { FC } from "react";
import { Form } from "@remix-run/react";
import { MenuButton } from "~/components/menu/menu-button";

export const LogoutButton: FC = ({ children }) => (
  <Form action="/logout" method="post">
    <MenuButton as="button" type="submit">
      {children}
    </MenuButton>
  </Form>
);
