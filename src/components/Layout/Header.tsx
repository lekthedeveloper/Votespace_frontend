import type React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { User, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useState } from "react"

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isLoginPage = location.pathname === "/login"
  const isRegisterPage = location.pathname === "/register"

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="bg-[#f1efdf] border-b border-[#232013]/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="hover:transform hover:-translate-y-0.5 transition-transform duration-200">
            <span className="text-2xl font-black tracking-tight text-[#232013] hover:text-[#ff7220] transition-colors duration-200">
              VoteSpace
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-[#232013] hover:text-[#ffc232] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-white/50 px-3 py-1.5 rounded-lg border border-[#232013]/10">
                    <User className="h-4 w-4 text-[#232013]/70" />
                    <span className="text-sm font-medium text-[#232013]">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-[#232013]/70 hover:text-[#ff7220] px-2 py-1 rounded-md transition-colors duration-200 hover:bg-white/50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {!isLoginPage && (
                  <Link
                    to="/login"
                    className="text-[#232013] hover:text-[#ffc232] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                )}
                {!isRegisterPage && (
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-[#ffc232] to-[#ff7220] text-white px-4 py-2 rounded-md text-sm font-medium hover:from-[#ffb000] hover:to-[#e55a00] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-[#232013] hover:bg-white/50 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#232013]/10">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  className="block text-[#232013] hover:text-[#ffc232] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 px-3 py-2">
                  <User className="h-4 w-4 text-[#232013]/70" />
                  <span className="text-sm font-medium text-[#232013]">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 text-[#ff7220] px-3 py-2 rounded-md text-sm font-medium w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {!isLoginPage && (
                  <Link
                    to="/login"
                    className="block text-[#232013] hover:text-[#ffc232] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
                {!isRegisterPage && (
                  <Link
                    to="/register"
                    className="block bg-gradient-to-r from-[#ffc232] to-[#ff7220] text-white px-3 py-2 rounded-md text-sm font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
