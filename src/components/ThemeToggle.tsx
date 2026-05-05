import { useDarkMode } from "../lib/hooks/useDarkMode";

import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

const LIGHT_SYMBOL = <Sun className="size-5" />;
const DARK_SYMBOL = <Moon className="size-5" />;

export default function ThemeToggle({}) {
  const { isDark, isMounted, toggle } = useDarkMode();

  return (
    <Button
      variant={"ghost"}
      disabled={!isMounted}
      onClick={toggle}
      size="icon"
      className="size-9"
    >
      {isDark ? LIGHT_SYMBOL : DARK_SYMBOL}
    </Button>
  );
}
