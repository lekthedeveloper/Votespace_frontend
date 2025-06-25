import { useState, useCallback } from "react"
import { apiService } from "../services/api"
import { VoteStorage } from "../utils/voteStorage"
import { useAuth } from "../contexts/AuthContext"

export interface CastVoteRequest {
  option: string
  justification?: string
}

export interface UserVote {
  id: string
  option: {
    id: string
    text: string
  }
  createdAt: string
  roomId: string
  userId?: string
  guestId?: string
}

export interface VoteResult {
  id: string
  text: string
  voteCount: number
  percentage: number
}

export interface VoteStatus {
  hasVoted: boolean
  canVote: boolean
  userVote: {
    id: string
    option: string
    createdAt: string
  } | null
  room: {
    id: string
    title: string
    isActive: boolean
    allowMultipleVotes: boolean
    deadline: string | null
    isCreator: boolean
  }
  message: string
}

export const useVotingWithStorage = () => {
  const { user } = useAuth()
  const [votingForOption, setVotingForOption] = useState<string | null>(null)
  const [isLoadingVotes, setIsLoadingVotes] = useState(false)
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userVote, setUserVote] = useState<UserVote | null>(null)
  const [voteResults, setVoteResults] = useState<VoteResult[]>([])
  const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null)
  const [showDuplicateVotePopup, setShowDuplicateVotePopup] = useState(false)
  const [duplicateVoteMessage, setDuplicateVoteMessage] = useState("")

  // Get user identifiers
  const getUserIdentifiers = useCallback(() => {
    const userId = user?.id
    let guestId: string | undefined

    if (!userId) {
      // Try to get existing guest ID from cookie
      guestId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("anonymousId="))
        ?.split("=")[1]

      // If no guest ID exists, create one and set it as a cookie
      if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        document.cookie = `anonymousId=${guestId}; path=/; max-age=${30 * 24 * 60 * 60}` // 30 days
        console.log("🆔 Created new guest ID:", guestId)
      } else {
        console.log("🆔 Using existing guest ID:", guestId)
      }
    }

    console.log("👤 User identifiers:", { userId, guestId })
    return { userId, guestId }
  }, [user])

  // Check local storage for existing vote
  const checkLocalVote = useCallback(
    (roomId: string) => {
      const { userId, guestId } = getUserIdentifiers()
      return VoteStorage.hasUserVotedInRoom(roomId, userId, guestId)
    },
    [getUserIdentifiers],
  )

  // Show duplicate vote popup
  const showDuplicatePopup = useCallback((message: string, option?: string) => {
    setDuplicateVoteMessage(message + (option ? ` You voted for "${option}".` : ""))
    setShowDuplicateVotePopup(true)
    setTimeout(() => setShowDuplicateVotePopup(false), 4000)
  }, [])

  // Check vote status for a specific room
  const checkVoteStatus = useCallback(
    async (roomId: string) => {
      setIsLoadingStatus(true)
      setError(null)

      try {
        // First check local storage
        const localVote = checkLocalVote(roomId)

        // Then check server
        const response = await apiService.checkVoteStatus(roomId)
        const status = response.data
        setVoteStatus(status)

        // Sync local storage with server data
        const { userId, guestId } = getUserIdentifiers()
        VoteStorage.syncWithServerData(roomId, status.userVote, userId, guestId)

        // Update userVote state
        if (status.userVote) {
          setUserVote({
            id: status.userVote.id,
            option: {
              id: status.userVote.option,
              text: status.userVote.option,
            },
            createdAt: status.userVote.createdAt,
            roomId: roomId,
          })
        } else {
          setUserVote(null)
        }

        return status
      } catch (err) {
        console.log("Could not check vote status:", err)

        // If server check fails, rely on local storage
        const localVote = checkLocalVote(roomId)
        const defaultStatus: VoteStatus = {
          hasVoted: !!localVote,
          canVote: !localVote,
          userVote: localVote
            ? {
                id: "local",
                option: localVote.option,
                createdAt: new Date(localVote.timestamp).toISOString(),
              }
            : null,
          room: {
            id: roomId,
            title: "",
            isActive: true,
            allowMultipleVotes: false,
            deadline: null,
            isCreator: false,
          },
          message: localVote ? "You have already voted (cached locally)" : "You can cast your vote",
        }

        setVoteStatus(defaultStatus)
        return defaultStatus
      } finally {
        setIsLoadingStatus(false)
      }
    },
    [checkLocalVote, getUserIdentifiers],
  )

  const castVote = async (roomId: string, data: CastVoteRequest) => {
    // 🔥 SIMPLE: Check if user has voted in this room (boolean check)
    const { userId, guestId } = getUserIdentifiers()
    const storageKey = `voted_${roomId}_${userId || guestId}`
    const hasVotedBefore = localStorage.getItem(storageKey) === "true"

    if (hasVotedBefore) {
      // User has already voted - show popup immediately, NO API call
      console.log("🚫 User has already voted, stored in localStorage")
      showDuplicatePopup("You have already voted in this room!")
      return Promise.reject(new Error("DUPLICATE_VOTE_LOCAL"))
    }

    setVotingForOption(data.option)
    setError(null)

    try {
      // Send vote to backend
      console.log("📤 Sending vote to server:", data)
      const response = await apiService.castVote(roomId, data)

      // 🔥 SIMPLE: Store boolean flag that user has voted
      localStorage.setItem(storageKey, "true")
      console.log("✅ Stored vote flag in localStorage:", storageKey)

      // Refresh vote status and results after successful submission
      await Promise.all([checkVoteStatus(roomId), getVoteResults(roomId)])

      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to cast vote"

      if (errorMessage.includes("already voted") || errorMessage === "DUPLICATE_VOTE") {
        // Server says they already voted - store the flag
        localStorage.setItem(storageKey, "true")
        showDuplicatePopup("You have already voted in this room!")
      } else if (errorMessage !== "DUPLICATE_VOTE_LOCAL") {
        setError(errorMessage)
      }

      throw new Error(errorMessage)
    } finally {
      setVotingForOption(null)
    }
  }

  const getUserVoteInRoom = useCallback(
    async (roomId: string) => {
      setIsLoadingVotes(true)
      setError(null)

      try {
        const response = await apiService.getUserVoteInRoom(roomId)
        const vote = response.data?.vote || null
        setUserVote(vote)

        // Sync with local storage
        const { userId, guestId } = getUserIdentifiers()
        VoteStorage.syncWithServerData(roomId, vote, userId, guestId)

        return vote
      } catch (err) {
        console.log("Could not fetch user vote:", err)

        // Fall back to local storage
        const { userId, guestId } = getUserIdentifiers()
        const localOption = VoteStorage.getUserVoteInRoom(roomId, userId, guestId)

        if (localOption) {
          const localVote = {
            id: "local",
            option: { id: localOption, text: localOption },
            createdAt: new Date().toISOString(),
            roomId,
          }
          setUserVote(localVote)
          return localVote
        }

        setUserVote(null)
        return null
      } finally {
        setIsLoadingVotes(false)
      }
    },
    [getUserIdentifiers],
  )

  const getVoteResults = useCallback(async (roomId: string) => {
    setIsLoadingResults(true)
    setError(null)
    try {
      const response = await apiService.getVoteResults(roomId)
      const results = response.data?.room?.results || []
      setVoteResults(results)
      return {
        results,
        totalVotes: response.data?.room?.totalVotes || 0,
      }
    } catch (err) {
      console.log("Could not fetch vote results:", err)
      setVoteResults([])
      return { results: [], totalVotes: 0 }
    } finally {
      setIsLoadingResults(false)
    }
  }, [])

  const getUserVotes = useCallback(async () => {
    setIsLoadingVotes(true)
    setError(null)
    try {
      const response = await apiService.getUserVotes()
      const votes = response.data?.votes || []
      return votes
    } catch (err) {
      console.log("Could not fetch user votes:", err)
      return []
    } finally {
      setIsLoadingVotes(false)
    }
  }, [])

  const clearError = () => {
    setError(null)
  }

  const closeDuplicatePopup = () => {
    setShowDuplicateVotePopup(false)
  }

  // Helper function to check if a specific option is being voted on
  const isVotingForOption = (optionText: string) => {
    return votingForOption === optionText
  }

  // Helper functions for vote status
  const hasUserVoted = () => {
    return voteStatus?.hasVoted || false
  }

  const canUserVote = () => {
    return voteStatus?.canVote || false
  }

  const isRoomCreator = () => {
    return voteStatus?.room?.isCreator || false
  }

  const getUserVoteOption = () => {
    return voteStatus?.userVote?.option || userVote?.option?.text || null
  }

  // Simple helper to check if user has voted in a room
  const hasUserVotedLocally = useCallback(
    (roomId: string) => {
      const { userId, guestId } = getUserIdentifiers()
      const storageKey = `voted_${roomId}_${userId || guestId}`
      return localStorage.getItem(storageKey) === "true"
    },
    [getUserIdentifiers],
  )

  return {
    // Original interface (maintained for backward compatibility)
    isVoting: votingForOption !== null,
    votingForOption,
    isVotingForOption,
    isLoadingVotes,
    isLoadingResults,
    error,
    userVote,
    voteResults,
    castVote,
    getUserVoteInRoom,
    getVoteResults,
    getUserVotes,
    clearError,

    // New vote status functionality
    voteStatus,
    isLoadingStatus,
    checkVoteStatus,
    hasUserVoted,
    canUserVote,
    isRoomCreator,
    getUserVoteOption,

    // Local storage functionality
    showDuplicateVotePopup,
    duplicateVoteMessage,
    closeDuplicatePopup,
    checkLocalVote,
    hasUserVotedLocally,
  }
}
