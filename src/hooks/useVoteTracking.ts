import { useState, useEffect } from "react"

const generateDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Device fingerprint', 2, 2)
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.deviceMemory || 'unknown',
    canvas.toDataURL()
  ].join('|')
  
  // Simple hash function
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}

// Cookie utilities
const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

const getCookie = (name: string): string | null => {
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export const useVoteTracking = (roomId: string) => {
  const [hasVoted, setHasVoted] = useState(false)
  const [deviceFingerprint] = useState(() => generateDeviceFingerprint())

  useEffect(() => {
    if (!roomId) return

    // Check multiple storage methods for vote tracking
    const checkVoteStatus = () => {
      // Method 1: localStorage
      const votedRooms = JSON.parse(localStorage.getItem("votedRooms") || "{}")
      const localStorageVoted = !!votedRooms[roomId]

      // Method 2: sessionStorage
      const sessionVotedRooms = JSON.parse(sessionStorage.getItem("sessionVotedRooms") || "{}")
      const sessionStorageVoted = !!sessionVotedRooms[roomId]

      // Method 3: cookies
      const cookieVoted = getCookie(`voted_${roomId}`) === 'true'

      // Method 4: device fingerprint tracking
      const fingerprintKey = `fp_${deviceFingerprint}_${roomId}`
      const fingerprintVoted = localStorage.getItem(fingerprintKey) === 'true'

      // If any method indicates the user has voted, consider them as having voted
      const voted = localStorageVoted || sessionStorageVoted || cookieVoted || fingerprintVoted

      console.log('Vote tracking check:', {
        roomId,
        localStorageVoted,
        sessionStorageVoted,
        cookieVoted,
        fingerprintVoted,
        finalResult: voted,
        deviceFingerprint
      })

      setHasVoted(voted)
    }

    checkVoteStatus()
  }, [roomId, deviceFingerprint])

  const markAsVoted = () => {
    if (!roomId) return

    console.log('Marking as voted for room:', roomId)

    // Method 1: localStorage
    const votedRooms = JSON.parse(localStorage.getItem("votedRooms") || "{}")
    votedRooms[roomId] = true
    localStorage.setItem("votedRooms", JSON.stringify(votedRooms))

    // Method 2: sessionStorage
    const sessionVotedRooms = JSON.parse(sessionStorage.getItem("sessionVotedRooms") || "{}")
    sessionVotedRooms[roomId] = true
    sessionStorage.setItem("sessionVotedRooms", JSON.stringify(sessionVotedRooms))

    // Method 3: cookies (30 days expiration)
    setCookie(`voted_${roomId}`, 'true', 30)

    // Method 4: device fingerprint tracking
    const fingerprintKey = `fp_${deviceFingerprint}_${roomId}`
    localStorage.setItem(fingerprintKey, 'true')

    // Method 5: timestamp tracking for additional verification
    const timestampKey = `vote_time_${roomId}`
    localStorage.setItem(timestampKey, new Date().toISOString())

    setHasVoted(true)

    console.log('Vote marked with all tracking methods:', {
      roomId,
      deviceFingerprint,
      timestamp: new Date().toISOString()
    })
  }

  const clearVote = () => {
    if (!roomId) return

    console.log('Clearing vote for room:', roomId)

    // Method 1: localStorage
    const votedRooms = JSON.parse(localStorage.getItem("votedRooms") || "{}")
    delete votedRooms[roomId]
    localStorage.setItem("votedRooms", JSON.stringify(votedRooms))

    // Method 2: sessionStorage
    const sessionVotedRooms = JSON.parse(sessionStorage.getItem("sessionVotedRooms") || "{}")
    delete sessionVotedRooms[roomId]
    sessionStorage.setItem("sessionVotedRooms", JSON.stringify(sessionVotedRooms))

    // Method 3: cookies (set to expire immediately)
    setCookie(`voted_${roomId}`, '', -1)

    // Method 4: device fingerprint tracking
    const fingerprintKey = `fp_${deviceFingerprint}_${roomId}`
    localStorage.removeItem(fingerprintKey)

    // Method 5: timestamp tracking
    const timestampKey = `vote_time_${roomId}`
    localStorage.removeItem(timestampKey)

    setHasVoted(false)

    console.log('Vote cleared from all tracking methods')
  }

  // Additional utility functions
  const getVoteTimestamp = (): string | null => {
    if (!roomId) return null
    const timestampKey = `vote_time_${roomId}`
    return localStorage.getItem(timestampKey)
  }

  const getTrackingInfo = () => {
    if (!roomId) return null

    const votedRooms = JSON.parse(localStorage.getItem("votedRooms") || "{}")
    const sessionVotedRooms = JSON.parse(sessionStorage.getItem("sessionVotedRooms") || "{}")
    const cookieVoted = getCookie(`voted_${roomId}`) === 'true'
    const fingerprintKey = `fp_${deviceFingerprint}_${roomId}`
    const fingerprintVoted = localStorage.getItem(fingerprintKey) === 'true'
    const voteTimestamp = getVoteTimestamp()

    return {
      roomId,
      deviceFingerprint,
      localStorage: !!votedRooms[roomId],
      sessionStorage: !!sessionVotedRooms[roomId],
      cookies: cookieVoted,
      fingerprint: fingerprintVoted,
      timestamp: voteTimestamp,
      hasVoted
    }
  }

  return { 
    hasVoted, 
    markAsVoted, 
    clearVote, 
    deviceFingerprint,
    getVoteTimestamp,
    getTrackingInfo
  }
}