import { z } from "zod"

export const MemberSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(["OWNER", "OFFICER", "LEADERSHIP", "MEMBER", "PENDING"]),
  subteam: z.string().optional(),
  grade: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
})

export type Member = z.infer<typeof MemberSchema>
