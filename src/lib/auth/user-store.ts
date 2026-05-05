import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

type UserStoreState = {
  initialized: boolean;
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
};

export const useUserStore = create<UserStoreState>((set) => ({
  initialized: false,
  session: null,
  user: null,
  setSession: (session) =>
    set({
      initialized: true,
      session,
      user: session?.user ?? null,
    }),
}));
