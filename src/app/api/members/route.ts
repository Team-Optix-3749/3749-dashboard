import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"
import { db } from "@/lib/db"
import { z } from "zod"
import { NextResponse } from "next/server"

const createMemberSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(["MEMBER", "LEADERSHIP", "OFFICER"]),
})

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user?.isVerified) {
    return NextResponse.json({ error: "Not verified" }, { status: 403 })
  }

  const canView = await hasPermission(session.user.id, "VIEW_MEMBERS")
  if (!canView) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const members = await db.user.findMany({
    where: { isVerified: true },
    select: { id: true, name: true, email: true, role: true, totalBuildMinutes: true, joinedAt: true }
  })

  return NextResponse.json(members)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user?.isVerified) {
    return NextResponse.json({ error: "Not verified" }, { status: 403 })
  }

  const canVerify = await hasPermission(session.user.id, "VERIFY_MEMBER")
  if (!canVerify) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createMemberSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const result = await db.user.update({
    where: { email: parsed.data.email },
    data: { isVerified: true, role: parsed.data.role }
  })

  return NextResponse.json(result, { status: 201 })
}
