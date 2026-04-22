import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Background3D from "../components/Background3D"

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions)
  
  const users = await prisma.user.findMany({
    orderBy: { score: "desc" },
    select: { id: true, name: true, score: true, winStreak: true }
  })

  return (
    <main className="min-h-screen relative flex flex-col items-center p-8 lg:p-24 overflow-hidden bg-[radial-gradient(circle_at_top,_#09090b_0%,_#000000_50%,_#450a0a_100%)]">
      <Background3D />
      <div className="w-full max-w-4xl bg-black/80 backdrop-blur-md rounded-none p-8 shadow-2xl border border-red-900/40 relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            STANDINGS
          </h1>
          <Link 
            href="/"
            className="px-6 py-2 bg-transparent hover:bg-red-900/30 text-red-500 rounded-none transition-colors border border-red-900 hover:border-red-500 uppercase tracking-widest text-sm font-bold flex items-center justify-center"
          >
            BACK
          </Link>
        </div>
        
        <div className="overflow-x-auto rounded-none border border-neutral-800">
          <table className="w-full text-left border-collapse font-mono">
            <thead>
              <tr className="bg-zinc-900 text-neutral-400 uppercase text-sm tracking-widest border-b border-neutral-700">
                <th className="p-4 font-semibold">Rank</th>
                <th className="p-4 font-semibold">Identifier</th>
                <th className="p-4 font-semibold text-right">Score</th>
                <th className="p-4 font-semibold text-right">Peak Streak</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`border-b border-neutral-800 transition-colors ${
                    session?.user?.id === user.id ? "bg-red-900/20" : "hover:bg-zinc-900/50"
                  }`}
                >
                  <td className="p-4 text-neutral-300">
                    {index === 0 ? "01 [ELITE]" : index === 1 ? "02 [VETERAN]" : index === 2 ? "03 [EXPERT]" : String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="p-4 font-bold flex items-center gap-2 text-white">
                    {user.name || "UNKNOWN_ENTITY"}
                    {session?.user?.id === user.id && (
                      <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-none font-bold tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.8)]">YOU</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-black text-red-500 text-glow-red">{user.score}</td>
                  <td className="p-4 text-right">
                    {user.winStreak > 0 ? (
                      <span className="text-red-400 font-bold">[{user.winStreak}]</span>
                    ) : "-"}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-600 font-mono">DATABASE EMPTY. NO ENTITIES FOUND.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
