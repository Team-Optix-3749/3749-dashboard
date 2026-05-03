import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"
import { db } from "@/lib/db"
import { z } from "zod"
import { NextResponse } from "next/server"

const createSponsorSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string(),
  sponsorType: z.string(),
  status: z.enum(["NOT_APPLIED", "IN_PROGRESS", "APPLIED", "RESPONDED", "CONFIRMED", "DECLINED", "ON_HOLD"]).default("NOT_APPLIED"),
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

  const sponsors = await db.sponsor.findMany({
    select: { id: true, name: true, category: true, status: true, priorityLevel: true, deadline: true }
  })

  return NextResponse.json(sponsors)
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

  const canEdit = await hasPermission(session.user.id, "EDIT_SPONSOR_DB")
  if (!canEdit) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createSponsorSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const sponsor = await db.sponsor.create({
    data: {
      ...parsed.data,
      updatedBy: session.user.id,
    }
  })

  return NextResponse.json(sponsor, { status: 201 })
}
