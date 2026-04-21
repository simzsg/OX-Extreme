"use client"

import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Background3D from "./components/Background3D"

export default function LandingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
      <Background3D />
      
      <div className="z-10 bg-black/60 backdrop-blur-2xl p-10 md:p-16 rounded-3xl border border-red-500/30 box-glow-red max-w-2xl w-full relative">
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-red-500"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-red-500"></div>

        <div className="mb-6 inline-block px-5 py-2 rounded-none bg-red-950/50 text-red-400 text-sm font-bold tracking-[0.2em] border-l-4 border-red-500 uppercase">
          CYBERPUNK EDITION
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          OX<span className="text-red-500 text-glow-red"> GAME</span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 mb-12 font-medium max-w-lg mx-auto">
          Challenge the Minimax AI logic in an immersive 3D simulation. <br/>
          <span className="text-red-400/80">TOTAL ANNIHILATION OR GLORIOUS VICTORY?</span>
        </p>

        {session ? (
          <div className="space-y-8 flex flex-col items-center">
            <div className="flex gap-6 items-center bg-zinc-950/80 px-8 py-5 rounded-xl border border-red-900/50 mb-2 w-full justify-center shadow-inner">
              <div className="text-center">
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-1">Score</p>
                <p className="text-4xl font-black text-white">{session.user?.score}</p>
              </div>
              <div className="w-px h-12 bg-red-900/50"></div>
              <div className="text-center">
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-1">Streak</p>
                <p className="text-4xl font-black text-red-500 text-glow-red">{session.user?.winStreak}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button 
                onClick={() => router.push("/play")}
                className="group relative px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-none font-bold text-xl transition-all box-glow-red flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full duration-500 ease-out z-0"></span>
                <span className="relative z-10 uppercase tracking-widest">ENTER ARENA</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <Link href="/leaderboard" className="px-8 py-4 bg-transparent hover:bg-white/5 text-white rounded-none font-bold text-lg transition-all border border-neutral-700 hover:border-white uppercase tracking-widest flex items-center justify-center">
                LEADERBOARD
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <span className="text-red-500 font-bold text-xs uppercase tracking-widest mb-4 block">Authorization Pipelines</span>
              <button 
                onClick={() => signIn()}
                className="w-full max-w-sm mx-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none font-bold text-lg transition-all flex items-center justify-center border border-neutral-700 hover:border-white uppercase tracking-widest"
              >
                LOGIN
              </button>
            </div>
            
            <div className="pt-4 mt-6 border-t border-red-900/30">
              <span className="text-red-500 font-bold text-xs uppercase tracking-widest mb-4 block">Anonymous Protocol</span>
              <button 
                onClick={() => {
                  const guestId = `GUEST_${Math.floor(1000 + Math.random() * 9000)}`;
                  signIn("credentials", { username: guestId, callbackUrl: "/play" })
                }}
                className="w-full max-w-sm mx-auto px-8 py-4 bg-transparent hover:bg-red-950/50 text-red-400 rounded-none font-black text-lg transition-all flex items-center justify-center gap-3 border border-red-900 hover:border-red-500 uppercase tracking-widest box-glow-red"
              >
                Guest Access 
              </button>
            </div>
          </div>
        )}
      </div>
      
      <p className="mt-12 text-neutral-600 font-mono text-xs uppercase tracking-widest">
        Win: +1 | Lose: -1 | 3-Streak: +1
      </p>
    </main>
  )
}

