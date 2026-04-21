"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useGameStore } from "@/lib/store"
import { checkWinner } from "@/lib/game-logic"
import { getBestMoveO } from "@/lib/ai"
import Game3D from "../components/Game3D"

export default function PlayPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { board, currentPlayer, setSquare, winner, setWinner, isBotThinking, setIsBotThinking, resetBoard } = useGameStore()
  const [scoreUpdate, setScoreUpdate] = useState<{ score: number, streak: number } | null>(null)
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    const w = checkWinner(board)
    if (w && !winner) {
      setWinner(w)
    } else if (currentPlayer === "O" && !w && !isBotThinking) {
      setIsBotThinking(true)
      setTimeout(() => {
        const move = getBestMoveO(board, 0.2) 
        if (move !== -1) {
          setSquare(move, "O")
        }
        setIsBotThinking(false)
      }, 600 + Math.random() * 800)
    }
  }, [board, currentPlayer, winner, setWinner, setSquare, isBotThinking, setIsBotThinking])

  useEffect(() => {
    if (winner) {
      const finish = async () => {
        if (!session) return
        let result = "tie"
        if (winner === "X") result = "win"
        else if (winner === "O") result = "lose"

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
  }, [winner, session, update])

  const handleRestart = () => {
    setScoreUpdate(null)
    resetBoard()
  }

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
      </div>
    )
  }

  return (
    <main className="w-full h-screen relative bg-[#09090b] overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black to-transparent pointer-events-none">
        <div className="flex gap-4 items-center bg-zinc-950/80 backdrop-blur-md rounded-none px-6 py-3 border-l-4 border-red-600 border border-white/10 pointer-events-auto shadow-lg">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Player</span>
            <span className="text-lg font-bold text-white uppercase tracking-wider">{session.user?.name || "Player"}</span>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center w-16">
            <span className="block text-xs text-neutral-500 uppercase font-bold tracking-widest">Score</span>
            <span className="block font-black text-white text-xl">{scoreUpdate ? scoreUpdate.score : session.user?.score}</span>
          </div>
          <div className="text-center w-16">
            <span className="block text-xs text-neutral-500 uppercase font-bold tracking-widest">Streak</span>
            <span className="block font-black text-red-500 text-glow-red text-xl">{scoreUpdate ? scoreUpdate.streak : session.user?.winStreak}</span>
          </div>
        </div>

        <button 
          onClick={() => router.push("/")}
          className="bg-zinc-900/80 hover:bg-red-950/80 backdrop-blur-md text-white px-6 py-3 rounded-none font-bold transition-all border border-neutral-800 hover:border-red-500 pointer-events-auto uppercase tracking-widest text-sm"
        >
          Exit
        </button>
      </div>

      <div className="flex-1 w-full h-full">
        <Game3D />
      </div>

      {!winner && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className={`px-8 py-3 rounded-none backdrop-blur-xl border font-bold text-xl tracking-[0.2em] transition-all uppercase ${
            currentPlayer === "X" ? "bg-red-950/40 text-red-400 border-red-500 box-glow-red shadow-lg" : "bg-black/60 text-zinc-400 border-zinc-700"
          }`}>
            {currentPlayer === "X" ? "WARNING: YOUR TURN" : "SYSTEM THINKING..."}
          </div>
        </div>
      )}

      {winner && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-950 p-12-0 rounded-none border-t-4 border-b-4 border-red-600 shadow-[0_0_50px_rgba(239,68,68,0.2)] flex flex-col items-center max-w-lg w-full text-center py-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
            <h2 className={`text-6xl md:text-7xl font-black mb-4 tracking-tighter uppercase ${
              winner === "X" ? "text-red-500 text-glow-red" : winner === "O" ? "text-zinc-600" : "text-white"
            }`}>
              {winner === "X" ? "VICTORY" : winner === "O" ? "DEFEATED" : "DRAW"}
            </h2>
            
            <p className="text-lg text-neutral-400 mb-10 font-mono">
              {winner === "X" 
                ? "MISSION ACCOMPLISHED. CPU DESTROYED." 
                : winner === "O" 
                  ? "SYSTEM FAILURE. CPU IS SUPERIOR." 
                  : "STALEMATE. NO RESOLUTION."}
            </p>
            
            <div className="flex flex-col gap-4 w-full px-12">
              <button 
                onClick={handleRestart}
                className="w-full px-8 py-4 bg-red-600 hover:bg-red-500 rounded-none font-bold text-xl transition-all box-glow-red uppercase tracking-widest text-white"
              >
                PLAY AGAIN
              </button>
              <button 
                onClick={() => router.push("/leaderboard")}
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
