import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./components/Providers"
import WebglBodyguard from "./components/WebglBodyguard"
import Script from "next/script"

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
        <Script id="navigation-checker" strategy="beforeInteractive">
          {`
            (function() {
              const navigate = performance.getEntriesByType("navigation")[0];
              if (navigate && navigate.type === "back_forward") {
                window.location.reload();
              }
            })();
          `}
        </Script>
        <Providers>
          <WebglBodyguard />
          {children}
        </Providers>
      </body>
    </html>
  )
}
