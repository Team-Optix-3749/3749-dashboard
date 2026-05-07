import { useUserStore } from "@/lib/auth/user-store";

export default function Dashboard({}) {
  const user = useUserStore((state) => state.user);

  return <h1>Dashboard, {JSON.stringify(user)}</h1>;
}
