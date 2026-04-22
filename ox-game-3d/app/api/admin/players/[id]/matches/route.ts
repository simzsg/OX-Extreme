import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ฟังก์ชันตรวจสอบสิทธิ์แอดมิน (Reuse)
function verifyAdmin(request: Request) {
  const adminId = request.headers.get("x-admin-id")
  const adminPw = request.headers.get("x-admin-pw")
  return adminId === process.env.ADMINID && adminPw === process.env.ADMINPW
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { id } = await params

  try {
    const matches = await prisma.match.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 50 // ดึงล่าสุด 50 แมตช์
    })
    return NextResponse.json({ matches })
  } catch (error) {
    console.error("FETCH_MATCHES_ERROR:", error)
    return NextResponse.json({ error: "FAILED_TO_FETCH_MATCHES" }, { status: 500 })
  }
}
