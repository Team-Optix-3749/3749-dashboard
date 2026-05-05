import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
} from "@tanstack/react-router";
import { getSession } from "@/lib/auth/supabase-browser";
import { useDarkMode } from "@/lib/hooks/useDarkMode";
import { LoginPage } from "@/routes/(public)/login";
import { AuthedLayout } from "@/routes/(authed)/_authed";
import { DashboardPage } from "@/routes/(authed)/dashboard";
import { NotFoundPage } from "@/routes/not-found";
import { Navbar } from "./components/Navbar";

function AppShell() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <Outlet />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: AppShell,
  notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/dashboard" />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
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

const dashboardRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  authedRoute.addChildren([dashboardRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
