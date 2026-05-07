import { useCallback, useEffect, useState } from "react";
import { useIsMounted } from "./useIsMounted";

type ThemeMode = "dark" | "light";

function applyTheme(theme: ThemeMode) {
  localStorage.theme = theme;
  document.documentElement.classList.add(theme);
  document.documentElement.classList.remove(theme === "dark" ? "light" : "dark");
  document.documentElement.dataset.theme = theme;
}

export function useDarkMode() {
  const isMounted = useIsMounted();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (!isMounted) return;

    const storedTheme = localStorage.theme as ThemeMode | undefined;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = storedTheme ?? (prefersDark ? "dark" : "light");

    applyTheme(theme);
    setIsDark(theme === "dark");
  }, [isMounted]);

  const toggle = useCallback(() => {
    if (!isMounted) return;
    setIsDark((current) => {
      const nextTheme: ThemeMode = current ? "light" : "dark";
      applyTheme(nextTheme);
      return nextTheme === "dark";
    });
  }, [isMounted]);

  return { isDark, isMounted, toggle };
}
