import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "SUPERVISOR" | "ENGINEER"
      name?: string | null
      email?: string | null
    }
  }

  interface User {
    id: string
    role: "SUPERVISOR" | "ENGINEER"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "SUPERVISOR" | "ENGINEER"
  }
}