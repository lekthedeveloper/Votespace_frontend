import { useState, useCallback } from "react"
import { apiService } from "../services/api"

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

export const useVoting = () => {
  const [votingForOption, setVotingForOption] = useState<string | null>(null)
  const [isLoadingVotes, setIsLoadingVotes] = useState(false)
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userVote, setUserVote] = useState<UserVote | null>(null)
  const [voteResults, setVoteResults] = useState<VoteResult[]>([])
  const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null)

  // Check vote status for a specific room
  const checkVoteStatus = useCallback(async (roomId: string) => {
    setIsLoadingStatus(true)
    setError(null)
    try {
      const response = await apiService.checkVoteStatus(roomId)
      const status = response.data
      setVoteStatus(status)

      // Update userVote if we have vote data from status
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
      // Set default status if check fails
      setVoteStatus({
        hasVoted: false,
        canVote: true,
        userVote: null,
        room: {
          id: roomId,
          title: "",
          isActive: true,
          allowMultipleVotes: false,
          deadline: null,
          isCreator: false,
        },
        message: "You can cast your vote",
      })
      return null
    } finally {
      setIsLoadingStatus(false)
    }
  }, [])

  const castVote = async (roomId: string, data: CastVoteRequest) => {
    // Check vote status before attempting to vote
    const status = await checkVoteStatus(roomId)

    if (status && !status.canVote) {
      let errorMessage = status.message

      if (status.room.isCreator) {
        errorMessage = "Room creators cannot vote in their own rooms"
      } else if (status.hasVoted && !status.room.allowMultipleVotes) {
        errorMessage = "You have already voted in this room"
      } else if (!status.room.isActive) {
        errorMessage = "Voting is closed for this room"
      } else if (status.room.deadline && new Date() > new Date(status.room.deadline)) {
        errorMessage = "The voting deadline has passed"
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    }

    setVotingForOption(data.option)
    setError(null)

    try {
      const response = await apiService.castVote(roomId, data)

      // Refresh vote status and results after successful submission
      await Promise.all([checkVoteStatus(roomId), getVoteResults(roomId)])

      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to cast vote"

      // Handle specific error types from backend
      if (errorMessage.includes("already voted") || errorMessage === "DUPLICATE_VOTE") {
        setError("You have already voted in this room")
        // Refresh status to sync with backend
        await checkVoteStatus(roomId)
      } else if (errorMessage === "CREATOR_CANNOT_VOTE") {
        setError("Room creators cannot vote in their own rooms")
      } else if (errorMessage === "VOTING_CLOSED") {
        setError("Voting is closed for this room")
      } else if (errorMessage === "DEADLINE_PASSED") {
        setError("The voting deadline has passed")
      } else if (errorMessage === "INVALID_OPTION") {
        setError("Invalid voting option selected")
      } else {
        setError(errorMessage)
      }

      throw new Error(errorMessage)
    } finally {
      setVotingForOption(null)
    }
  }

  const getUserVoteInRoom = useCallback(async (roomId: string) => {
    setIsLoadingVotes(true)
    setError(null)
    try {
      const response = await apiService.getUserVoteInRoom(roomId)
      const vote = response.data?.vote || null
      setUserVote(vote)
      return vote
    } catch (err) {
      // Don't set error for getUserVoteInRoom as it might be called for unauthenticated users
      console.log("Could not fetch user vote:", err)
      setUserVote(null)
      return null
    } finally {
      setIsLoadingVotes(false)
    }
  }, [])

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
  }
}
