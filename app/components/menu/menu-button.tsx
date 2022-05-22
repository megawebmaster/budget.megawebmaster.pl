import type { ComponentType, FC } from "react";
import { NavLink } from "@remix-run/react";

type MenuButtonProps = {
  as?: string | ComponentType<any>;
  className?: string;
  to?: string;
  type?: "button" | "submit";
};

const styles = `px-4 py-2 text-white hover:bg-gray-600`;

export const MenuButton: FC<MenuButtonProps> = ({
  as: Component = NavLink,
  children,
  className = "",
  to = "",
  ...props
}) => (
  <Component
    className={
      Component === NavLink
        ? ({ isActive }) =>
            `${styles} ${isActive ? "bg-gray-700" : ""} ${className}`
        : `${styles} ${className}`
    }
    to={to}
    {...props}
  >
    {children}
  </Component>
);
