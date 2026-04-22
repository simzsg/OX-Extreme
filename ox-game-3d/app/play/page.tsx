"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useGameStore } from "@/lib/store"
import { checkWinner } from "@/lib/game-logic"
import { getBestMove } from "@/lib/ai"
import dynamic from "next/dynamic"

const Game3D = dynamic(() => import("../components/Game3D"), { ssr: false })

export default function PlayPage() {
  const { data: session, status, update } = useSession()
  const { board, currentPlayer, setSquare, winner, setWinner, isBotThinking, setIsBotThinking, resetBoard, playerSide, setPlayerSide, matchStats, updateMatchStats, recentGames, initMatchStats } = useGameStore()
  const [scoreUpdate, setScoreUpdate] = useState<{ score: number, streak: number } | null>(null)
  const mountedRef = useRef(true)
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scoreProcessedRef = useRef(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/"
    }
  }, [status])

  useEffect(() => {
    if (session?.user) {
      initMatchStats({
        wins: session.user.wins || 0,
        losses: session.user.losses || 0,
        draws: session.user.draws || 0,
      })
    }
  }, [session, initMatchStats])

  
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (botTimerRef.current) {
        clearTimeout(botTimerRef.current)
        botTimerRef.current = null
      }
      setIsBotThinking(false)
      resetBoard()
    }
  }, [setIsBotThinking, resetBoard])

  useEffect(() => {
    const w = checkWinner(board)
    const botSide = playerSide === "X" ? "O" : "X"

    if (w && !winner) {
      setWinner(w)
    } else if (currentPlayer === botSide && !w && !isBotThinking && playerSide) {
      setIsBotThinking(true)
      botTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return
        const move = getBestMove(board, botSide, 0.2)
        if (move !== -1) {
          setSquare(move, botSide)
        }
        setIsBotThinking(false)
      }, 600 + Math.random() * 800)
    }
  }, [board, currentPlayer, winner, setWinner, setSquare, isBotThinking, setIsBotThinking, playerSide])

  useEffect(() => {
    if (winner && !scoreProcessedRef.current) {
      scoreProcessedRef.current = true
      const finish = async () => {
        if (!session) return
        let result: "win" | "lose" | "tie" = "tie"
        if (winner === playerSide) result = "win"
        else if (winner !== playerSide && winner !== "Tie") result = "lose"

        updateMatchStats(result)

        try {
          const res = await fetch("/api/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ result })
          })
          if (res.ok) {
            const data = await res.json()
            setScoreUpdate({ score: data.score, streak: data.winStreak })
            update()
          }
        } catch {
        }
      }
      finish()
    }
  }, [winner, session, update, playerSide, updateMatchStats])

  const handleRestart = () => {
    scoreProcessedRef.current = false
    setScoreUpdate(null)
    resetBoard()
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <main className="w-full h-screen relative bg-[#09090b] overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black to-transparent pointer-events-none">
        <div className="flex gap-4 items-center bg-black/60 backdrop-blur-xl rounded-none px-6 py-3 border border-red-500/30 pointer-events-auto shadow-[0_0_20px_rgba(239,68,68,0.1)] relative group">
          <div className="absolute -left-[2px] top-0 h-full w-[4px] bg-red-600"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-red-500/50 overflow-hidden bg-zinc-900 flex-shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              {session.user?.image ? (
                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${session.user?.name || 'Player'}&backgroundColor=09090b`} alt="Avatar" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-red-500/70 font-black uppercase tracking-[0.2em]">Live Connection</span>
              <span className="text-xl font-bold text-white uppercase tracking-tighter italic">{session.user?.name || "Player"}</span>
            </div>
          </div>
          <div className="w-px h-10 bg-red-500/20 mx-2"></div>
          <div className="text-center w-20">
            <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Score</span>
            <span className="block font-black text-white text-2xl tracking-tighter">{scoreUpdate ? scoreUpdate.score : session.user?.score}</span>
          </div>
          <div className="text-center w-20">
            <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Streak</span>
            <span className="block font-black text-red-600 text-glow-red text-2xl tracking-tighter">{scoreUpdate ? scoreUpdate.streak : session.user?.winStreak}</span>
          </div>
        </div>

        <button
          onClick={() => { window.location.href = "/" }}
          className="bg-zinc-900/80 hover:bg-red-950/80 backdrop-blur-md text-white px-6 py-3 rounded-none font-bold transition-all border border-neutral-800 hover:border-red-500 pointer-events-auto uppercase tracking-widest text-sm"
        >
          Exit
        </button>
      </div>

       {/* Side Statistics Sidebar */}
      <div className={`absolute left-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out flex pointer-events-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="w-72 h-full bg-black/90 backdrop-blur-3xl border-r border-red-500/20 flex flex-col p-6 pointer-events-auto overflow-hidden shadow-[20px_0_50px_rgba(0,0,0,0.8)]">
          <div className="mt-32 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              Session Stats
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-8">
              <div className="bg-zinc-900/80 p-3 border-t-2 border-green-500 rounded-sm text-center">
                <span className="text-2xl font-black text-white italic block leading-none">{matchStats.wins}</span>
                <span className="text-[9px] text-green-500/80 uppercase font-bold tracking-widest mt-1 block">Win</span>
              </div>
              <div className="bg-zinc-900/80 p-3 border-t-2 border-red-600 rounded-sm text-center">
                <span className="text-2xl font-black text-white italic block leading-none">{matchStats.losses}</span>
                <span className="text-[9px] text-red-500/80 uppercase font-bold tracking-widest mt-1 block">Lose</span>
              </div>
              <div className="bg-zinc-900/80 p-3 border-t-2 border-zinc-500 rounded-sm text-center">
                <span className="text-2xl font-black text-white italic block leading-none">{matchStats.draws}</span>
                <span className="text-[9px] text-zinc-500/80 uppercase font-bold tracking-widest mt-1 block">Draw</span>
              </div>
            </div>

            <h3 className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-zinc-800">
              Recent Activity (Last 10)
            </h3>
            
            <div className="flex flex-col gap-2">
              {recentGames.length === 0 ? (
                <div className="text-zinc-600 text-xs italic text-center py-4">No recent matches found</div>
              ) : (
                recentGames.map((res, i) => (
                  <div key={i} className={`flex items-center justify-between p-2 px-3 border-l-2 bg-gradient-to-r from-zinc-900/80 to-transparent ${
                    res === "win" ? "border-green-500" : res === "lose" ? "border-red-600" : "border-zinc-500"
                  }`}>
                    <span className="text-zinc-400 font-mono text-[10px] opacity-50">#{i + 1}</span>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${
                      res === "win" ? "text-green-500" : res === "lose" ? "text-red-500" : "text-white"
                    }`}>
                      {res === "tie" ? "DRAW" : res}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-zinc-800/50">
            <div className="p-3 bg-red-950/10 border border-red-500/5 text-[9px] text-red-500/50 font-bold uppercase tracking-[0.2em] text-center">
              System Online // Stable
            </div>
          </div>
        </div>
        
        {/* Modern Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-40 -right-14 group h-48 w-14 bg-zinc-900/90 hover:bg-black backdrop-blur-xl border-y border-r border-red-500/30 hover:border-red-500 flex flex-col items-center justify-center gap-4 pointer-events-auto transition-all duration-300 rounded-r-xl shadow-[10px_0_30px_rgba(239,68,68,0.2)] cursor-pointer"
        >
          <div className={`w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent transition-transform duration-300 ${
              isSidebarOpen 
                ? "border-r-[10px] border-r-red-500 group-hover:border-r-red-400" 
                : "border-l-[10px] border-l-red-500 group-hover:border-l-red-400"
            }`}
          ></div>
          <span className="text-red-500 group-hover:text-red-400 font-black text-xs tracking-[0.3em] uppercase transition-colors" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
            STATS
          </span>
        </button>
      </div>

      <div className="flex-1 w-full h-full">
        <Game3D />
      </div>

      {!winner && playerSide && (
        <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none pb-8 flex justify-center">
          <div className={`px-16 py-3 rounded-none backdrop-blur-3xl border-t-2 border-b-2 font-black text-xl tracking-[0.4em] transition-all uppercase flex items-center gap-6 ${currentPlayer === playerSide 
            ? "bg-red-950/30 text-red-500 border-red-600/60 shadow-[0_0_40px_rgba(239,68,68,0.25)]" 
            : "bg-black/60 text-zinc-700 border-zinc-800/50"
            }`}>
            {currentPlayer === playerSide && (
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </div>
            )}
            {currentPlayer === playerSide ? "Your Turn" : "CPU Thinking..."}
          </div>
        </div>
      )}

      {/* Side Selection Overlay */}
      {!playerSide && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-black text-white mb-12 tracking-[0.5em] uppercase italic">Choose Your Protocol</h2>
            <div className="flex gap-12">
              <button
                onClick={() => setPlayerSide("X")}
                className="group relative w-40 h-40 border-2 border-zinc-800 hover:border-red-600 transition-all duration-500 flex items-center justify-center hover:scale-110 active:scale-95"
              >
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors"></div>
                <span className="text-8xl font-black text-zinc-700 group-hover:text-red-500 transition-colors">X</span>
                <span className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 font-bold tracking-widest text-sm">INITIATOR</span>
              </button>
              <button
                onClick={() => setPlayerSide("O")}
                className="group relative w-40 h-40 border-2 border-zinc-800 hover:border-red-600 transition-all duration-500 flex items-center justify-center hover:scale-110 active:scale-95"
              >
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors"></div>
                <span className="text-8xl font-black text-zinc-700 group-hover:text-red-500 transition-colors">O</span>
                <span className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 font-bold tracking-widest text-sm">DEFENDER</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {winner && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className={`bg-zinc-950 px-12 rounded-none border-t-4 border-b-4 flex flex-col items-center max-w-lg w-full text-center py-12 relative overflow-hidden ${
              winner === playerSide 
                ? "animate-success border-emerald-500" 
                : winner !== "Tie" 
                  ? "animate-failure border-red-600" 
                  : "animate-draw border-zinc-500"
            }`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"></div>
            <h2 className={`text-6xl md:text-7xl font-black mb-4 tracking-tighter uppercase ${
                winner === playerSide 
                  ? "text-emerald-400 text-glow-green" 
                  : winner !== "Tie" 
                    ? "text-zinc-100 text-glow-red" 
                    : "text-cyan-400 text-glow-cyan"
              }`}>
              {winner === playerSide ? "VICTORY" : winner !== "Tie" ? "DEFEATED" : "DRAW"}
            </h2>

            <p className="text-lg text-neutral-400 mb-10 font-mono tracking-tight">
              {winner === playerSide
                ? "MISSION ACCOMPLISHED. CPU DESTROYED."
                : winner !== "Tie"
                  ? "SYSTEM FAILURE. CPU IS SUPERIOR."
                  : "STALEMATE. NO RESOLUTION FOUND."}
            </p>

            <div className="flex flex-col gap-4 w-full px-12">
              <button
                onClick={handleRestart}
                className="w-full px-8 py-4 bg-red-600 hover:bg-red-500 rounded-none font-bold text-xl transition-all box-glow-red uppercase tracking-widest text-white"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={() => { window.location.href = "/leaderboard" }}
                className="w-full px-8 py-4 bg-transparent hover:bg-zinc-900 rounded-none font-bold text-lg transition-all border border-neutral-700 hover:border-white uppercase tracking-widest text-neutral-300"
              >
                STANDINGS
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
