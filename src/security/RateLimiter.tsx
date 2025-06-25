import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface RateLimitContextType {
  checkRateLimit: (key: string, limit: number, windowMs: number) => boolean
  getRemainingAttempts: (key: string, limit: number) => number
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined)

export const useRateLimit = () => {
  const context = useContext(RateLimitContext)
  if (!context) {
    throw new Error("useRateLimit must be used within RateLimitProvider")
  }
  return context
}

export const RateLimitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attempts, setAttempts] = useState<Record<string, number[]>>({})

  const checkRateLimit = useCallback(
    (key: string, limit: number, windowMs: number): boolean => {
      const now = Date.now()
      const windowStart = now - windowMs

      setAttempts((prev) => {
        const keyAttempts = (prev[key] || []).filter((timestamp) => timestamp > windowStart)

        if (keyAttempts.length >= limit) {
          return prev
        }

        keyAttempts.push(now)
        return { ...prev, [key]: keyAttempts }
      })

      const currentAttempts = attempts[key]?.filter((timestamp) => timestamp > windowStart) || []
      return currentAttempts.length < limit
    },
    [attempts],
  )

  const getRemainingAttempts = useCallback(
    (key: string, limit: number): number => {
      const keyAttempts = attempts[key] || []
      return Math.max(0, limit - keyAttempts.length)
    },
    [attempts],
  )

  return (
    <RateLimitContext.Provider value={{ checkRateLimit, getRemainingAttempts }}>{children}</RateLimitContext.Provider>
  )
}
