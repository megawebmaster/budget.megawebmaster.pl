import type { FC } from "react";
import { SocialsProvider } from "remix-auth-socials";

import { useOptionalBudgets } from "~/hooks/use-budgets";
import { useOptionalUser } from "~/hooks/use-user";
import { LoginButton } from "~/components/menu/login-button";
import { LogoutButton } from "~/components/menu/logout-button";
import { MenuButton } from "~/components/menu/menu-button";

export const Menu: FC = ({ children }) => {
  const user = useOptionalUser();
  const budgets = useOptionalBudgets();

  return (
    <header className="flex items-center justify-between bg-gray-900 text-white">
      <h1>
        <MenuButton className="font-bold" to="/">
          SimplyBudget
        </MenuButton>
      </h1>
      <div className="flex flex-grow">
        {user && (
          <>
            <MenuButton to="/budgets">Budget</MenuButton>
            <MenuButton as="span">Expenses</MenuButton>
          </>
        )}
      </div>
      {children}
      {user ? (
        <LogoutButton>Logout</LogoutButton>
      ) : (
        <LoginButton provider={SocialsProvider.GOOGLE}>
          Log in with Google
        </LoginButton>
      )}
    </header>
  );
};
