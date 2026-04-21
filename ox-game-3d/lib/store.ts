import { create } from "zustand"
import { Player } from "./game-logic"

interface GameState {
  board: Player[]
  currentPlayer: Player
  winner: Player | "Tie" | null
  isBotThinking: boolean
  playerSide: Player // "X" or "O" or null (if not chosen)
  matchStats: {
    wins: number
    losses: number
    draws: number
  }
  recentGames: ("win" | "lose" | "tie")[] // Last 10 games
  setSquare: (index: number, player: Player) => void
  setWinner: (winner: Player | "Tie" | null) => void
  setIsBotThinking: (thinking: boolean) => void
  setPlayerSide: (side: Player) => void
  updateMatchStats: (result: "win" | "lose" | "tie") => void
  resetBoard: () => void
}

export const useGameStore = create<GameState>((set) => ({
  board: Array(9).fill(null),
  currentPlayer: "X",
  winner: null,
  isBotThinking: false,
  playerSide: null,
  matchStats: {
    wins: 0,
    losses: 0,
    draws: 0
  },
  recentGames: [],
  setSquare: (index, player) => set((state) => {
    const newBoard = [...state.board]
    newBoard[index] = player
    return {
      board: newBoard,
      currentPlayer: player === "X" ? "O" : "X"
    }
  }),
  setWinner: (winner) => set({ winner }),
  setIsBotThinking: (isBotThinking) => set({ isBotThinking }),
  setPlayerSide: (side) => set({ playerSide: side, currentPlayer: side ?? "X" }),
  updateMatchStats: (result) => set((state) => {
    const newRecent = [result, ...state.recentGames].slice(0, 10)
    return {
      matchStats: {
        ...state.matchStats,
        wins: result === "win" ? state.matchStats.wins + 1 : state.matchStats.wins,
        losses: result === "lose" ? state.matchStats.losses + 1 : state.matchStats.losses,
        draws: result === "tie" ? state.matchStats.draws + 1 : state.matchStats.draws,
      },
      recentGames: newRecent
    }
  }),
  resetBoard: () => set((state) => ({
    board: Array(9).fill(null),
    currentPlayer: state.playerSide ?? "X",
    winner: null,
    isBotThinking: false
  }))
}))
