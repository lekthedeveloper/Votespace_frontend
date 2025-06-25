import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  ArrowLeft,
  Vote,
  CheckCircle,
  Calendar,
  Shield,
  Clock,
  Eye,
  Share2,
  X,
  AlertCircle,
  Activity,
  Crown,
  BarChart3,
  Trophy,
  Target,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  QrCode,
  Facebook,
  Twitter,
  Copy,
  Zap,
  LogIn,
  UserPlus,
} from "lucide-react"
import Header from "../components/Layout/Header"
import Button from "../components/UI/Button"
import Card from "../components/UI/Card"
import DuplicateVotePopup from "../components/DuplicateVotePopup"
import { useAuth } from "../contexts/AuthContext"
import { useRooms } from "../hooks/useRooms"
import { useVoting } from "../hooks/useVoting"
import { useVoteTracking } from "../hooks/useVoteTracking"

const RoomDetailsPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, isAnonymous } = useAuth()
  const { getRoomDetails } = useRooms()
  const {
    castVote,
    getUserVoteInRoom,
    getVoteResults,
    checkVoteStatus,
    userVote,
    voteResults,
    voteStatus,
    isVotingForOption,
    isLoadingResults,
    isLoadingStatus,
    hasUserVoted,
    canUserVote,
    isRoomCreator,
    getUserVoteOption,
    error: votingError,
    clearError,
  } = useVoting()

  // Local storage vote tracking
  const { hasVoted, markAsVoted } = useVoteTracking(roomId || "")

  const [room, setRoom] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [showVotingSuccess, setShowVotingSuccess] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [animatedCounts, setAnimatedCounts] = useState<{ [key: string]: number }>({})
  const [showDuplicateVotePopup, setShowDuplicateVotePopup] = useState(false)
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false)

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const countAnimationRefs = useRef<{ [key: string]: NodeJS.Timeout }>({})

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails()
      getVoteResults(roomId)
      checkVoteStatus(roomId)
      if (user) {
        getUserVoteInRoom(roomId)
      }
    }
  }, [roomId, user, getUserVoteInRoom, getVoteResults, checkVoteStatus])

  useEffect(() => {
    if (location.state?.message) {
      setShowVotingSuccess(true)
      setTimeout(() => setShowVotingSuccess(false), 5000)
    }
  }, [location.state])

  // Auto-refresh functionality
  useEffect(() => {
    if (isAutoRefresh && roomId) {
      refreshIntervalRef.current = setInterval(() => {
        fetchRoomDetails()
        getVoteResults(roomId)
        checkVoteStatus(roomId)
        setLastRefresh(new Date())
      }, 5000)
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [isAutoRefresh, roomId, getVoteResults, checkVoteStatus])

  // Animated vote counters
  useEffect(() => {
    voteResults.forEach((result) => {
      const currentCount = animatedCounts[result.text] || 0
      const targetCount = result.voteCount

      if (currentCount !== targetCount) {
        animateCounter(result.text, currentCount, targetCount)
      }
    })
  }, [voteResults])

  const animateCounter = (optionText: string, from: number, to: number) => {
    const duration = 1000
    const steps = 20
    const increment = (to - from) / steps
    let current = from
    let step = 0

    if (countAnimationRefs.current[optionText]) {
      clearInterval(countAnimationRefs.current[optionText])
    }

    countAnimationRefs.current[optionText] = setInterval(() => {
      step++
      current += increment

      if (step >= steps) {
        current = to
        clearInterval(countAnimationRefs.current[optionText])
      }

      setAnimatedCounts((prev) => ({
        ...prev,
        [optionText]: Math.round(current),
      }))
    }, duration / steps)
  }

  const fetchRoomDetails = async () => {
    if (!roomId) return

    if (!isLoading) {
      setLastRefresh(new Date())
    }

    setIsLoading(true)
    setError(null)

    try {
      const roomData = await getRoomDetails(roomId)
      setRoom(roomData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load room details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (optionText: string) => {
    if (!roomId || hasVoted) {
      if (hasVoted) {
        setShowDuplicateVotePopup(true)
        setTimeout(() => setShowDuplicateVotePopup(false), 3000)
      }
      return
    }

    try {
      clearError()
      await castVote(roomId, {
        option: optionText,
      })

      // Mark as voted in local storage
      markAsVoted()

      setShowVotingSuccess(true)
      setTimeout(() => setShowVotingSuccess(false), 3000)

      // Show sign-up prompt for anonymous users after successful vote
      if (isAnonymous) {
        setTimeout(() => {
          setShowSignUpPrompt(true)
        }, 2000)
      }

      await fetchRoomDetails()
    } catch (err) {
      console.error("Voting error:", err)
      // Only show backend errors, not local storage blocks
      if (err instanceof Error && !err.message.includes("already voted")) {
        // Error is already set by the castVote function
      }
    }
  }

  const shareRoom = async () => {
    if (!roomId) return

    const shareUrl = `${window.location.origin}/room/${roomId}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (err) {
      console.error("Failed to copy share URL:", err)
    }
  }

  const shareToSocial = (platform: string) => {
    const shareUrl = `${window.location.origin}/room/${roomId}`
    const text = `Vote on: ${room?.title}`

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    }

    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], "_blank", "width=600,height=400")
    }
  }

  const getTotalVotes = () => {
    return voteResults.reduce((total, result) => total + result.voteCount, 0)
  }

  const getVotingOptions = () => {
    if (room?.options && Array.isArray(room.options)) {
      return room.options.map((optionText: string, index: number) => {
        const result = voteResults.find((r) => r.text === optionText)
        const animatedCount = animatedCounts[optionText] ?? result?.voteCount ?? 0
        return {
          id: `option-${index}`,
          text: optionText,
          votes: result?.voteCount || 0,
          animatedVotes: animatedCount,
          percentage: result?.percentage || 0,
          trend: getTrendForOption(optionText),
        }
      })
    }
    return []
  }

  const getTrendForOption = (optionText: string) => {
    const result = voteResults.find((r) => r.text === optionText)
    if (!result) return "stable"

    if (result.percentage > 60) return "up"
    if (result.percentage < 20) return "down"
    return "stable"
  }

  const hasUserVotedForOption = (optionText: string) => {
    const userVoteOption = getUserVoteOption()
    return userVoteOption === optionText
  }

  const getUniqueVoters = () => {
    return Math.max(1, Math.floor(getTotalVotes() * 0.8))
  }

  const isRoomOwner = () => {
    return user && room && room.creatorId === user.id
  }

  // Determine if user can vote - both authenticated and guest users can vote
  const canUserVoteInPoll = () => {
    // Room creator cannot vote
    if (isRoomOwner()) return false
    
    // If already voted (tracked locally), cannot vote again
    if (hasVoted) return false
    
    // Check if room is active
    if (!room?.isActive) return false
    
    // Both authenticated and anonymous users can vote
    return true
  }

  const getVoteButtonText = () => {
    if (hasVoted) return "Already Voted"
    if (isRoomOwner()) return "Creator"
    if (!room?.isActive) return "Closed"
    return "Vote"
  }

  if (isLoading && !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1efdf] via-[#f8f6f0] to-[#f1efdf]">
        <Header />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] gap-4 sm:gap-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#e5e7eb] border-t-[#ffc232] rounded-full animate-spin"></div>
            <p className="text-base sm:text-lg text-[#6b7280] font-medium text-center">Loading poll details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1efdf] via-[#f8f6f0] to-[#f1efdf]">
        <Header />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center py-12 sm:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#232013] mb-3 sm:mb-4">Room Not Found</h2>
            <p className="text-[#6b7280] mb-6 sm:mb-8 px-4">{error || "The room you are looking for does not exist."}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button onClick={() => navigate("/")} className="bg-gradient-to-r from-[#ffc232] to-[#ff7220]">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Back to Home
              </Button>
              {isAuthenticated && (
                <Button onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-[#6b7280] to-[#4b5563]">
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalVotes = getTotalVotes()
  const votingOptions = getVotingOptions().sort((a, b) => b.votes - a.votes)
  const midPoint = Math.ceil(votingOptions.length / 2)
  const topOptions = votingOptions.slice(0, midPoint)
  const bottomOptions = votingOptions.slice(midPoint)
  const uniqueVoters = getUniqueVoters()

  const renderVotingOption = (option: any, globalIndex: number) => {
    const hasVotedForThis = hasUserVotedForOption(option.text)
    const canVoteForThis = canUserVoteInPoll()
    const isWinning = globalIndex === 0 && option.votes > 0

    const TrendIcon = option.trend === "up" ? TrendingUp : option.trend === "down" ? TrendingDown : Minus

    return (
      <div
        key={option.id}
        className={`group/option relative overflow-hidden rounded-xl sm:rounded-2xl border-2 transition-all duration-500 hover:scale-[1.01] ${
          hasVotedForThis
            ? "bg-gradient-to-r from-green-50 to-green-100 border-green-300 shadow-lg"
            : isWinning
              ? "bg-gradient-to-r from-[#fff7ed] to-[#fed7aa] border-[#ffc232] shadow-lg"
              : "bg-white/90 backdrop-blur-sm border-gray-200 hover:border-[#ffc232] hover:shadow-md"
        }`}
      >
        <div className="p-3 sm:p-4">
          <div className="flex items-start sm:items-center justify-between mb-3 gap-3">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div
                className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md transition-all duration-300 flex-shrink-0 ${
                  isWinning
                    ? "bg-gradient-to-r from-[#ffc232] to-[#ff7220]"
                    : hasVotedForThis
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                }`}
              >
                {isWinning ? (
                  <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                ) : hasVotedForThis ? (
                  <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <span className="text-white font-bold text-xs sm:text-sm">#{globalIndex + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start sm:items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm sm:text-lg font-bold text-[#232013] break-words">{option.text}</h3>
                  <div
                    className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                      option.trend === "up"
                        ? "bg-green-100 text-green-700"
                        : option.trend === "down"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <TrendIcon className="w-2 h-2 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">{option.trend}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[#6b7280] flex-wrap">
                  <span className="font-semibold">{option.animatedVotes} votes</span>
                  <span className="text-lg sm:text-xl font-bold text-[#232013]">{option.percentage}%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
              {hasVotedForThis && (
                <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  <CheckCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">Your Vote</span>
                  <span className="sm:hidden">✓</span>
                </div>
              )}

              {/* Vote button - show for both authenticated and guest users */}
              {canVoteForThis && (
                <Button
                  onClick={() => handleVote(option.text)}
                  disabled={isVotingForOption(option.text) || hasVoted}
                  className={`h-8 sm:h-10 px-3 sm:px-4 font-bold rounded-lg sm:rounded-xl text-xs sm:text-sm ${
                    hasVoted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white"
                  }`}
                >
                  {isVotingForOption(option.text) ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
                      <span className="hidden sm:inline">Voting...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Vote className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {getVoteButtonText()}
                    </>
                  )}
                </Button>
              )}

              {/* Show status when user can't vote */}
              {!canVoteForThis && !hasVotedForThis && (
                <div className="text-xs text-gray-500 px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 rounded-lg">
                  {isRoomOwner() ? "Creator" : hasVoted ? "Voted" : "Closed"}
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className={`h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out relative ${
                  hasVotedForThis
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : isWinning
                      ? "bg-gradient-to-r from-[#ffc232] to-[#ff7220]"
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                }`}
                style={{ width: `${option.percentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
              </div>
            </div>
          </div>

          {/* Confidence and Live Updates */}
          <div className="flex justify-between items-center text-xs text-[#6b7280]">
            <span>Confidence: {option.percentage > 70 ? "High" : option.percentage > 40 ? "Medium" : "Low"}</span>
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span className="hidden sm:inline">Live updates</span>
              <span className="sm:hidden">Live</span>
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1efdf] via-[#f8f6f0] to-[#f1efdf]">
      <Header />

      {/* Guest Sign-up Prompt Modal - shows after voting */}
      {showSignUpPrompt && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowSignUpPrompt(false)}
        >
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#232013] mb-2 sm:mb-3">Thanks for Voting!</h3>
              <p className="text-sm sm:text-base text-[#6b7280] mb-4 sm:mb-6">
                Create an account to track your votes, create your own polls, and get notified of results!
              </p>
              <div className="flex flex-col gap-2 sm:gap-3">
                <Button
                  onClick={() => navigate('/register')}
                  className="w-full bg-gradient-to-r from-[#ffc232] to-[#ff7220] text-white rounded-lg sm:rounded-xl h-10 sm:h-12"
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Create Account
                </Button>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-[#6b7280] to-[#4b5563] text-white rounded-lg sm:rounded-xl h-10 sm:h-12"
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={() => setShowSignUpPrompt(false)}
                  className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg sm:rounded-xl h-8 sm:h-10 text-sm"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Vote Popup */}
      <DuplicateVotePopup
        isVisible={showDuplicateVotePopup}
        message="You have already voted in this poll"
        onClose={() => setShowDuplicateVotePopup(false)}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 pt-16 sm:pt-20">
        {/* Success/Error Messages */}
        {showVotingSuccess && (
          <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-40 bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-2 sm:gap-3 animate-slide-down max-w-[90vw]">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-semibold text-sm sm:text-base">
              {location.state?.message || "Your vote has been cast successfully!"}
            </span>
          </div>
        )}

        {votingError && (
          <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-40 bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-2 sm:gap-3 max-w-[90vw]">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-sm sm:text-base">{votingError}</span>
            <button onClick={clearError} className="ml-2 hover:bg-red-600 rounded p-1 flex-shrink-0">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}

        {/* Guest user info banner - friendly and encouraging */}
        {isAnonymous && (
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between gap-3 bg-blue-50 text-blue-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-blue-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <Vote className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-semibold text-sm sm:text-base">You can vote as a guest! Sign up to create your own polls.</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1 text-xs sm:text-sm"
                >
                  <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Global vote status message */}
        {hasVoted && (
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3 bg-green-100 text-green-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-green-200">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-semibold text-sm sm:text-base">
                {isAnonymous ? "You've voted as a guest - thanks for participating!" : "You've already voted in this poll"}
              </span>
            </div>
          </div>
        )}

        {/* Main Layout - Mobile-first responsive */}
        <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
          {/* Main Poll Header - Full width on mobile */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#ffc232]/20 to-[#ff7220]/20 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Vote className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm font-bold text-[#ffc232] uppercase tracking-wide">Live Poll</span>
                    <div
                      className={`flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold self-start ${
                        room.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full ${room.isActive ? "animate-pulse" : ""}`}></div>
                      {room.isActive ? "Live" : "Closed"}
                      {room.isActive && <Zap className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-bold text-[#232013] leading-tight mb-2 break-words">{room.title}</h2>
                </div>
              </div>

              {room.description && (
                <div className="mt-4 sm:mt-6 bg-white/60 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <p className="text-[#6b7280] text-sm sm:text-base break-words">{room.description}</p>
                </div>
              )}
            </div>

            {/* Enhanced Metadata - Responsive grid */}
            <div className="p-4 sm:p-6 bg-white/50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-center">
                <div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                    <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#6b7280] mb-0.5 sm:mb-1">Created</p>
                  <p className="text-xs sm:text-sm font-bold text-[#232013]">
                    {room.createdAt ? new Date(room.createdAt).toLocaleDateString() : "Today"}
                  </p>
                </div>
                <div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                    <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#6b7280] mb-0.5 sm:mb-1">Participants</p>
                  <p className="text-xs sm:text-sm font-bold text-[#232013]">{uniqueVoters}</p>
                </div>
                <div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                    <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#6b7280] mb-0.5 sm:mb-1">Anonymous</p>
                  <p className="text-xs sm:text-sm font-bold text-[#232013]">{room.isAnonymous ? "Yes" : "No"}</p>
                </div>
                {room.deadline ? (
                  <div>
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm text-[#6b7280] mb-0.5 sm:mb-1">Deadline</p>
                    <p className="text-xs sm:text-sm font-bold text-[#232013]">{new Date(room.deadline).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <div className="col-span-2 sm:col-span-1">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#ffc232] rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm text-[#6b7280] mb-0.5 sm:mb-1">Total Votes</p>
                    <p className="text-xs sm:text-sm font-bold text-[#232013]">{totalVotes}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Stats Card - Only show on larger screens, integrated into header on mobile */}
          <div className="hidden lg:block">
            <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#232013]">{totalVotes}</h3>
                <p className="text-base text-[#6b7280] font-medium">Total Votes</p>
                <div className="flex items-center justify-center gap-1 text-green-600 text-sm mt-2">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>Real-time</span>
                </div>
              </div>

              {/* Vote Distribution */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#232013] text-center">Vote Distribution</h4>
                {votingOptions.slice(0, 3).map((option, index) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${index === 0 ? "bg-[#ffc232]" : index === 1 ? "bg-[#ff7220]" : "bg-gray-400"}`}
                    ></div>
                    <span className="text-sm text-[#232013] flex-1 truncate">{option.text}</span>
                    <span className="text-sm font-bold text-[#232013]">{option.percentage}%</span>
                  </div>
                ))}
              </div>

              {/* Vote Status Indicator */}
              <div className="mt-6 p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-green-600 animate-pulse" />
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      {hasVoted 
                        ? isAnonymous 
                          ? "You voted as guest" 
                          : "You have voted"
                        : canUserVoteInPoll() 
                          ? "You can vote" 
                          : "Voting unavailable"}
                    </p>
                    <p className="text-xs text-green-600">Refreshing every 5 seconds</p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => navigate("/")}
                  className="w-full bg-gradient-to-r from-[#6b7280] to-[#4b5563] hover:from-[#5b6470] hover:to-[#374151] text-white font-bold rounded-xl h-12"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
                {isAuthenticated && (
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="w-full bg-gradient-to-r from-[#ffc232] to-[#ff7220] text-white font-bold rounded-xl h-12"
                  >
                    Go to Dashboard
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="mb-4 sm:mb-6 lg:hidden space-y-2">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-[#6b7280] to-[#4b5563] hover:from-[#5b6470] hover:to-[#374151] text-white font-bold rounded-xl h-12"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          {isAuthenticated && (
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-[#ffc232] to-[#ff7220] text-white font-bold rounded-xl h-12"
            >
              Go to Dashboard
            </Button>
          )}
        </div>

        {/* Voting Options - Single column on mobile, two columns on larger screens */}
        <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
          {/* All Options - Single section on mobile */}
          <div className="block lg:hidden">
            <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#ffc232]/15 to-[#ff7220]/15 p-3 sm:p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#232013]">Voting Options</h3>
                    <p className="text-xs sm:text-sm text-[#6b7280]">
                      {isAnonymous ? "Vote as guest or sign up" : "Choose your preferred option"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {votingOptions.map((option, index) => renderVotingOption(option, index))}
              </div>
            </Card>
          </div>

          {/* Desktop Layout - Two columns */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            {/* Leading Options */}
            <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#ffc232]/15 to-[#ff7220]/15 p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#232013]">Leading Options</h3>
                    <p className="text-sm text-[#6b7280]">Top performing choices</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">{topOptions.map((option, index) => renderVotingOption(option, index))}</div>
            </Card>

            {/* Other Options */}
            <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#646B47]/15 to-[#b2d57a]/15 p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#646B47] to-[#b2d57a] rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#232013]">Other Options</h3>
                    <p className="text-sm text-[#6b7280]">Additional choices</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {bottomOptions.map((option, index) => renderVotingOption(option, midPoint + index))}
              </div>
            </Card>
          </div>
        </div>

        {/* Sharing Tools - Only for creators, mobile-optimized */}
        {isRoomOwner() && (
          <Card className="bg-gradient-to-r from-[#ffc232]/10 to-[#ff7220]/10 backdrop-blur-sm border border-[#ffc232]/30 shadow-lg rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-lg sm:rounded-xl flex items-center justify-center">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#232013]">Share Your Poll</h3>
              <div className="ml-auto">
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                  <Crown className="w-3 h-3" />
                  <span className="hidden sm:inline">Creator</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <Button
                onClick={shareRoom}
                className="bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-bold rounded-lg sm:rounded-xl h-10 text-xs sm:text-sm"
              >
                {copiedUrl ? (
                  <>
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Copied!</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Copy Link</span>
                    <span className="sm:hidden">Copy</span>
                  </>
                )}
              </Button>

              <Button
                onClick={() => shareToSocial("twitter")}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl h-10 text-xs sm:text-sm"
              >
                <Twitter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Twitter
              </Button>

              <Button
                onClick={() => shareToSocial("facebook")}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl h-10 text-xs sm:text-sm"
              >
                <Facebook className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Facebook
              </Button>

              <Button
                onClick={() => setShowQRCode(!showQRCode)}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg sm:rounded-xl h-10 text-xs sm:text-sm"
              >
                <QrCode className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">QR Code</span>
                <span className="sm:hidden">QR</span>
              </Button>
            </div>

            {room.joinCode && (
              <div className="mt-3 sm:mt-4 p-3 bg-white/60 rounded-lg sm:rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs sm:text-sm text-[#6b7280]">Join Code:</p>
                  <code className="text-sm sm:text-lg font-bold text-[#805117]">{room.joinCode}</code>
                </div>
                <Button
                  onClick={() => navigator.clipboard.writeText(room.joinCode)}
                  className="bg-[#805117] hover:bg-[#646B47] text-white rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* QR Code Modal - Mobile optimized */}
            {showQRCode && (
              <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
                onClick={() => setShowQRCode(false)}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-bold text-[#232013] mb-3 sm:mb-4">Scan to Join Poll</h3>
                    <div className="bg-gray-100 p-3 sm:p-4 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
                      <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                        <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#6b7280] mb-3 sm:mb-4">Share this QR code for easy access to your poll</p>
                    <Button
                      onClick={() => setShowQRCode(false)}
                      className="w-full bg-gradient-to-r from-[#ffc232] to-[#ff7220] text-white rounded-lg sm:rounded-xl h-10 sm:h-12"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-shine {
          animation: shine 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default RoomDetailsPage