import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import FacebookProvider from "next-auth/providers/facebook"
import LineProvider from "next-auth/providers/line"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "mock-github-id",
      clientSecret: process.env.GITHUB_SECRET || "mock-github-secret",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-secret",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "mock-discord-id",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "mock-discord-secret",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "mock-facebook-id",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "mock-facebook-secret",
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID || "mock-line-id",
      clientSecret: process.env.LINE_CLIENT_SECRET || "mock-line-secret",
    }),
    CredentialsProvider({
      name: "Mock Account",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "test" }
      },
      async authorize(credentials) {
        if (!credentials?.username) return null
        const email = `${credentials.username}@example.com`
        let user = await prisma.user.findUnique({
          where: { email }
        })
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: credentials.username,
              email,
            }
          })
        }
        return { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          score: user.score,
          winStreak: user.winStreak,
          wins: user.wins,
          losses: user.losses,
          draws: user.draws
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub }
        })
        if (dbUser) {
          session.user.id = dbUser.id
          session.user.score = dbUser.score
          session.user.winStreak = dbUser.winStreak
          session.user.wins = dbUser.wins
          session.user.losses = dbUser.losses
          session.user.draws = dbUser.draws
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  }
}
