import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { result } = await request.json()
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let { score, winStreak } = user

    if (result === "win") {
      score += 1
      winStreak += 1
      if (winStreak === 3) {
        score += 1
        winStreak = 0
      }
    } else if (result === "lose") {
      score -= 1
      winStreak = 0
    } else if (result === "tie") {
      winStreak = 0
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { score, winStreak }
    })

    return NextResponse.json({
      score: updatedUser.score,
      winStreak: updatedUser.winStreak
    })
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
