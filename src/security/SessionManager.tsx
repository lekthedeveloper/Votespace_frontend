import type React from "react"
import { useEffect, useCallback } from "react"
import { useSecurityContext } from "./SecurityProvider"
import { useAuth } from "../contexts/AuthContext"

export const SessionManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sessionTimeout, lastActivity } = useSecurityContext()
  const { logout, isAuthenticated } = useAuth()

  const checkSessionTimeout = useCallback(() => {
    if (isAuthenticated && Date.now() - lastActivity > sessionTimeout) {
      logout()
      alert("Session expired due to inactivity. Please log in again.")
    }
  }, [isAuthenticated, lastActivity, sessionTimeout, logout])

  useEffect(() => {
    const interval = setInterval(checkSessionTimeout, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [checkSessionTimeout])

  return <>{children}</>
}
