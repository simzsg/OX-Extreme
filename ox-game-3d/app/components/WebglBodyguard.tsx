"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function WebglBodyguard() {
  const pathname = usePathname()

  useEffect(() => {
   
    if (pathname === '/play') {
      sessionStorage.setItem('was_in_game', 'true')
    } else if (pathname === '/') {
      const wasInGame = sessionStorage.getItem('was_in_game')
      if (wasInGame === 'true') {
        sessionStorage.removeItem('was_in_game')
       
        setTimeout(() => {
          if ((window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type !== "reload") {
            window.location.reload()
          }
        }, 100)
      }
    }

   
    const handleContextLost = (e: Event) => {
      console.warn("WebGL Context Lost detected. Attempting emergency recovery.")
      window.location.reload()
    }

    
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload()
      }
    }

    window.addEventListener("webglcontextlost", handleContextLost, true)
    window.addEventListener("pageshow", handlePageShow)

    return () => {
      window.removeEventListener("webglcontextlost", handleContextLost, true)
      window.removeEventListener("pageshow", handlePageShow)
    }
  }, [pathname])

  return null
}
