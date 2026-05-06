import { useMemo, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/auth/supabase-browser";
import { useUserStore } from "@/lib/auth/user-store";

import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { VisuallyHidden } from "./ui/visually-hidden";
import {
  BotIcon,
  HammerIcon,
  HomeIcon,
  LayoutDashboard,
  LogOut,
  MenuIcon,
  PersonStandingIcon,
  SearchIcon,
} from "lucide-react";
import { router } from "@/router";

const navItems = [
  { label: "Home", to: "/", icon: HomeIcon },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Scouting", to: "/scouting", icon: SearchIcon },
  { label: "Outreach", to: "/outreach", icon: PersonStandingIcon },
  { label: "Build", to: "/build", icon: HammerIcon },
];

export function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lastHoveredIndex, setLastHoveredIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = router.state.location.pathname;
  const activeIndex = useMemo(() => {
    return navItems.findIndex((item) =>
      item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)
    );
  }, [pathname]);
  const hasActive = activeIndex !== -1;
  const indicatorIndex = hoveredIndex ?? (hasActive ? activeIndex : (lastHoveredIndex ?? 0));
  const showIndicator = hoveredIndex !== null || hasActive;

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur px-3">
      <div className="h-16 flex items-center justify-between">
        <div className="flex gap-2 items-center ml-6">
          <div className="size-12 bg-primary/30 p-1 rounded-lg flex items-center justify-center">
            <BotIcon className="text-primary size-full" />
          </div>
        </div>
        <div
          className="relative ml-6 hidden rounded-full border border-muted-foreground p-1 lg:flex"
          onMouseLeave={() => setHoveredIndex(null)}
          style={
            {
              "--nav-index": indicatorIndex,
              "--nav-item-width": "144px",
              "--nav-gap": "8px",
            } as CSSProperties
          }
        >
          <span
            className={
              "pointer-events-none absolute left-1 top-1 h-9 w-36 rounded-full bg-foreground/15 transition-all duration-300" +
              (showIndicator ? " opacity-100 scale-100" : " opacity-0 scale-95")
            }
            style={{
              transform:
                "translateX(calc(var(--nav-index) * (var(--nav-item-width) + var(--nav-gap))))",
            }}
          />
          <div className="relative z-10 flex items-center gap-2">
            {navItems.map((item, index) => {
              const isCurrentPage =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={isCurrentPage ? "page" : undefined}
                  className={
                    "flex items-center justify-center gap-2 h-9 w-36 rounded-full px-4 text-sm text-foreground/80 transition-all duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60" +
                    (isCurrentPage ? " text-foreground" : "")
                  }
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    setLastHoveredIndex(index);
                  }}
                  onFocus={() => {
                    setHoveredIndex(index);
                    setLastHoveredIndex(index);
                  }}
                  onBlur={() => setHoveredIndex(null)}
                >
                  <item.icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="ml-6 hidden w-full lg:block">
          <Input className="h-10" placeholder="Search..." />
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <div className="hidden lg:block">
            <AvatarBlock />
          </div>
          <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <MenuIcon className="size-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bottom-0 top-auto h-[75vh] px-4 pb-6 pt-6">
              <VisuallyHidden>
                <DrawerTitle>Navigation menu</DrawerTitle>
              </VisuallyHidden>
              <div className="mx-auto flex w-full max-w-md flex-col gap-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/30 p-1 rounded-lg flex items-center justify-center">
                      <BotIcon className="text-primary size-full" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Navigation</p>
                      <p className="text-xs text-muted-foreground">Quick access</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
                <Input className="h-10" placeholder="Search..." />
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isCurrentPage =
                      item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted" +
                          (isCurrentPage ? " bg-muted font-semibold text-foreground" : "")
                        }
                        onClick={() => setMenuOpen(false)}
                      >
                        <item.icon className="size-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
                <div className="rounded-lg border border-border/60 p-3 flex justify-start">
                  <AvatarBlock showDetails />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

function AvatarBlock({ showDetails = false }: { showDetails?: boolean; flexJustify?: string }) {
  const user = useUserStore((state) => state.user);

  return (
    <Link
      to="."
      className="flex items-center justify-between gap-2 transition-all duration-300 p-1 rounded-lg hover:bg-muted w-full"
    >
      <div
        className={
          "text-xs flex-col justify-center gap-1 " +
          (showDetails ? "flex items-start" : "hidden lg:flex items-end")
        }
      >
        <p className="font-medium w-max">{user?.user_metadata.name || "Unknown Name"}</p>
        <p className="text-muted-foreground w-max">{user?.email || "Unknown Email"}</p>
      </div>
      <Avatar className="size-10">
        <AvatarImage
          src={user?.user_metadata.avatar_url}
          alt={user?.user_metadata.name || user?.email || "Unknown User"}
        />
        <AvatarFallback>
          {user?.user_metadata.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
