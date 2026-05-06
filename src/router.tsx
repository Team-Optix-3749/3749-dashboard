import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { getSession, syncUserStoreWithAuth } from "@/lib/auth/supabase-browser";
import { useDarkMode } from "@/lib/hooks/useDarkMode";
import { useUserStore } from "@/lib/auth/user-store";
import { Navbar } from "@/components/Navbar";
import { LandingPage } from "@/routes/(public)/index";
import { LoginPage } from "@/routes/(public)/login";
import { SignupPage } from "@/routes/(public)/signup";
import { AuthedLayout } from "@/routes/(authed)/_authed";
import { NotFoundPage } from "@/routes/not-found";

const rootRoute = createRootRoute({
  component: AppShell,
  notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

const authedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "(authed)",
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw new Error("UNAUTHORIZED");
    }
    return { session };
  },
  errorComponent: () => <Navigate to="/login" />,
  component: AuthedLayout,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  authedRoute.addChildren([]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppShell() {
  useDarkMode();

  const setSession = useUserStore((state) => state.setSession);

  useEffect(() => {
    void getSession().then((session) => setSession(session));
    return syncUserStoreWithAuth();
  }, [setSession]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <Outlet />
    </div>
  );
}
