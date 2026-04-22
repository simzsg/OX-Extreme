import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
    }

    const matches = await prisma.match.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20 
    })
    
    return NextResponse.json({ matches })
  } catch (error) {
    console.error("FETCH_USER_MATCHES_ERROR:", error)
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 })
  }
}
