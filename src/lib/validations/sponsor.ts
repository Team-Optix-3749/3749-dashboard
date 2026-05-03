import { z } from "zod"

export const SponsorSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string(),
  sponsorType: z.string(),
  contactName: z.string().optional(),
  email: z.string().email().optional(),
  status: z.enum(["NOT_APPLIED", "IN_PROGRESS", "APPLIED", "RESPONDED", "CONFIRMED", "DECLINED", "ON_HOLD"]),
  priorityLevel: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
})

export type Sponsor = z.infer<typeof SponsorSchema>
