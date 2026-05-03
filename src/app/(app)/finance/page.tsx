import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"

export const dynamic = 'force-dynamic'

export default async function FinancePage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) redirect("/login")
  if (!session.user.isVerified) redirect("/pending")

  const canView = await hasPermission(session.user.id as string, "VIEW_FINANCE")
  if (!canView) {
    redirect("/dashboard")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Finance</h1>
      <p>Budget, transactions, expense reports, grants</p>
    </div>
  )
}
