import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

interface AuthContext {
  params: Promise<Record<string, string | string[]>>
}

export async function GET(req: Request, context: AuthContext) {
  const params = await context.params
  console.log("[AUTH-DEBUG] GET Request URL:", req.url)
  console.log("[AUTH-DEBUG] Resolved Params:", params)
  
  try {
    return await handler(req, { params })
  } catch (error) {
    console.error("[AUTH-DEBUG] GET Handler Error:", error)
    throw error
  }
}

export async function POST(req: Request, context: AuthContext) {
  const params = await context.params
  console.log("[AUTH-DEBUG] POST Request URL:", req.url)
  console.log("[AUTH-DEBUG] Resolved Params:", params)

  try {
    return await handler(req, { params })
  } catch (error) {
    console.error("[AUTH-DEBUG] POST Handler Error:", error)
    throw error
  }
}
