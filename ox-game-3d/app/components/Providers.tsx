"use client"

import { useEffect } from "react"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 🕵️‍♂️ Storage Proxy Interceptor
      const originalSet = localStorage.setItem;
      const originalGet = localStorage.getItem;
      const originalRemove = localStorage.removeItem;

      localStorage.setItem = function(key, value) {
        if (key.includes("nextauth")) {
          sessionStorage.setItem(key, value);
          return;
        }
        originalSet.apply(this, [key, value]);
      };

      localStorage.getItem = function(key) {
        if (key.includes("nextauth")) {
          return sessionStorage.getItem(key);
        }
        return originalGet.apply(this, [key]);
      };

      localStorage.removeItem = function(key) {
        if (key.includes("nextauth")) {
          sessionStorage.removeItem(key);
          return;
        }
        originalRemove.apply(this, [key]);
      };

      // 🧹 Clean up any existing breadcrumbs
      localStorage.removeItem("nextauth.message");
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>
}
