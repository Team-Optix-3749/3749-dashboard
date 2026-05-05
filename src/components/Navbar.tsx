import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { hydrateUserStore, supabase, syncUserStore } from "@/lib/auth/supabase-browser";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/auth/user-store";

import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  BotIcon,
  HammerIcon,
  HomeIcon,
  LayoutDashboard,
  LogOut,
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
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur px-3">
      <div className="h-16 flex items-center justify-between">
        <div className="flex gap-2 items-center ml-6">
          <div className="size-12 bg-primary/30 p-1 rounded-lg flex items-center justify-center">
            <BotIcon className="text-primary size-full" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-6 p-1 border rounded-full border-foreground group">
          {navItems.map((item) => {
            let isCurrentPage = false;
            if (item.to === router.state.location.pathname) {
              isCurrentPage = true;
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "flex items-center justify-center gap-2 h-9 w-36 p-4 hover:bg-foreground/20 rounded-full transition-all duration-300" +
                  (isCurrentPage ? " bg-foreground/20 group-hover:bg-transparent" : "")
                }
              >
                <item.icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="ml-6 w-full">
          <Input className="h-10" placeholder="Search..." />
        </div>
        <div className="ml-2">
          <ThemeToggle />
        </div>
        <div className="ml-2">
          <div className="">
            <AvatarBlock />
          </div>
        </div>
      </div>
    </header>
  );
}

function AvatarBlock({}) {
  const user = useUserStore((state) => state.user);
  const name = user?.user_metadata.name || "User";

  async function signOut() {
    await supabase.auth.signOut();
  }

  console.log(user);

  return (
    <div className="flex items-center gap-2 transition-all duration-300 p-1 rounded-sm">
      <Avatar className="size-10">
        <AvatarImage src={user?.user_metadata.avatar_url} alt={name} />
        <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      <div className="hidden text-xs lg:block">
        <p className="font-medium w-max">{user?.user_metadata.name || "User"}</p>
        <p className="text-muted-foreground w-max">{user?.email || "Unknown Email"}</p>
      </div>
    </div>
  );
}
