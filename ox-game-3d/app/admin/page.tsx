"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const Background3D = dynamic(() => import("../components/Background3D"), { ssr: false })

interface Player {
  id: string
  name: string
  score: number
  winStreak: number
  wins: number
  losses: number
  draws: number
  loginMethod: string
}

interface MatchRecord {
  id: string
  result: 'WIN' | 'LOSS' | 'DRAW'
  createdAt: string
}

export default function AdminPage() {
  const [isLogged, setIsLogged] = useState(false)
  const [adminId, setAdminId] = useState("")
  const [adminPw, setAdminPw] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null) 
  const [historyPlayer, setHistoryPlayer] = useState<Player | null>(null)
  const [matches, setMatches] = useState<MatchRecord[]>([])
  const [matchesLoading, setMatchesLoading] = useState(false)

  // Persist Login Status
  useEffect(() => {
    const savedId = sessionStorage.getItem("admin_id")
    const savedPw = sessionStorage.getItem("admin_pw")
    
    if (savedId && savedPw) {
      // Auto-validate and fetch
      const validate = async () => {
        try {
          const res = await fetch("/api/admin/players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminId: savedId, adminPw: savedPw })
          })
          const data = await res.json()
          if (res.ok) {
            setAdminId(savedId)
            setAdminPw(savedPw)
            setPlayers(data.players)
            setIsLogged(true)
          }
        } catch (err) { console.error(err) }
      }
      validate()
    }
  }, [])

  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/admin/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, adminPw })
      })
      const data = await res.json()
      if (res.ok) setPlayers(data.players)
    } catch (err) { console.error(err) }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, adminPw })
      })

      const data = await res.json()

      if (res.ok) {
        sessionStorage.setItem("admin_id", adminId)
        sessionStorage.setItem("admin_pw", adminPw)
        setPlayers(data.players)
        setIsLogged(true)
      } else {
        setError(data.error || "ACCESS DENIED")
      }
    } catch (err) {
      setError("COMMUNICATION_LINK_FAILURE")
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    sessionStorage.removeItem("admin_id")
    sessionStorage.removeItem("admin_pw")
    setIsLogged(false)
  }

  const handleAction = async (id: string, type: 'reset' | 'delete') => {
    try {
      const method = type === 'reset' ? 'PATCH' : 'DELETE'
      const res = await fetch(`/api/admin/players/${id}`, {
        method,
        headers: { 
          "x-admin-id": adminId,
          "x-admin-pw": adminPw
        }
      })
      if (res.ok) {
        await fetchPlayers()
        setActionId(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchMatches = async (player: Player) => {
    setHistoryPlayer(player)
    setMatchesLoading(true)
    try {
      const res = await fetch(`/api/admin/players/${player.id}/matches`, {
        headers: {
          "x-admin-id": adminId,
          "x-admin-pw": adminPw
        }
      })
      const data = await res.json()
      if (res.ok) setMatches(data.matches)
    } catch (err) {
      console.error(err)
    } finally {
      setMatchesLoading(false)
    }
  }

  const MatchHistoryModal = () => {
    if (!historyPlayer) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-zinc-950 border border-emerald-500/30 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <div className="p-6 border-b border-emerald-500/20 flex justify-between items-center bg-emerald-500/5">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">MATCH HISTORY: {historyPlayer.name}</h2>
              <p className="text-[10px] text-emerald-500/60 font-mono italic">ACCESSING CHRONICLES // ID: {historyPlayer.id}</p>
            </div>
            <button onClick={() => setHistoryPlayer(null)} className="text-white hover:text-white transition-colors p-2 text-xl">&times;</button>
          </div>
          
          <div className="flex-1 overflow-auto p-6 space-y-3">
            {matchesLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-1 bg-emerald-500/20 relative overflow-hidden">
                   <div className="absolute inset-0 bg-emerald-500 animate-slide-loading"></div>
                </div>
                <p className="text-[10px] text-emerald-500/40 animate-pulse font-mono">RETRIEVING_DATA_FROM_GRID...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-20 text-zinc-600 font-mono text-xs uppercase tracking-widest border border-dashed border-zinc-800">
                No battle logs found for this entity.
              </div>
            ) : (
              <div className="space-y-2">
                {matches.map((match) => (
                  <div key={match.id} className="group border border-zinc-900 bg-zinc-900/20 p-4 flex justify-between items-center hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4">
                       <div className={`w-2 h-2 rounded-full shadow-sm ${
                         match.result === 'WIN' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                         match.result === 'LOSS' ? 'bg-red-500 shadow-red-500/50' : 'bg-yellow-500 shadow-yellow-500/50'
                       }`}></div>
                       <span className={`text-sm font-black tracking-widest uppercase ${
                         match.result === 'WIN' ? 'text-emerald-400' : 
                         match.result === 'LOSS' ? 'text-red-400' : 'text-yellow-400'
                       }`}>{match.result}</span>
                    </div>
                    <span className="text-[10px] text-white font-mono">
                      {new Date(match.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-zinc-900 bg-black/40 flex justify-end">
          
          </div>
        </div>
      </div>
    );
  }

  // Calculate System Stats
  const totalScore = players.reduce((acc, p) => acc + p.score, 0)
  const avgStreak = players.length > 0 ? (players.reduce((acc, p) => acc + p.winStreak, 0) / players.length).toFixed(1) : 0
  const guestCount = players.filter(p => p.loginMethod === 'GUEST_PROTOCOL').length

  if (!isLogged) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 relative bg-black overflow-hidden">
        <Background3D />
        <div className="z-10 bg-black/80 backdrop-blur-xl p-10 border border-red-500/30 max-w-md w-full relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">ADMIN CENTER</h1>
          <p className="text-red-500/60 text-xs font-mono mb-8 uppercase tracking-widest">Authorized Personnel Only</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-2 font-bold">Username</label>
              <input 
                type="text" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white font-mono focus:border-red-500 outline-none transition-all placeholder:text-zinc-700"
                placeholder="ID_REQ"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-2 font-bold">Password</label>
              <input 
                type="password" 
                value={adminPw}
                onChange={(e) => setAdminPw(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white font-mono focus:border-red-500 outline-none transition-all placeholder:text-zinc-700"
                placeholder="PW_REQ"
                required
              />
            </div>

            {error && <div className="text-red-500 font-mono text-xs p-2 bg-red-950/20 border-l-2 border-red-500">{error}</div>}

            <button 
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 box-glow-red"
            >
              {loading ? "INITIALIZING..." : "LOGIN"}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col p-8 lg:p-12 relative bg-black overflow-hidden font-mono text-zinc-300">
      <Background3D />
      
      <div className="z-10 w-full max-w-7xl mx-auto flex flex-col h-full bg-black/60 border border-emerald-500/20 backdrop-blur-md relative shadow-2xl">
        {/* Header Section */}
        <div className="p-8 border-b border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-zinc-950/50">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">ADMIN DASHBOARD</h1>
            </div>
            <p className="text-emerald-500/60 text-[10px] uppercase tracking-[0.3em] font-bold italic text-white flex items-center gap-2">
               <span className="opacity-20">|</span> TOTAL PLAYERS: {players.length}
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full lg:w-auto">
             <div className="bg-zinc-900/40 p-4 border-l border-zinc-700">
                <p className="text-[10px] text-zinc-500 uppercase mb-1">Total Users</p>
                <p className="text-2xl font-black text-white">{players.length}</p>
             </div>
             <div className="bg-zinc-900/40 p-4 border-l border-emerald-500/50">
                <p className="text-[10px] text-zinc-500 uppercase mb-1">Total Score</p>
                <p className="text-2xl font-black text-emerald-400">{totalScore}</p>
             </div>
             <div className="bg-zinc-900/40 p-4 border-l border-cyan-500/50">
                <p className="text-[10px] text-zinc-500 uppercase mb-1">Avg Streak</p>
                <p className="text-2xl font-black text-cyan-400">{avgStreak}</p>
             </div>
             <div className="bg-zinc-900/40 p-4 border-l border-orange-500/50">
                <p className="text-[10px] text-zinc-500 uppercase mb-1">Guests</p>
                <p className="text-2xl font-black text-orange-400">{guestCount}</p>
             </div>
          </div>
          
          <button 
            onClick={handleDisconnect}
            className="px-6 py-2 border border-zinc-800 hover:border-red-500 hover:text-red-500 transition-all uppercase text-xs font-bold bg-black/40"
          >
            DISCONNECT
          </button>
        </div>

        {/* Players Management Section */}
        <div className="flex-1 overflow-auto p-8">
          <div className="border border-white/5 bg-black/40 shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950 text-[10px] text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="p-6 font-bold">Identifier</th>
                  <th className="p-6 font-bold text-center">Protocol</th>
                  <th className="p-6 font-bold text-center">Score</th>
                  <th className="p-6 font-bold text-center">Streak</th>
                  <th className="p-6 font-bold text-center">W/L/D</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-emerald-500/0 group-hover:bg-emerald-500 transition-all"></div>
                        <div>
                          <p className="text-white font-bold text-base leading-none mb-1">{player.name}</p>
                          <p className="text-[10px] text-zinc-600 lowercase tracking-tighter">{player.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`text-[9px] px-2 py-1 border ${
                        player.loginMethod === 'GUEST_PROTOCOL' 
                        ? 'border-orange-500/30 text-orange-400 bg-orange-950/20' 
                        : 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20'
                      } uppercase font-bold tracking-[0.15em]`}>
                        {player.loginMethod}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <p className="text-2xl font-black text-white">{player.score}</p>
                    </td>
                    <td className="p-6 text-center">
                      <p className={`text-2xl font-black ${player.winStreak > 3 ? 'text-red-500 text-glow-red' : 'text-zinc-500'}`}>
                        {player.winStreak}
                      </p>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-1 font-mono text-[10px] font-bold">
                        <span className="text-emerald-500">{player.wins}W</span>
                        <span className="text-zinc-700">/</span>
                        <span className="text-red-500">{player.losses}L</span>
                        <span className="text-zinc-700">/</span>
                        <span className="text-yellow-500">{player.draws}D</span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      {actionId === player.id ? (
                        <div className="flex gap-2 justify-end animate-in fade-in slide-in-from-right-2 duration-300">
                            <button 
                               onClick={() => handleAction(player.id, 'reset')}
                                className="px-3 py-1 bg-orange-600/20 text-orange-500 border border-orange-500/50 text-[10px] font-bold hover:bg-orange-600 hover:text-white transition-all uppercase"
                            >
                                Confirm Reset
                            </button>
                            <button 
                               onClick={() => handleAction(player.id, 'delete')}
                                className="px-3 py-1 bg-red-600/20 text-red-500 border border-red-500/50 text-[10px] font-bold hover:bg-red-600 hover:text-white transition-all uppercase"
                            >
                                Confirm Delete
                            </button>
                            <button 
                               onClick={() => setActionId(null)}
                                className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase hover:bg-zinc-700 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                           <button 
                            onClick={() => fetchMatches(player)}
                            className="px-3 py-2 border border-emerald-500/20 hover:border-emerald-500 hover:text-emerald-400 text-[10px] font-bold uppercase tracking-widest transition-all bg-emerald-500/5"
                          >
                             History
                          </button>
                          <button 
                            onClick={() => setActionId(player.id)}
                            className="px-4 py-2 border border-zinc-800 hover:border-white hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all bg-black/20"
                          >
                             Manage
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Monitoring Footer */}
        <div className="p-4 bg-zinc-950/80 border-t border-white/5 text-[10px] text-zinc-600 flex justify-between uppercase tracking-widest">
        <div className="flex gap-6 italic">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></span>
            CORE_ENGINE_ACTIVE
          </span>
          <span>MEM: 64.2MB</span>
          <span>Uptime: 04:22:15</span>
        </div>
        <div className="flex gap-4">
           <span>SECURE_SHELL_LINK: ON</span>
           <span className="text-zinc-800">|</span>
           <span>BUILD_REF: v2.4.2-final</span>
        </div>
      </div>
    </div>

    {/* Match History Modal Render */}
    {historyPlayer && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-zinc-950 border border-emerald-500/30 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <div className="p-6 border-b border-emerald-500/20 flex justify-between items-center bg-emerald-500/5">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">MATCH HISTORY: {historyPlayer.name}</h2>
              <p className="text-[10px] text-emerald-500/60 font-mono italic">ACCESSING CHRONICLES // ID: {historyPlayer.id}</p>
            </div>
            <button onClick={() => setHistoryPlayer(null)} className="text-white hover:text-white transition-colors p-2 text-xl">&times;</button>
          </div>
          
          <div className="flex-1 overflow-auto p-6 space-y-3">
            {matchesLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-1 bg-emerald-500/20 relative overflow-hidden">
                   <div className="absolute inset-0 bg-emerald-500 animate-slide-loading"></div>
                </div>
                <p className="text-[10px] text-emerald-500/40 animate-pulse font-mono">RETRIEVING DATA FROM GRID...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-20 text-zinc-600 font-mono text-xs uppercase tracking-widest border border-dashed border-zinc-800">
                No battle logs found for this entity.
              </div>
            ) : (
              <div className="space-y-2">
                {matches.map((match) => (
                  <div key={match.id} className="group border border-zinc-900 bg-zinc-900/20 p-4 flex justify-between items-center hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4">
                       <div className={`w-2 h-2 rounded-full shadow-sm ${
                         match.result === 'WIN' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                         match.result === 'LOSS' ? 'bg-red-500 shadow-red-500/50' : 'bg-yellow-500 shadow-yellow-500/50'
                       }`}></div>
                       <span className={`text-sm font-black tracking-widest uppercase ${
                         match.result === 'WIN' ? 'text-emerald-400' : 
                         match.result === 'LOSS' ? 'text-red-400' : 'text-yellow-400'
                       }`}>{match.result}</span>
                    </div>
                    <span className="text-[10px] text-white font-mono">
                      {new Date(match.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-zinc-900 bg-black/40 flex justify-end">
            
          </div>
        </div>
      </div>
    )}
    
    <style jsx global>{`
      @keyframes slide-loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
      .animate-slide-loading {
        animation: slide-loading 1.5s infinite linear;
      }
    `}</style>
  </main>
  )
}
