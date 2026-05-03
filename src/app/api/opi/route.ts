import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"
import { db } from "@/lib/db"
import { z } from "zod"
import { NextResponse } from "next/server"

const submitOpiSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(50).max(1000),
  category: z.enum(["OUTREACH", "COMMUNITY_SERVICE", "STEM_EDUCATION", "FUNDRAISING", "TEAM_BUILDING", "COMPETITION_PREP", "OTHER"]),
  proposedDate: z.string().datetime().optional(),
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

  const canView = await hasPermission(session.user.id, "VIEW_OPI_PUBLIC")
  if (!canView) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const submissions = await db.opiSubmission.findMany({
    where: { submitterId: session.user.id },
    include: { submitter: { select: { name: true } } }
  })

  return NextResponse.json(submissions)
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

  const canSubmit = await hasPermission(session.user.id, "SUBMIT_OPI")
  if (!canSubmit) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = submitOpiSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const submission = await db.opiSubmission.create({
    data: {
      ...parsed.data,
      submitterId: session.user.id,
      proposedDate: parsed.data.proposedDate ? new Date(parsed.data.proposedDate) : null,
    }
  })

  return NextResponse.json(submission, { status: 201 })
}
