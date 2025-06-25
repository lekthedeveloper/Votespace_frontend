import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Vote, Users, TrendingUp, Calendar, ArrowRight, Award, Key, Shield, Zap } from "lucide-react"
import Header from "../components/Layout/Header"
import Button from "../components/UI/Button"
import Card from "../components/UI/Card"
import Input from "../components/UI/Input"
import { useAuth } from "../contexts/AuthContext"
import { useRooms } from "../hooks/useRooms"
import { apiService } from "../services/api"

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { rooms, isLoading, error, refreshRooms } = useRooms()
  const [joinCode, setJoinCode] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [joinError, setJoinError] = useState("")

  useEffect(() => {
    if (user) {
      refreshRooms()
    }
  }, [user, refreshRooms])

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode.trim()) return

    setIsJoining(true)
    setJoinError("")

    try {
      const response = await apiService.joinRoomByCode(joinCode.trim().toUpperCase())
      const room = response.data?.room

      if (room?.id) {
        navigate(`/room/${room.id}`)
      } else {
        setJoinError("Invalid response from server")
      }
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Failed to join room")
    } finally {
      setIsJoining(false)
    }
  }

  const getStatusColor = (room: any) => {
    if (!room.isActive) return "closed"
    if (room.deadline && new Date() > new Date(room.deadline)) return "expired"
    return "active"
  }

  const getStatusText = (room: any) => {
    if (!room.isActive) return "Closed"
    if (room.deadline && new Date() > new Date(room.deadline)) return "Expired"
    return "Active"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1efdf] via-[#f8f6f0] to-[#f1efdf]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <div className="w-12 h-12 border-4 border-[#e5e7eb] border-t-[#ffc232] rounded-full animate-spin"></div>
            <p className="text-lg text-[#6b7280] font-medium">Loading your rooms...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1efdf] via-[#f8f6f0] to-[#f1efdf] relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-32 h-32 bg-gradient-to-r from-[#ffc232]/10 to-[#ff7220]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-gradient-to-r from-[#646B47]/10 to-[#b2d57a]/10 rounded-full blur-3xl"></div>
      </div>

      <Header />

      {/* Desktop Version */}
      <div className="hidden lg:block relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Vote className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#232013] mb-4 leading-tight">Decision Dashboard</h1>
          <p className="text-[#6b7280] text-lg max-w-2xl mx-auto">
            Create voting rooms, manage decisions, and collaborate with your team in real-time
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Create Room Card */}
          <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-2xl flex items-center justify-center shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#232013] mb-2">Create New Room</h3>
                <p className="text-[#6b7280]">Start a new decision-making session</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/create-room")}
              className="w-full h-14 bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Room
            </Button>
          </Card>

          {/* Join Room Card */}
          <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#646B47] to-[#b2d57a] rounded-2xl flex items-center justify-center shadow-lg">
                <Key className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#232013] mb-2">Join with Code</h3>
                <p className="text-[#6b7280]">Enter a room code to participate</p>
              </div>
            </div>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="flex gap-3">
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter room code"
                  className="flex-1 h-14 px-4 text-[#232013] bg-[#f8f6f0]/80 backdrop-blur-sm border border-[#e2e8f0] focus:border-[#ffc232] focus:ring-4 focus:ring-[#ffc232]/20 rounded-2xl transition-all duration-200 outline-none placeholder:text-slate-400 text-center font-mono font-bold tracking-wider"
                  maxLength={8}
                />
                <Button
                  type="submit"
                  disabled={isJoining || !joinCode.trim()}
                  className="h-14 px-6 bg-gradient-to-r from-[#646B47] to-[#b2d57a] hover:from-[#5a5f42] hover:to-[#a1c968] text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isJoining ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </Button>
              </div>
              {joinError && <p className="text-red-600 text-sm font-medium">{joinError}</p>}
            </form>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-2xl flex items-center justify-center shadow-lg">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#232013]">{rooms.length}</h3>
                <p className="text-[#6b7280] font-medium">Total Rooms</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#232013]">{rooms.filter((room) => room.isActive).length}</h3>
                <p className="text-[#6b7280] font-medium">Active Rooms</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#232013]">
                  {rooms.reduce((total, room) => total + (room.totalVotes || 0), 0)}
                </h3>
                <p className="text-[#6b7280] font-medium">Total Votes</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Rooms Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#232013]">Your Rooms</h2>
            <Button
              variant="outline"
              onClick={refreshRooms}
              className="flex items-center gap-2 px-4 py-2 text-[#805117] hover:text-[#ffc232] transition-colors font-medium border border-[#e2e8f0] rounded-xl hover:bg-[#f8f6f0]"
            >
              <TrendingUp className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl mb-6">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {rooms.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Vote className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#232013] mb-4">No rooms yet</h3>
              <p className="text-[#6b7280] mb-8 max-w-md mx-auto">
                Create your first decision room to start collaborating with your team
              </p>
              <Button
                onClick={() => navigate("/create-room")}
                className="h-14 px-8 bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Create Your First Room
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <Card
                  key={room.id}
                  className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group"
                >
                  {/* Room Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                        getStatusColor(room) === "active"
                          ? "bg-green-100 text-green-700"
                          : getStatusColor(room) === "expired"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          getStatusColor(room) === "active"
                            ? "bg-green-500 animate-pulse"
                            : getStatusColor(room) === "expired"
                              ? "bg-orange-500"
                              : "bg-gray-400"
                        }`}
                      ></div>
                      {getStatusText(room)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/room/${room.id}`)}
                      className="w-10 h-10 bg-[#f8f6f0] hover:bg-[#ffc232] rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                    >
                      <ArrowRight className="w-5 h-5 text-[#232013]" />
                    </Button>
                  </div>

                  {/* Room Content */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#232013] mb-2 line-clamp-2">{room.title}</h3>
                    <p className="text-[#6b7280] line-clamp-2 leading-relaxed">{room.description}</p>
                  </div>

                  {/* Room Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#6b7280] mb-1">
                        <Vote className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-semibold text-[#232013]">{room.totalVotes || 0} votes</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#6b7280] mb-1">
                        <Users className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-semibold text-[#232013]">{room.suggestions?.length || 0} options</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#6b7280] mb-1">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-semibold text-[#232013]">
                        {new Date(room.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Leading Option */}
                  {room.leadingOption && (
                    <div className="bg-gradient-to-r from-[#ffc232]/10 to-[#ff7220]/10 border border-[#ffc232]/20 rounded-2xl p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-[#805117]" />
                        <span className="text-xs font-bold text-[#805117] uppercase tracking-wide">Leading</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#232013]">{room.leadingOption.option}</span>
                        <span className="text-sm font-bold text-[#805117]">{room.leadingOption.count} votes</span>
                      </div>
                    </div>
                  )}

                  {/* Room Footer */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#6b7280] font-medium">Code:</span>
                      <code className="text-sm font-bold text-[#805117] bg-[#ffc232]/10 px-2 py-1 rounded-lg tracking-wider">
                        {room.joinCode}
                      </code>
                    </div>
                    <Button
                      onClick={() => navigate(`/room/${room.id}`)}
                      className="h-10 px-4 bg-gradient-to-r from-[#232013] to-[#3a3426] hover:from-[#3a3426] hover:to-[#232013] text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] text-sm"
                    >
                      Manage
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 text-slate-400">
          <div className="flex items-center gap-2 group">
            <Shield size={16} className="group-hover:text-[#ffc232] transition-colors" />
            <span className="text-sm font-medium">Secure & Private</span>
          </div>
          <div className="flex items-center gap-2 group">
            <Zap size={16} className="group-hover:text-[#ffc232] transition-colors" />
            <span className="text-sm font-medium">Real-time Results</span>
          </div>
          <div className="flex items-center gap-2 group">
            <Users size={16} className="group-hover:text-[#ffc232] transition-colors" />
            <span className="text-sm font-medium">Team Collaboration</span>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden relative z-20 px-4 py-6 pt-24">
        {/* Mobile Hero */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#232013] mb-2">Dashboard</h1>
          <p className="text-[#6b7280] text-sm">Manage your voting rooms</p>
        </div>

        {/* Mobile Quick Actions */}
        <div className="space-y-4 mb-8">
          {/* Create Room */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#232013]">Create Room</h3>
                <p className="text-[#6b7280] text-sm">Start new decision</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/create-room")}
              className="w-full h-12 bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Room
            </Button>
          </div>

          {/* Join Room */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#646B47] to-[#b2d57a] rounded-xl flex items-center justify-center shadow-lg">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#232013]">Join Room</h3>
                <p className="text-[#6b7280] text-sm">Enter room code</p>
              </div>
            </div>
            <form onSubmit={handleJoinRoom} className="space-y-3">
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Room Code"
                className="w-full h-12 px-4 text-[#232013] bg-[#f8f6f0]/80 backdrop-blur-sm border border-[#e2e8f0] focus:border-[#ffc232] focus:ring-4 focus:ring-[#ffc232]/20 rounded-xl transition-all duration-200 outline-none placeholder:text-slate-400 text-center font-mono font-bold tracking-wider"
                maxLength={8}
              />
              <Button
                type="submit"
                disabled={isJoining || !joinCode.trim()}
                className="w-full h-12 bg-gradient-to-r from-[#646B47] to-[#b2d57a] hover:from-[#5a5f42] hover:to-[#a1c968] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isJoining ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Join Room
                  </>
                )}
              </Button>
              {joinError && <p className="text-red-600 text-xs font-medium">{joinError}</p>}
            </form>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-4 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Vote className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold text-[#232013]">{rooms.length}</div>
            <div className="text-xs text-[#6b7280] font-medium">Rooms</div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-4 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold text-[#232013]">{rooms.filter((room) => room.isActive).length}</div>
            <div className="text-xs text-[#6b7280] font-medium">Active</div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-4 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold text-[#232013]">
              {rooms.reduce((total, room) => total + (room.totalVotes || 0), 0)}
            </div>
            <div className="text-xs text-[#6b7280] font-medium">Votes</div>
          </div>
        </div>

        {/* Mobile Rooms Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#232013]">Your Rooms</h2>
            <Button
              variant="outline"
              onClick={refreshRooms}
              className="flex items-center gap-2 px-3 py-2 text-[#805117] hover:text-[#ffc232] transition-colors font-medium border border-[#e2e8f0] rounded-lg hover:bg-[#f8f6f0] text-sm"
            >
              <TrendingUp className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl mb-6">
              <p className="text-red-700 font-medium text-sm">{error}</p>
            </div>
          )}

          {rooms.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[#232013] mb-2">No rooms yet</h3>
              <p className="text-[#6b7280] mb-6 text-sm">
                Create your first decision room to start collaborating
              </p>
              <Button
                onClick={() => navigate("/create-room")}
                className="w-full h-12 bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create First Room
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-6"
                >
                  {/* Mobile Room Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        getStatusColor(room) === "active"
                          ? "bg-green-100 text-green-700"
                          : getStatusColor(room) === "expired"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          getStatusColor(room) === "active"
                            ? "bg-green-500 animate-pulse"
                            : getStatusColor(room) === "expired"
                              ? "bg-orange-500"
                              : "bg-gray-400"
                        }`}
                      ></div>
                      {getStatusText(room)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/room/${room.id}`)}
                      className="w-8 h-8 bg-[#f8f6f0] hover:bg-[#ffc232] rounded-lg flex items-center justify-center transition-all duration-200"
                    >
                      <ArrowRight className="w-4 h-4 text-[#232013]" />
                    </Button>
                  </div>

                  {/* Mobile Room Content */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#232013] mb-1 line-clamp-2">{room.title}</h3>
                    <p className="text-[#6b7280] text-sm line-clamp-2 leading-relaxed">{room.description}</p>
                  </div>

                  {/* Mobile Room Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#6b7280] mb-1">
                        <Vote className="w-3 h-3" />
                      </div>
                      <p className="text-xs font-semibold text-[#232013]">{room.totalVotes || 0}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#6b7280] mb-1">
                        <Users className="w-3 h-3" />
                      </div>
                      <p className="text-xs font-semibold text-[#232013]">{room.suggestions?.length || 0}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#6b7280] mb-1">
                        <Calendar className="w-3 h-3" />
                      </div>
                      <p className="text-xs font-semibold text-[#232013]">
                        {new Date(room.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Leading Option */}
                  {room.leadingOption && (
                    <div className="bg-gradient-to-r from-[#ffc232]/10 to-[#ff7220]/10 border border-[#ffc232]/20 rounded-xl p-3 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-3 h-3 text-[#805117]" />
                        <span className="text-xs font-bold text-[#805117] uppercase tracking-wide">Leading</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#232013] text-sm truncate">{room.leadingOption.option}</span>
                        <span className="text-xs font-bold text-[#805117]">{room.leadingOption.count}</span>
                      </div>
                    </div>
                  )}

                  {/* Mobile Room Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6b7280] font-medium">Code:</span>
                      <code className="text-xs font-bold text-[#805117] bg-[#ffc232]/10 px-2 py-1 rounded-lg tracking-wider">
                        {room.joinCode}
                      </code>
                    </div>
                    <Button
                      onClick={() => navigate(`/room/${room.id}`)}
                      className="h-8 px-3 bg-gradient-to-r from-[#232013] to-[#3a3426] hover:from-[#3a3426] hover:to-[#232013] text-white font-semibold rounded-lg transition-all duration-200 text-xs"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Trust Indicators */}
        <div className="flex items-center justify-center gap-6 text-slate-400">
          <div className="flex items-center gap-1 group">
            <Shield size={14} className="group-hover:text-[#ffc232] transition-colors" />
            <span className="text-xs font-medium">Secure</span>
          </div>
          <div className="flex items-center gap-1 group">
            <Zap size={14} className="group-hover:text-[#ffc232] transition-colors" />
            <span className="text-xs font-medium">Real-time</span>
          </div>
          <div className="flex items-center gap-1 group">
            <Users size={14} className="group-hover:text-[#ffc232] transition-colors" />
            <span className="text-xs font-medium">Collaborative</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage