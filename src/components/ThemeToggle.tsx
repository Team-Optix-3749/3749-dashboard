import { useDarkMode } from "../lib/hooks/useDarkMode";

import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";

const LIGHT_SYMBOL = <Sun className="size-5" />;
const DARK_SYMBOL = <Moon className="size-5" />;

export default function ThemeToggle({}) {
  const { isDark, isMounted, toggle } = useDarkMode();

  return (
    <Button
      isDisabled={!isMounted}
      isIconOnly
      onPress={toggle}
      size="sm"
      variant="ghost"
      aria-label="Toggle theme"
    >
      {isDark ? LIGHT_SYMBOL : DARK_SYMBOL}
    </Button>
  );
}
