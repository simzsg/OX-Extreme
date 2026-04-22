import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ฟังก์ชันตรวจสอบสิทธิ์เบื้องต้น
function verifyAdmin(request: Request) {
  const adminId = request.headers.get("x-admin-id")
  const adminPw = request.headers.get("x-admin-pw")
  return adminId === process.env.ADMINID && adminPw === process.env.ADMINPW
}

// ล้างคะแนนผู้เล่น (Reset)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { id } = await params

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        score: 0,
        winStreak: 0,
        wins: 0,
        losses: 0,
        draws: 0
      }
    })
    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("RESET_ERROR:", error)
    return NextResponse.json({ error: "FAILED_TO_RESET" }, { status: 500 })
  }
}

// ลบผู้เล่นถาวร (Delete)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.user.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE_ERROR:", error)
    return NextResponse.json({ error: "FAILED_TO_DELETE" }, { status: 500 })
  }
}
