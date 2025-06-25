import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff, ArrowRight, Vote, TrendingUp, Users, Shield, Zap, CheckCircle } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Header from "../../components/Layout/Header"

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; color: string; speed: number }>
  >([])
  const [voteParticles, setVoteParticles] = useState<
    Array<{ id: number; x: number; y: number; emoji: string; opacity: number }>
  >([])
  const [voteData, setVoteData] = useState([
    { emoji: "🍚", name: "Jollof Rice", votes: 10, percentage: 42 },
    { emoji: "🥩", name: "Suya", votes: 15, percentage: 63 },
    { emoji: "🍲", name: "Pounded Yam", votes: 9, percentage: 38 },
  ])

  // Handle redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate("/dashboard")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, navigate])

  // Initialize floating particles
  useEffect(() => {
    const initialParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
      y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
      size: Math.random() * 2 + 1,
      color: ["#ffc232", "#ff7220", "#646B47", "#b2d57a"][Math.floor(Math.random() * 4)],
      speed: Math.random() * 0.2 + 0.1,
    }))
    setParticles(initialParticles)

    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y - particle.speed,
          x: particle.x + Math.sin(particle.y * 0.005) * 0.2,
          ...(particle.y < -10 && {
            y: (typeof window !== "undefined" ? window.innerHeight : 800) + 10,
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
          }),
        })),
      )
    }

    const interval = setInterval(animateParticles, 80)
    return () => clearInterval(interval)
  }, [])

  // Animate vote counts
  useEffect(() => {
    const interval = setInterval(() => {
      setVoteData((prev) =>
        prev.map((item, index) => {
          const change = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0
          const newVotes = Math.max(1, item.votes + change)
          const total = 34
          const newPercentage = (newVotes / total) * 100

          if (change !== 0) {
            const newParticle = {
              id: Date.now() + index,
              x: 100 + Math.random() * 50,
              y: 80 + index * 40,
              emoji: item.emoji,
              opacity: 1,
            }
            setVoteParticles((prev) => [...prev, newParticle])

            setTimeout(() => {
              setVoteParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
            }, 1500)
          }

          return {
            ...item,
            votes: newVotes,
            percentage: Math.min(100, newPercentage),
          }
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Animate vote particles
  useEffect(() => {
    const animateVoteParticles = () => {
      setVoteParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            y: particle.y - 1,
            x: particle.x + Math.sin(particle.y * 0.02) * 0.5,
            opacity: particle.opacity - 0.02,
          }))
          .filter((p) => p.opacity > 0),
      )
    }

    const interval = setInterval(animateVoteParticles, 60)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(email, password)
      // Navigation will be handled by the useEffect above
    } catch (err) {
      console.error("Login failed:", err)
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading spinner if authenticated (during redirect)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1efdf] to-[#f8f6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffc232] mx-auto mb-4"></div>
          <p className="text-[#6b7280] font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1efdf] via-[#f8f6f0] to-[#f1efdf] relative overflow-hidden flex flex-col">
      <Header />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-15"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              transition: "all 0.08s linear",
            }}
          />
        ))}
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-32 h-32 bg-gradient-to-r from-[#ffc232]/10 to-[#ff7220]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-gradient-to-r from-[#646B47]/10 to-[#b2d57a]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex-1 pt-0">
        <div className="w-full h-full">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              {/* Mobile Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#232013] mb-3">Welcome back</h1>
                <p className="text-[#6b7280] text-sm sm:text-base max-w-sm mx-auto">
                  Sign in to continue making impactful decisions with your team
                </p>
              </div>

              {/* Compact Mobile Demo */}
              <div className="mb-8 flex justify-center">
                <div className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl p-4 w-full max-w-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-lg flex items-center justify-center">
                        <Vote className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#232013]">Live Poll</h3>
                        <p className="text-xs text-[#6b7280]">Team Decision</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                      Live
                    </div>
                  </div>

                  <div className="space-y-2">
                    {voteData.slice(0, 2).map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{item.emoji}</span>
                            <span className="font-semibold text-[#232013] text-xs">{item.name}</span>
                          </div>
                          <span className="font-bold text-[#232013] text-xs">{item.votes}</span>
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-1000 ${
                              index === 0
                                ? "bg-gradient-to-r from-[#ffc232] to-[#ff7220]"
                                : "bg-gradient-to-r from-emerald-500 to-teal-500"
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Login Form */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#232013] mb-1">Sign in</h2>
                  <p className="text-[#6b7280] text-sm">Enter your credentials</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-[#232013] block mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-3 text-[#232013] bg-[#f8f6f0]/80 border border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl transition-all duration-200 outline-none placeholder:text-slate-400 text-sm"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#232013] block mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11 px-3 pr-10 text-[#232013] bg-[#f8f6f0]/80 border border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl transition-all duration-200 outline-none placeholder:text-slate-400 text-sm"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ffc232] transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-[#805117] hover:text-[#ffc232] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-r from-[#232013] to-[#3a3426] hover:from-[#3a3426] hover:to-[#232013] text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Sign in
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-slate-200/50 text-center">
                  <p className="text-[#6b7280] text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-[#805117] hover:text-[#ffc232] transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>

                {/* Mobile Trust indicators */}
                <div className="mt-3 flex items-center justify-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1">
                    <Shield size={12} />
                    <span className="text-xs font-medium">Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={12} />
                    <span className="text-xs font-medium">Fast</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span className="text-xs font-medium">Team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 min-h-[calc(100vh-5rem)] items-center">
            {/* Left Side - Branding Section */}
            <div className="bg-gradient-to-br from-[#f1efdf] to-[#e8e4d0] relative overflow-hidden flex flex-col justify-center p-8 xl:p-12 min-h-full">
              {/* Background Elements for Left Side */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-8 w-24 h-24 bg-gradient-to-r from-[#ffc232]/15 to-[#ff7220]/15 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 -right-8 w-32 h-32 bg-gradient-to-r from-[#646B47]/15 to-[#b2d57a]/15 rounded-full blur-2xl"></div>
              </div>

              <div className="relative z-10 space-y-8">
                {/* Brand Header */}
                <div>
                  <h2 className="text-3xl xl:text-4xl font-bold text-[#232013] mb-4 leading-tight">
                    Welcome back to collaborative decision making
                  </h2>
                  <p className="text-[#6b7280] text-lg leading-relaxed max-w-lg">
                    Sign in to continue making impactful decisions with your team in real-time.
                  </p>
                </div>

                {/* Interactive Demo */}
                <div className="relative">
                  {/* Vote Particles */}
                  {voteParticles.map((particle) => (
                    <div
                      key={particle.id}
                      className="absolute text-lg pointer-events-none z-30"
                      style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        opacity: particle.opacity,
                        transform: `scale(${particle.opacity})`,
                        transition: "all 0.06s linear",
                      }}
                    >
                      {particle.emoji}
                    </div>
                  ))}

                  {/* Demo Card */}
                  <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-5 transform hover:scale-105 transition-all duration-500 max-w-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center">
                          <Vote className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#232013]">Live Poll</h3>
                          <p className="text-xs text-[#6b7280]">Team Lunch Decision</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        Live
                      </div>
                    </div>

                    <div className="space-y-3">
                      {voteData.map((item, index) => (
                        <div key={index} className="group">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                                {item.emoji}
                              </span>
                              <span className="font-semibold text-[#232013] text-sm">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-[#232013] text-sm">{item.votes}</span>
                              <CheckCircle size={12} className="text-green-500" />
                            </div>
                          </div>
                          <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                            <div
                              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                                index === 0
                                  ? "bg-gradient-to-r from-[#ffc232] to-[#ff7220]"
                                  : index === 1
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                    : "bg-gradient-to-r from-orange-500 to-red-500"
                              }`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#232013]">
                        {voteData.reduce((sum, item) => sum + item.votes, 0)} total votes
                      </span>
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#232013]">
                        <TrendingUp size={12} className="text-green-600" />
                        Real-time
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                    <Vote className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2 group">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm group-hover:bg-white/30 rounded-xl flex items-center justify-center mx-auto transition-colors duration-300 border border-white/20">
                      <Vote className="w-4 h-4 text-[#232013]" />
                    </div>
                    <p className="text-xs font-semibold text-[#232013]">Real-time</p>
                  </div>
                  <div className="space-y-2 group">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm group-hover:bg-white/30 rounded-xl flex items-center justify-center mx-auto transition-colors duration-300 border border-white/20">
                      <Users className="w-4 h-4 text-[#232013]" />
                    </div>
                    <p className="text-xs font-semibold text-[#232013]">Collaborative</p>
                  </div>
                  <div className="space-y-2 group">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm group-hover:bg-white/30 rounded-xl flex items-center justify-center mx-auto transition-colors duration-300 border border-white/20">
                      <TrendingUp className="w-4 h-4 text-[#232013]" />
                    </div>
                    <p className="text-xs font-semibold text-[#232013]">Analytics</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Compact Login Form */}
            <div className="bg-white flex flex-col justify-center p-8 xl:p-12 min-h-full">
              <div className="max-w-sm mx-auto w-full">
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#232013] mb-2">Sign in to your account</h3>
                    <p className="text-[#6b7280] text-sm">Enter your credentials to access your dashboard</p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-[#232013] block">Email address</label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 px-3 text-[#232013] bg-[#f8f6f0]/80 backdrop-blur-sm border border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl transition-all duration-200 outline-none placeholder:text-slate-400 text-sm"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-[#232013] block">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-11 px-3 pr-10 text-[#232013] bg-[#f8f6f0]/80 backdrop-blur-sm border border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl transition-all duration-200 outline-none placeholder:text-slate-400 text-sm"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ffc232] transition-colors disabled:opacity-50"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        to="/forgot-password"
                        className="text-sm font-semibold text-[#805117] hover:text-[#ffc232] transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 bg-gradient-to-r from-[#232013] to-[#3a3426] hover:from-[#3a3426] hover:to-[#232013] text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Signing in...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          Sign in
                          <ArrowRight size={16} />
                        </div>
                      )}
                    </button>
                  </form>

                  <div className="mt-5 pt-4 border-t border-slate-200/50">
                    <p className="text-center text-[#6b7280] text-sm">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="font-semibold text-[#805117] hover:text-[#ffc232] transition-colors"
                      >
                        Sign up for free
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-4 flex items-center justify-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1 group">
                    <Shield size={14} className="group-hover:text-[#ffc232] transition-colors" />
                    <span className="text-xs font-medium">Secure</span>
                  </div>
                  <div className="flex items-center gap-1 group">
                    <Zap size={14} className="group-hover:text-[#ffc232] transition-colors" />
                    <span className="text-xs font-medium">Fast</span>
                  </div>
                  <div className="flex items-center gap-1 group">
                    <Users size={14} className="group-hover:text-[#ffc232] transition-colors" />
                    <span className="text-xs font-medium">Team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 bg-[#292618] py-4">
        <div className="text-center">
          <p className="text-white/80 text-sm font-medium">VoteSpace 2025</p>
        </div>
      </footer>
    </div>
  )
}

export default LoginPage
