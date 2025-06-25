const API_BASE_URL = "https://votingspace.onrender.com/api/v1"

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean
}

class ApiService {
  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { requiresAuth = false, ...fetchOptions } = options

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      Accept: "application/json",
      ...fetchOptions.headers,
    }

    if (requiresAuth) {
      const token = localStorage.getItem("accessToken")
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    } else {
      // For non-auth requests, still include token if available for better UX
      const token = localStorage.getItem("accessToken")
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
        mode: "cors",
        credentials: "include", // Include cookies for guest voting
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
        }
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      const responseData = await response.json()
      return responseData
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Network error: Unable to connect to the server. Please check your internet connection or try again later.",
        )
      }
      throw error
    }
  }

  // Auth endpoints
  async register(data: { email: string; password: string; name: string }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async login(data: { email: string; password: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async refreshToken(refreshToken: string) {
    return this.request("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
      requiresAuth: true,
    })
  }

  async forgotPassword(email: string) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, data: { password: string; passwordConfirm: string }) {
    return this.request(`/auth/reset-password/${token}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  // Room endpoints
  async createRoom(data: {
    title: string
    description: string
    options: string[]
    isAnonymous?: boolean
    allowMultipleVotes?: boolean
    endDate?: string
  }) {
    return this.request("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    })
  }

  async getRoomDetails(roomId: string) {
    if (!roomId) {
      throw new Error("Room ID is required")
    }

    return this.request(`/rooms/${roomId}`, {
      method: "GET",
      requiresAuth: false,
    })
  }

  async getUserRooms() {
    return this.request("/rooms", {
      method: "GET",
      requiresAuth: true,
    })
  }

  // NEW: Check if user can vote before attempting to vote
  async checkVoteStatus(roomId: string) {
    console.log("=== CHECK VOTE STATUS API CALL ===")
    console.log("Room ID:", roomId)

    try {
      return await this.request(`/votes/${roomId}/status`, {
        method: "GET",
        requiresAuth: false, // Works for both authenticated and guest users
      })
    } catch (error) {
      console.log("Vote status check failed, assuming user can vote")
      return {
        status: "success",
        data: {
          hasVoted: false,
          canVote: true,
          votes: [],
          message: "You can cast your vote",
        },
      }
    }
  }

  // Enhanced voting with better error detection
  async castVote(roomId: string, data: { option: string; justification?: string }) {
    console.log("=== CAST VOTE API CALL ===")
    console.log("Room ID:", roomId)
    console.log("Vote data:", data)

    try {
      return await this.request(`/votes/${roomId}`, {
        method: "POST",
        body: JSON.stringify(data),
        requiresAuth: false,
      })
    } catch (error) {
      console.error("❌ Vote casting failed:", error)

      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      // Check for specific error patterns from backend
      if (
        errorMessage.includes("Vote already exists") ||
        errorMessage.includes("already voted") ||
        errorMessage.includes("already cast")
      ) {
        // Throw a specific error type that frontend can catch
        const duplicateError = new Error("DUPLICATE_VOTE")
        duplicateError.name = "DuplicateVoteError"
        throw duplicateError
      }

      if (errorMessage.includes("Foreign key constraint") && errorMessage.includes("votes_userId_fkey")) {
        // This is also likely a duplicate vote issue
        const duplicateError = new Error("DUPLICATE_VOTE")
        duplicateError.name = "DuplicateVoteError"
        throw duplicateError
      }

      if (errorMessage.includes("Room creators cannot vote")) {
        throw new Error("CREATOR_CANNOT_VOTE")
      }

      if (errorMessage.includes("Voting is closed")) {
        throw new Error("VOTING_CLOSED")
      }

      if (errorMessage.includes("deadline has passed")) {
        throw new Error("DEADLINE_PASSED")
      }

      if (errorMessage.includes("Invalid option")) {
        throw new Error("INVALID_OPTION")
      }

      // Generic fallback
      throw error
    }
  }

  async getVoteResults(roomId: string) {
    console.log("=== GET VOTE RESULTS API CALL ===")
    console.log("Room ID:", roomId)

    return this.request(`/votes/${roomId}/results`, {
      method: "GET",
      requiresAuth: false,
    })
  }

  async getUserVotes() {
    console.log("=== GET USER VOTES API CALL ===")

    return this.request("/votes/my-votes", {
      method: "GET",
      requiresAuth: true,
    })
  }

  async getUserVoteInRoom(roomId: string) {
    console.log("=== GET USER VOTE IN ROOM API CALL ===")
    console.log("Room ID:", roomId)

    try {
      return await this.request(`/votes/${roomId}/my-vote`, {
        method: "GET",
        requiresAuth: true,
      })
    } catch (error) {
      // If user is not authenticated, return null vote
      console.log("User vote check failed (likely not authenticated)")
      return {
        status: "success",
        data: { vote: null },
      }
    }
  }

  // Additional room management endpoints
  async addSuggestion(roomId: string, text: string) {
    console.log("=== ADD SUGGESTION API CALL ===")
    console.log("Room ID:", roomId)
    console.log("Suggestion text:", text)

    return this.request(`/rooms/${roomId}/suggestions`, {
      method: "POST",
      body: JSON.stringify({ text }),
      requiresAuth: true,
    })
  }

  async deleteSuggestion(roomId: string, suggestionId: string) {
    console.log("=== DELETE SUGGESTION API CALL ===")
    console.log("Room ID:", roomId)
    console.log("Suggestion ID:", suggestionId)

    return this.request(`/rooms/${roomId}/suggestions/${suggestionId}`, {
      method: "DELETE",
      requiresAuth: true,
    })
  }

  async closeRoom(roomId: string) {
    console.log("=== CLOSE ROOM API CALL ===")
    console.log("Room ID:", roomId)

    return this.request(`/rooms/${roomId}/close`, {
      method: "PATCH",
      requiresAuth: true,
    })
  }

  // 🔥 FIXED: Join room should work for both authenticated and guest users
  async joinRoomByCode(joinCode: string) {
    console.log("=== JOIN ROOM BY CODE API CALL ===")
    console.log("Join code:", joinCode)

    try {
      // First try with authentication if user is logged in
      return await this.request("/rooms/join", {
        method: "POST",
        body: JSON.stringify({ joinCode }),
        requiresAuth: false, // Changed to false to allow guests
      })
    } catch (error) {
      console.error("❌ Join room failed:", error)

      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      // Handle specific error cases
      if (errorMessage.includes("Room not found") || errorMessage.includes("Invalid join code")) {
        throw new Error("Invalid room code. Please check the code and try again.")
      }

      if (errorMessage.includes("Room is closed") || errorMessage.includes("not active")) {
        throw new Error("This room is no longer accepting participants.")
      }

      if (errorMessage.includes("permission") || errorMessage.includes("403")) {
        throw new Error("Unable to join room. Please try logging in first.")
      }

      // Generic fallback
      throw new Error("Failed to join room. Please try again.")
    }
  }

  async updateRoom(
    roomId: string,
    data: {
      title?: string
      description?: string
      isAnonymous?: boolean
      allowMultipleVotes?: boolean
      endDate?: string
    },
  ) {
    console.log("=== UPDATE ROOM API CALL ===")
    console.log("Room ID:", roomId)
    console.log("Update data:", data)

    return this.request(`/rooms/${roomId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      requiresAuth: true,
    })
  }

  async deleteRoom(roomId: string) {
    console.log("=== DELETE ROOM API CALL ===")
    console.log("Room ID:", roomId)

    return this.request(`/rooms/${roomId}`, {
      method: "DELETE",
      requiresAuth: true,
    })
  }
}

export const apiService = new ApiService()
