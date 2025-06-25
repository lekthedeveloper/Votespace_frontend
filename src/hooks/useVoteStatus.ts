import { useState, useEffect, useCallback } from "react"
import { apiService } from "../services/api"

interface VoteStatus {
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

export const useVoteStatus = (roomId: string | undefined) => {
  const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkVoteStatus = useCallback(async () => {
    if (!roomId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await apiService.checkVoteStatus(roomId)
      setVoteStatus(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to check vote status"
      setError(errorMessage)
      console.error("Vote status check failed:", err)
    } finally {
      setIsLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    checkVoteStatus()
  }, [checkVoteStatus])

  const refreshVoteStatus = useCallback(() => {
    checkVoteStatus()
  }, [checkVoteStatus])

  return {
    voteStatus,
    isLoading,
    error,
    refreshVoteStatus,
    hasVoted: voteStatus?.hasVoted || false,
    canVote: voteStatus?.canVote || false,
    userVote: voteStatus?.userVote || null,
    isCreator: voteStatus?.room?.isCreator || false,
  }
}
