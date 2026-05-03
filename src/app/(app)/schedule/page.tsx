import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function SchedulePage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) redirect("/login")
  if (!session.user.isVerified) redirect("/pending")

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Competition Schedule</h1>
      <p>Upcoming competitions and roster assignments</p>
    </div>
  )
}
