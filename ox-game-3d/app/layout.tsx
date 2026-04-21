import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./components/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OX Game 3D",
  description: "Advanced Tic-Tac-Toe Game",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 text-white selection:bg-red-500/30`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
