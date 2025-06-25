import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { SecurityProvider } from "./security/SecurityProvider"
import { CSPProvider } from "./security/CSPProvider"
import { SessionManager } from "./security/SessionManager"
import { RateLimitProvider } from "./security/RateLimiter"
import { SecurityHeaders } from "./components/security/SecurityHeaders"
import ProtectedRoute from "./components/ProtectedRoute"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import DashboardPage from "./pages/DashboardPage"
import CreateRoomPage from "./pages/CreateRoomPage"
import RoomDetailsPage from "./pages/RoomDetailsPage"

function App() {
  return (
    <CSPProvider>
      <SecurityProvider>
        <RateLimitProvider>
          <AuthProvider>
            <SessionManager>
              <Router>
                <SecurityHeaders />
                <div className="min-h-screen bg-gray-50">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/create-room"
                      element={
                        <ProtectedRoute>
                          <CreateRoomPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/room/:roomId" element={<RoomDetailsPage />} />
                  </Routes>
                </div>
              </Router>
            </SessionManager>
          </AuthProvider>
        </RateLimitProvider>
      </SecurityProvider>
    </CSPProvider>
  )
}

export default App
