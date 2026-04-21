"use client"

import { useEffect } from "react"

export default function BfcacheReloader() {
  useEffect(() => {
   
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload()
      }
    }

   
    const handlePopState = () => {
    
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    }

    window.addEventListener("pageshow", handlePageShow)
    window.addEventListener("popstate", handlePopState)
    
    return () => {
      window.removeEventListener("pageshow", handlePageShow)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  return null
}
