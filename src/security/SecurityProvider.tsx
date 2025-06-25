import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface SecurityContextType {
  isSecureConnection: boolean
  deviceFingerprint: string
  sessionTimeout: number
  lastActivity: number
  updateActivity: () => void
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined)

export const useSecurityContext = () => {
  const context = useContext(SecurityContext)
  if (!context) {
    throw new Error("useSecurityContext must be used within SecurityProvider")
  }
  return context
}

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSecureConnection, setIsSecureConnection] = useState(false)
  const [deviceFingerprint, setDeviceFingerprint] = useState("")
  const [lastActivity, setLastActivity] = useState(Date.now())
  const sessionTimeout = 30 * 60 * 1000 // 30 minutes

  useEffect(() => {
    // Check for HTTPS connection
    setIsSecureConnection(window.location.protocol === "https:")

    // Generate device fingerprint
    generateDeviceFingerprint()

    // Set up activity tracking
    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]
    const updateActivity = () => setLastActivity(Date.now())

    activityEvents.forEach((event) => {
      document.addEventListener(event, updateActivity, true)
    })

    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, updateActivity, true)
      })
    }
  }, [])

  const generateDeviceFingerprint = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.textBaseline = "top"
      ctx.font = "14px Arial"
      ctx.fillText("Device fingerprint", 2, 2)
    }

    const fingerprint = btoa(
      navigator.userAgent +
        navigator.language +
        screen.width +
        screen.height +
        new Date().getTimezoneOffset() +
        (canvas.toDataURL() || ""),
    )

    setDeviceFingerprint(fingerprint)
  }

  const updateActivity = () => {
    setLastActivity(Date.now())
  }

  return (
    <SecurityContext.Provider
      value={{
        isSecureConnection,
        deviceFingerprint,
        sessionTimeout,
        lastActivity,
        updateActivity,
      }}
    >
      {children}
    </SecurityContext.Provider>
  )
}
