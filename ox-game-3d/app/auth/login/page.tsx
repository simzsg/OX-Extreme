"use client"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const Background3D = dynamic(() => import("@/app/components/Background3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-black" />
})

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    if (error) {
      window.history.replaceState(null, '', '/auth/login')
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setLoading(null)
      }
    }
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setLoading(null)
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("pageshow", onPageShow)
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("pageshow", onPageShow)
    }
  }, [error])

  const handleSignIn = async (provider: string) => {
    setLoading(provider)
    try {
      await signIn(provider, { callbackUrl: "/play" })
    } catch {
      setLoading(null)
    }
    setTimeout(() => {
      setLoading(null)
    }, 4000)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black">
      <Background3D />
      
      <div className="z-10 bg-black/80 backdrop-blur-2xl p-8 md:p-12 rounded-2xl border border-red-500/30 box-glow-red max-w-md w-full relative text-center">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Sign In
        </h1>
        <p className="text-neutral-400 mb-8 text-sm">Please choose your sign in method</p>
        
        <div className="space-y-3">
          {error && (
            <div className="bg-red-950/50 border border-red-500 text-red-500 text-xs p-3 rounded-lg font-mono mb-4 text-left">
              [AUTHENTICATION_FAILED]: Provider rejected the request. Please select another.
            </div>
          )}

          <button 
            disabled={loading !== null}
            onClick={() => handleSignIn("github")}
            className={`w-full px-6 py-3 bg-[#24292F] hover:bg-[#24292F]/90 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-3 border border-neutral-700 ${loading === "github" ? "opacity-50 pointer-events-none animate-pulse" : (loading ? "opacity-50 pointer-events-none" : "")}`}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            Continue with GitHub
          </button>
          
          <button 
            disabled={loading !== null}
            onClick={() => handleSignIn("google")}
            className={`w-full px-6 py-3 bg-white hover:bg-neutral-100 text-black rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-3 border border-neutral-300 ${loading === "google" ? "opacity-50 pointer-events-none animate-pulse" : (loading ? "opacity-50 pointer-events-none" : "")}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
            Continue with Google
          </button>
          
          <button 
            disabled={loading !== null}
            onClick={() => handleSignIn("discord")}
            className={`w-full px-6 py-3 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-3 border border-[#5865F2] ${loading === "discord" ? "opacity-50 pointer-events-none animate-pulse" : (loading ? "opacity-50 pointer-events-none" : "")}`}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/></svg>
            Continue with Discord
          </button>
          
          <button 
            disabled={loading !== null}
            onClick={() => handleSignIn("facebook")}
            className={`w-full px-6 py-3 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-3 border border-[#1877F2] ${loading === "facebook" ? "opacity-50 pointer-events-none animate-pulse" : (loading ? "opacity-50 pointer-events-none" : "")}`}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
          </button>
          
          <button 
            disabled={loading !== null}
            onClick={() => handleSignIn("line")}
            className={`w-full px-6 py-3 bg-[#00C300] hover:bg-[#00C300]/90 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-3 border border-[#00C300] ${loading === "line" ? "opacity-50 pointer-events-none animate-pulse" : (loading ? "opacity-50 pointer-events-none" : "")}`}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.963 8.878 9.278 9.589.36.082.852.259 1.002.597.135.303.087.77.042 1.082 0 0-.131.792-.159.957-.046.282-.218 1.155 1.011.637 1.229-.519 6.643-3.896 9.418-6.936 2.258-2.483 3.408-4.992 3.408-5.926zm-15.021 3.23h-2.583c-.426 0-.771-.345-.771-.771v-4.945c0-.426.345-.771.771-.771.426 0 .771.345.771.771v4.174h1.812c.426 0 .771.345.771.771s-.345.771-.771.771zm3.842-.771c0 .426-.345.771-.771.771-.426 0-.771-.345-.771-.771v-4.945c0-.426.345-.771.771-.771.426 0 .771.345.771.771v4.945zm3.818 0c0 .426-.345.771-.771.771s-.771-.345-.771-.771v-2.82l-1.921 2.656c0 .01-.008.016-.012.025-.01.012-.022.02-.034.029-.012.008-.022.016-.036.023-.014.006-.027.012-.041.016-.016.004-.031.008-.047.01-.018.002-.035.004-.055.004-.02 0-.037-.002-.055-.004-.016-.002-.031-.006-.047-.01-.014-.004-.027-.01-.041-.018-.014-.006-.024-.014-.038-.023-.012-.008-.024-.018-.034-.033-.002-.006-.006-.008-.008-.014-.047-.068-.073-.153-.073-.243v-4.945c0-.426.345-.771.771-.771s.771.345.771.771v2.82l1.921-2.656c0-.01.008-.016.012-.025.01-.012.022-.02.034-.029.012-.008.022-.016.036-.023.014-.006.027-.012.041-.016.016-.004.031-.008.047-.01.018-.002.035-.004.055-.004.02 0 .037.002.055.004.016.002.031.006.047.01.014.004.027.01.041.018.014.006.024.014.038.023.012.008.024.018.034.033.002.006.006.008.008.014.047.068.073.153.073.243v4.945z"/></svg>
            Continue with LINE
          </button>
        </div>

        <button 
          onClick={() => { window.location.href = "/" }}
          className="mt-8 text-neutral-500 hover:text-white font-medium text-sm transition-colors block mx-auto"
        >
          Back to Home
        </button>
      </div>
    </main>
  )
}
