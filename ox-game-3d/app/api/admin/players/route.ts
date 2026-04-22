import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { adminId, adminPw } = await request.json()

    // 1. ตรวจสอบข้อมูลล็อกอินจาก .env
    const envAdminId = process.env.ADMINID
    const envAdminPw = process.env.ADMINPW

    if (adminId !== envAdminId || adminPw !== envAdminPw) {
      return NextResponse.json({ error: "UNAUTHORIZED ACCESS" }, { status: 401 })
    }

   
    const users = await prisma.user.findMany({
      orderBy: { score: "desc" },
      select: {
        id: true,
        name: true,
        score: true,
        winStreak: true,
        wins: true,
        losses: true,
        draws: true,
      }
    })

 
    const enrichedUsers = users.map(user => ({
      ...user,
      loginMethod: user.name?.startsWith("GUEST_") ? "GUEST_PROTOCOL" : "SYSTEM_AUTH"
    }))

    return NextResponse.json({ players: enrichedUsers })
  } catch (error) {
    console.error("ADMIN_API_ERROR:", error)
    return NextResponse.json({ error: "INTERNAL SYSTEM ERROR" }, { status: 500 })
  }
}
