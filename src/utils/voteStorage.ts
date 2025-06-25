interface LocalVoteData {
  roomId: string
  option: string
  timestamp: number
  userId?: string
  guestId?: string
}

interface VoteStorageData {
  votes: LocalVoteData[]
  lastUpdated: number
}

const VOTE_STORAGE_KEY = "votespace_user_votes"
const STORAGE_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

export class VoteStorage {
  private static getStorageData(): VoteStorageData {
    try {
      const data = localStorage.getItem(VOTE_STORAGE_KEY)
      if (!data) {
        return { votes: [], lastUpdated: Date.now() }
      }

      const parsed = JSON.parse(data) as VoteStorageData

      // Check if data is expired
      if (Date.now() - parsed.lastUpdated > STORAGE_EXPIRY) {
        localStorage.removeItem(VOTE_STORAGE_KEY)
        return { votes: [], lastUpdated: Date.now() }
      }

      return parsed
    } catch (error) {
      console.error("Error reading vote storage:", error)
      return { votes: [], lastUpdated: Date.now() }
    }
  }

  private static saveStorageData(data: VoteStorageData): void {
    try {
      localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving vote storage:", error)
    }
  }

  static hasUserVotedInRoom(roomId: string, userId?: string, guestId?: string): LocalVoteData | null {
    const data = this.getStorageData()

    console.log("🔍 Checking local storage for vote:", { roomId, userId, guestId })
    console.log("📦 Local storage data:", data.votes)

    const foundVote = data.votes.find((vote) => {
      if (vote.roomId !== roomId) return false

      // Check for authenticated user
      if (userId && vote.userId === userId) {
        console.log("✅ Found vote for authenticated user:", vote)
        return true
      }

      // Check for guest user
      if (guestId && vote.guestId === guestId) {
        console.log("✅ Found vote for guest user:", vote)
        return true
      }

      return false
    })

    if (!foundVote) {
      console.log("❌ No vote found in local storage")
    }

    return foundVote || null
  }

  static saveUserVote(roomId: string, option: string, userId?: string, guestId?: string): void {
    const data = this.getStorageData()

    console.log("💾 Saving vote to local storage:", { roomId, option, userId, guestId })

    // Remove any existing vote for this room by this user
    data.votes = data.votes.filter((vote) => {
      if (vote.roomId !== roomId) return true

      // Remove if same user
      if (userId && vote.userId === userId) return false
      if (guestId && vote.guestId === guestId) return false

      return true
    })

    // Add new vote
    const newVote = {
      roomId,
      option,
      timestamp: Date.now(),
      userId,
      guestId,
    }

    data.votes.push(newVote)
    data.lastUpdated = Date.now()

    console.log("✅ Vote saved to local storage:", newVote)
    console.log("📦 Updated local storage:", data.votes)

    this.saveStorageData(data)
  }

  static removeUserVoteFromRoom(roomId: string, userId?: string, guestId?: string): void {
    const data = this.getStorageData()

    data.votes = data.votes.filter((vote) => {
      if (vote.roomId !== roomId) return true

      // Remove if same user
      if (userId && vote.userId === userId) return false
      if (guestId && vote.guestId === guestId) return false

      return true
    })

    data.lastUpdated = Date.now()
    this.saveStorageData(data)
  }

  static getUserVoteInRoom(roomId: string, userId?: string, guestId?: string): string | null {
    const vote = this.hasUserVotedInRoom(roomId, userId, guestId)
    return vote ? vote.option : null
  }

  static getAllUserVotes(): LocalVoteData[] {
    const data = this.getStorageData()
    return data.votes
  }

  static clearAllVotes(): void {
    localStorage.removeItem(VOTE_STORAGE_KEY)
  }

  static syncWithServerData(roomId: string, serverVote: any, userId?: string, guestId?: string): void {
    if (serverVote) {
      // Server says user has voted, make sure local storage reflects this
      this.saveUserVote(roomId, serverVote.option, userId, guestId)
    } else {
      // Server says user hasn't voted, remove from local storage
      this.removeUserVoteFromRoom(roomId, userId, guestId)
    }
  }
}
