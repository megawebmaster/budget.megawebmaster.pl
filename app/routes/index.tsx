import { AppContainer } from "~/components/app-container";
import { Menu } from "~/components/menu";

export default function Index() {
  return (
    <AppContainer>
      <Menu />
      <main className="px-10 py-6">
        <p>Welcome to the app that can help you manage your money!</p>
        <p>Log in, set up your account and create your first budget :)</p>
      </main>
    </AppContainer>
  );
}
