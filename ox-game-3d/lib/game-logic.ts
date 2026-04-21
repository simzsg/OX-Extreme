export type Player = "X" | "O" | null

export function checkWinner(board: Player[]): Player | "Tie" {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (const line of lines) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }

  if (board.every((cell) => cell !== null)) {
    return "Tie"
  }

  return null
}

export function getAvailableMoves(board: Player[]): number[] {
  return board.map((val, i) => (val === null ? i : -1)).filter((val) => val !== -1)
}
