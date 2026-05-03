import { z } from "zod"

export const OpiSubmissionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(50).max(1000),
  category: z.enum(["OUTREACH", "COMMUNITY_SERVICE", "STEM_EDUCATION", "FUNDRAISING", "TEAM_BUILDING", "COMPETITION_PREP", "OTHER"]),
  proposedDate: z.date().optional(),
})

export const OpiEventSchema = z.object({
  name: z.string().min(1).max(200),
  date: z.date(),
  location: z.string().optional(),
  description: z.string().optional(),
})

export type OpiSubmission = z.infer<typeof OpiSubmissionSchema>
export type OpiEvent = z.infer<typeof OpiEventSchema>
