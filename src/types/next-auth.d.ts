import type { DefaultSession, DefaultUser } from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: DefaultSession["user"] & {
      id: string
      role: "OWNER" | "OFFICER" | "LEADERSHIP" | "MEMBER" | "PENDING"
      isVerified: boolean
    }
  }

  interface User extends DefaultUser {
    role?: "OWNER" | "OFFICER" | "LEADERSHIP" | "MEMBER" | "PENDING"
    isVerified?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: "OWNER" | "OFFICER" | "LEADERSHIP" | "MEMBER" | "PENDING"
    isVerified?: boolean
  }
}
