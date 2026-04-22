"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import dynamic from "next/dynamic"

const Background3D = dynamic(() => import("./components/Background3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-black" />
})

interface MatchRecord {
  id: string
  result: 'WIN' | 'LOSS' | 'DRAW'
  createdAt: string
}

interface CustomUser {
  name?: string | null
  email?: string | null
  image?: string | null
  score: number
  winStreak: number
  wins: number
  losses: number
  draws: number
}

const MatchHistoryModal = ({ matches, onClose, loading }: { matches: MatchRecord[], onClose: () => void, loading: boolean }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div className="bg-zinc-950 border border-red-900/50 w-full max-w-md rounded-xl overflow-hidden">
      <div className="p-4 border-b border-red-900/30 flex justify-between items-center">
        <h2 className="text-red-500 font-bold uppercase tracking-widest">Match History</h2>
        <button onClick={onClose} className="text-neutral-500 hover:text-white">✕</button>
      </div>
      <div className="max-h-96 overflow-y-auto p-4">
        {loading ? <p className="text-center text-neutral-500">Loading...</p> : (
          <div className="space-y-2">
            {matches.map((m) => (
              <div key={m.id} className="flex justify-between p-3 bg-black/50 border border-red-900/20 rounded">
                <span className={`font-bold ${m.result === 'WIN' ? 'text-emerald-500' : m.result === 'LOSS' ? 'text-red-500' : 'text-yellow-500'}`}>{m.result}</span>
                <span className="text-neutral-500 text-sm">
                  {new Date(m.createdAt).toLocaleString('en-GB', {
                    timeZone: 'Asia/Bangkok',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)

export default function LandingPage() {
  const { data: session } = useSession()
  const [showHistory, setShowHistory] = useState(false)
  const [matches, setMatches] = useState<MatchRecord[]>([])
  const [loadingMatches, setLoadingMatches] = useState(false)

  const fetchUserMatches = async () => {
    setLoadingMatches(true)
    try {
      const res = await fetch("/api/user/matches")
      const data = await res.json()
      if (res.ok) setMatches(data.matches)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMatches(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
      <Background3D />
      
      <div className="z-10 bg-black/60 backdrop-blur-2xl p-6 md:p-16 rounded-3xl border border-red-500/30 box-glow-red max-w-2xl w-full relative">
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-red-500"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-red-500"></div>

        <div className="mb-6 inline-block px-5 py-2 rounded-none bg-red-950/50 text-red-400 text-sm font-bold tracking-[0.2em] border-l-4 border-red-500 uppercase">
          CYBERPUNK EDITION
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          OX<span className="text-red-500 text-glow-red"> GAME</span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 mb-12 font-medium max-w-lg mx-auto">
          Challenge the Minimax AI logic in an immersive 3D simulation. <br/>
          <span className="text-red-400/80">TOTAL ANNIHILATION OR GLORIOUS VICTORY?</span>
        </p>

        {session ? (
          <div className="space-y-8 flex flex-col items-center">
            
            <div className="w-full bg-zinc-950/80 border border-red-900/50 shadow-inner rounded-xl divide-y divide-red-900/20 overflow-hidden">
               <div className="flex gap-6 items-center px-8 py-5 justify-center">
                  <div className="text-center">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em] mb-1">Total Score</p>
                    <p className="text-4xl font-black text-white">{(session.user as CustomUser)?.score}</p>
                  </div>
                  <div className="w-px h-10 bg-red-900/30"></div>
                  <div className="text-center">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em] mb-1">Win Streak</p>
                    <p className="text-4xl font-black text-red-500 text-glow-red">{(session.user as CustomUser)?.winStreak}</p>
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-0 text-center bg-black/40">
                  <div className="py-3 border-r border-red-900/20">
                    <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">Wins</p>
                    <p className="text-lg font-black text-emerald-500">{(session.user as CustomUser)?.wins || 0}</p>
                  </div>
                  <div className="py-3 border-r border-red-900/20">
                    <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">Losses</p>
                    <p className="text-lg font-black text-red-500">{(session.user as CustomUser)?.losses || 0}</p>
                  </div>
                  <div className="py-3">
                    <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">Draws</p>
                    <p className="text-lg font-black text-yellow-500">{(session.user as CustomUser)?.draws || 0}</p>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button 
                onClick={() => { window.location.href = "/play" }}
                className="group relative px-8 py-3 md:py-4 bg-red-600 hover:bg-red-500 text-white rounded-none font-bold text-xl transition-all box-glow-red flex items-center justify-center gap-3 overflow-hidden flex-1"
              >
                <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full duration-500 ease-out z-0"></span>
                <span className="relative z-10 uppercase tracking-widest">ENTER ARENA</span>
              </button>
              
              <button 
                onClick={async () => {
                   
                   setShowHistory(true);
                   if (matches.length === 0) fetchUserMatches();
                }}
                className="px-8 py-3 md:py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none font-bold text-lg transition-all border border-red-900/40 hover:border-red-500 uppercase tracking-widest flex items-center justify-center gap-2 flex-1"
              >
                MY HISTORY
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                onClick={() => { window.location.href = "/leaderboard" }}
                className="px-6 py-2 bg-transparent hover:bg-white/5 text-neutral-400 rounded-none font-bold text-sm transition-all border border-neutral-800 hover:border-zinc-500 uppercase tracking-widest flex items-center justify-center"
              >
                LEADERBOARD
              </button>
              
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-6 py-2 bg-transparent hover:bg-red-950/20 text-red-900 hover:text-red-500 rounded-none font-bold text-sm transition-all border border-red-950 hover:border-red-900 uppercase tracking-widest flex items-center justify-center"
              >
                DISCONNECT
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <span className="text-red-500 font-bold text-xs uppercase tracking-widest mb-4 block">Authorization Pipelines</span>
              <button 
                onClick={() => signIn()}
                className="w-full max-w-sm mx-auto px-8 py-3 md:py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none font-bold text-lg transition-all flex items-center justify-center border border-neutral-700 hover:border-white uppercase tracking-widest"
              >
                LOGIN
              </button>
            </div>
            
            <div className="pt-4 mt-6 border-t border-red-900/30">
              <span className="text-red-500 font-bold text-xs uppercase tracking-widest mb-4 block">Anonymous Protocol</span>
              <button 
                onClick={async () => {
                  const guestId = `GUEST_${Math.floor(1000 + Math.random() * 9000)}`;
                  await signIn("credentials", { 
                    username: guestId, 
                    callbackUrl: "/play",
                    redirect: true
                  })
                }}
                className="w-full max-w-sm mx-auto px-8 py-3 md:py-4 bg-transparent hover:bg-red-950/50 text-red-400 rounded-none font-black text-lg transition-all flex items-center justify-center gap-3 border border-red-900 hover:border-red-500 uppercase tracking-widest box-glow-red"
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

      {showHistory && (
        <MatchHistoryModal 
          matches={matches} 
          onClose={() => setShowHistory(false)} 
          loading={loadingMatches} 
        />
      )}
    </main>
  )
}

