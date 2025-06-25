import type React from "react"
import { useEffect } from "react"

export const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // Prevent clickjacking
    if (window.self !== window.top) {
      window.top!.location = window.self.location
    }

    // Disable right-click context menu in production
    if (process.env.NODE_ENV === "production") {
      document.addEventListener("contextmenu", (e) => e.preventDefault())
    }

    // Disable F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener("keydown", (e) => {
      if (process.env.NODE_ENV === "production") {
        if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I") || (e.ctrlKey && e.key === "u")) {
          e.preventDefault()
        }
      }
    })

    // Clear sensitive data on page unload
    window.addEventListener("beforeunload", () => {
      // Clear any sensitive data from memory
      sessionStorage.clear()
    })
  }, [])

  return null
}
