import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) redirect("/login")
  if (!session.user.isVerified) redirect("/pending")

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Welcome, {session.user.name}</p>
      <p>Role: {session.user.role}</p>
      {/* Dashboard cards will go here */}
    </div>
  )
}
