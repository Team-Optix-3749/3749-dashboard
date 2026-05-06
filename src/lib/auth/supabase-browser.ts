import { createClient, type Session } from "@supabase/supabase-js";
import { useUserStore } from "./user-store";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

export function watchSessionChange(onChange: (session: Session | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    onChange(session);
  });

  return () => subscription.unsubscribe();
}

export function syncUserStoreWithAuth() {
  const { setSession } = useUserStore.getState();

  void getSession().then(setSession);
  return watchSessionChange(setSession);
}


