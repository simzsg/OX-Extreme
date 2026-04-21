import { Player, checkWinner, getAvailableMoves } from "./game-logic"

const WIN_SCORE = 10
const LOSE_SCORE = -10
const TIE_SCORE = 0

function minimax(board: Player[], depth: number, isMaximizing: boolean, botPlayer: Player): number {
  const result = checkWinner(board)
  const humanPlayer = botPlayer === "X" ? "O" : "X"

  if (result === botPlayer) return WIN_SCORE - depth
  if (result === humanPlayer) return LOSE_SCORE + depth
  if (result === "Tie") return TIE_SCORE

  const availableMoves = getAvailableMoves(board)

  if (isMaximizing) {
    let bestScore = -Infinity
    for (const move of availableMoves) {
      board[move] = botPlayer
      const score = minimax(board, depth + 1, false, botPlayer)
      board[move] = null
      bestScore = Math.max(score, bestScore)
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (const move of availableMoves) {
      board[move] = humanPlayer
      const score = minimax(board, depth + 1, true, botPlayer)
      board[move] = null
      bestScore = Math.min(score, bestScore)
    }
    return bestScore
  }
}



// 0.0 (โหมดยาก): บอทจะไม่มีวันเดินพลาดเลย ผู้เล่นจะทำได้แค่เสมอหรือแพ้เท่านั้น
// 0.2 (โหมดปกติ): บอทมีโอกาสเดินมั่ว 20% เพื่อเปิดช่องให้ชนะได้บ้าง
// 0.5 (โหมดง่าย): บอทจะเดินมั่ว 50% ทำให้เล่นง่ายขึ้นมาก
// 1.0 (โหมดง่ายสุด): บอทจะเดินสุ่มอย่างเดียวเลย
export function getBestMove(board: Player[], botPlayer: Player, mistakeProbability: number = 0.2): number {
  const availableMoves = getAvailableMoves(board)
  if (availableMoves.length === 0) return -1


  if (Math.random() < mistakeProbability) {
    const randomIndex = Math.floor(Math.random() * availableMoves.length)
    return availableMoves[randomIndex]
  }

  let bestScore = -Infinity
  let bestMove = -1

  for (const move of availableMoves) {
    board[move] = botPlayer
    const score = minimax(board, 0, false, botPlayer)
    board[move] = null
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove !== -1 ? bestMove : availableMoves[0]
}
