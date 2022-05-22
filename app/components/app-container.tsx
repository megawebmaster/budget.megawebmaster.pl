import type { FC } from "react";

export const AppContainer: FC = ({ children }) => (
  <div className="flex h-full min-h-screen flex-col">{children}</div>
);
