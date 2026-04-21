import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      score: number
      winStreak: number
      wins: number
      losses: number
      draws: number
    }
  }

  interface User {
    score: number
    winStreak: number
    wins: number
    losses: number
    draws: number
  }
}
