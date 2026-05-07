import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Navigate,
  Outlet,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { getSession, validateAuth, watchSessionChange } from "@/lib/auth/utils";
import { useDarkMode } from "@/lib/hooks/useDarkMode";
import { useUserStore } from "@/lib/auth/user-store";
// import { Navbar } from "@/components/";
import { AuthPage } from "@/routes/(public)/auth";
import { AuthedLayout } from "@/routes/(authed)/_authed";
import { NotFoundPage } from "@/routes/not-found";
import Dashboard from "./routes/(authed)/dashboard";
import { Button } from "@heroui/react";
import { Car } from "lucide-react";
import { Navbar } from "./components/Navbar";
import StoreRefresher from "./components/StoreRefresher";

const rootRoute = createRootRoute({
  component: AppShell,
  notFoundComponent: NotFoundPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

const authedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "(authed)",
  beforeLoad: async () => {
    const isValid = await validateAuth();
    if (!isValid) {
      throw new Error("UNAUTHORIZED");
    }
  },
  errorComponent: () => <Navigate to="/auth" />,
  component: AuthedLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "/dashboard",
  component: Dashboard,
});

const routeTree = rootRoute.addChildren([authRoute, authedRoute.addChildren([dashboardRoute])]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppShell() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <StoreRefresher />
      <Navbar
        items={[
          { label: "Features", href: "#features" },
          { label: "Dashboard", href: "#dashboard" },
          { label: "Pricing", href: "#pricing" },
        ]}
      />
      <Outlet />
    </div>
  );
}
