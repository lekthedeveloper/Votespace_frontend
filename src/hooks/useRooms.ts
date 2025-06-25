import { useState, useCallback } from "react"
import { apiService } from "../services/api"

export const useRooms = () => {
  const [rooms, setRooms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createRoom = async (data: any): Promise<any> => {
    setError(null)
    try {
      console.log("=== CREATING ROOM ===")
      console.log("Create room data:", data)

      const response = await apiService.createRoom(data)
      console.log("Raw createRoom response:", response)

      // Extract the room from the nested response
      const room = response.data?.room || response.room || response
      console.log("Extracted room:", room)

      if (!room || !room.id) {
        throw new Error("Invalid response: missing room data")
      }

      await fetchRooms() // Refresh the rooms list
      return response // Return the full response as expected by the interface
    } catch (err: any) {
      console.error("Create room error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to create room"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const refreshRooms = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("=== FETCHING ROOMS ===")
      const response = await apiService.getUserRooms()
      console.log("Raw getUserRooms response:", response)

      // Handle nested response structure: response.data.rooms
      const roomsData = response.data?.rooms || response.rooms || response.data || []
      console.log("Extracted rooms data:", roomsData)

      setRooms(Array.isArray(roomsData) ? roomsData : [])
    } catch (err: any) {
      console.error("Fetch rooms error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch rooms")
      setRooms([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchRooms = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("=== FETCHING ROOMS ===")
      const response = await apiService.getUserRooms()
      console.log("Raw getUserRooms response:", response)

      // Handle nested response structure: response.data.rooms
      const roomsData = response.data?.rooms || response.rooms || response.data || []
      console.log("Extracted rooms data:", roomsData)

      setRooms(Array.isArray(roomsData) ? roomsData : [])
    } catch (err: any) {
      console.error("Fetch rooms error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch rooms")
      setRooms([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const getRoomDetails = async (roomId: string): Promise<any> => {
    setError(null)
    try {
      console.log("=== GETTING ROOM DETAILS ===")
      console.log("Room ID:", roomId)

      const response = await apiService.getRoomDetails(roomId)
      console.log("Raw getRoomDetails response:", response)

      // Handle nested response structure: response.data.room
      const roomData = response.data?.room || response.room || response.data || response
      console.log("Extracted room data:", roomData)

      if (!roomData || !roomData.id) {
        throw new Error("Invalid response: missing room data")
      }

      return roomData
    } catch (err: any) {
      console.error("Get room details error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch room details"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    rooms,
    isLoading,
    error,
    createRoom,
    getRoomDetails, // Add this line
    refreshRooms,
  }
}
