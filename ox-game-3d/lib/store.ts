import { create } from "zustand"
import { Player } from "./game-logic"

interface GameState {
  board: Player[]
  currentPlayer: Player
  winner: Player | "Tie" | null
  isBotThinking: boolean
  setSquare: (index: number, player: Player) => void
  setWinner: (winner: Player | "Tie" | null) => void
  setIsBotThinking: (thinking: boolean) => void
  resetBoard: () => void
}

export const useGameStore = create<GameState>((set) => ({
  board: Array(9).fill(null),
  currentPlayer: "X",
  winner: null,
  isBotThinking: false,
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
  resetBoard: () => set({
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    isBotThinking: false
  })
}))
