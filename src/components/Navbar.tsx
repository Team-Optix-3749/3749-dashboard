import { useState, ReactNode } from "react";
import { Button, Avatar, Tabs } from "@heroui/react";
import { cn } from "@/lib/utils"; // or your cn utility
import { Car } from "lucide-react";
import { useUserStore } from "@/lib/auth/user-store";
import { Link } from "@tanstack/react-router";

interface NavbarItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface NavbarProps {
  items: NavbarItem[];
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  position?: "static" | "sticky" | "fixed";
}

const maxWidthClasses = {
  sm: "max-w-[640px]",
  md: "max-w-[768px]",
  lg: "max-w-[1024px]",
  xl: "max-w-[1280px]",
  "2xl": "max-w-[1536px]",
  full: "max-w-full",
};

export function Navbar({ items, className, maxWidth = "lg", position = "sticky" }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className={cn(
        "z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg",
        position === "sticky" && "sticky top-0",
        position === "fixed" && "fixed top-0",
        className
      )}
    >
      <header
        className={cn(
          "flex h-18 items-center justify-start gap-4 px-6",
          maxWidth !== "full" && maxWidthClasses[maxWidth],
          "mx-auto"
        )}
      >
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <AvatarBlock />
        </div>
        <Tabs>
          <Tabs.ListContainer>
            <Tabs.List aria-label="Options">
              {items.map((item) => (
                <Tabs.Tab id={item.href}>
                  <Link to={item.href}>{item.label}</Link>
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </header>
      {isMenuOpen && (
        <div className="border-t border-separator md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn("block py-2", item.isActive && "font-medium text-accent")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

function AvatarBlock() {
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex hover:bg-field-hover p-2 rounded-field transition-all duration-300">
      <Avatar>
        <Avatar.Image alt="John Doe" src={user?.user_metadata?.avatar_url} />
        <Avatar.Fallback>
          {user?.user_metadata?.name ? user.user_metadata.name.charAt(0) : "U"}
        </Avatar.Fallback>
      </Avatar>
      <div className="flex flex-col justify-center ml-2">
        <p className="text-sm font-medium">{user?.user_metadata?.name || "Unknown"}</p>
        <p className="text-xs text-muted">{user?.email || "Unknown"}</p>
      </div>
    </div>
  );
}
