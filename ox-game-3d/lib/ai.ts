import { Player, checkWinner, getAvailableMoves } from "./game-logic"

const SCORES = {
  X: -10,
  O: 10,
  Tie: 0,
}

function minimax(board: Player[], depth: number, isMaximizing: boolean): number {
  const result = checkWinner(board)
  if (result === "O") return SCORES.O - depth
  if (result === "X") return SCORES.X + depth
  if (result === "Tie") return SCORES.Tie

  const availableMoves = getAvailableMoves(board)

  if (isMaximizing) {
    let bestScore = -Infinity
    for (const move of availableMoves) {
      board[move] = "O"
      const score = minimax(board, depth + 1, false)
      board[move] = null
      bestScore = Math.max(score, bestScore)
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (const move of availableMoves) {
      board[move] = "X"
      const score = minimax(board, depth + 1, true)
      board[move] = null
      bestScore = Math.min(score, bestScore)
    }
    return bestScore
  }
}

export function getBestMoveO(board: Player[], mistakeProbability: number = 0.2): number {
  const availableMoves = getAvailableMoves(board)
  if (availableMoves.length === 0) return -1

  if (Math.random() < mistakeProbability) {
    const randomIndex = Math.floor(Math.random() * availableMoves.length)
    return availableMoves[randomIndex]
  }

  let bestScore = -Infinity
  let bestMove = -1

  for (const move of availableMoves) {
    board[move] = "O"
    const score = minimax(board, 0, false)
    board[move] = null
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove !== -1 ? bestMove : availableMoves[0]
}
