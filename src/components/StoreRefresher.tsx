import { useEffect } from "react";
import { useUserStore } from "@/lib/auth/user-store";
import { watchSessionChange } from "@/lib/auth/utils";
import { useDarkMode } from "@/lib/hooks/useDarkMode";

export default function StoreRefresher({}) {
  useDarkMode();

  const setSession = useUserStore((state) => state.setSession);

  useEffect(() => {
    watchSessionChange(setSession);
  }, [setSession]);

  return null;
}
