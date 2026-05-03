"use client"

import { useSession } from "next-auth/react"

export function useRole() {
  const { data: session } = useSession()
  return {
    role: session?.user?.role,
    isOwner: session?.user?.role === "OWNER",
    isOfficer: session?.user?.role === "OFFICER",
    isLeadership: ["OFFICER", "LEADERSHIP"].includes(session?.user?.role || ""),
    isMember: ["MEMBER", "LEADERSHIP", "OFFICER", "OWNER"].includes(session?.user?.role || ""),
    isVerified: session?.user?.isVerified,
  }
}
