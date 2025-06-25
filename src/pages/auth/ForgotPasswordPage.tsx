import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ArrowLeft, Mail, CheckCircle, Shield, Clock, RefreshCw } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Header from "../../components/Layout/Header"
import Button from "../../components/UI/Button"
import Input from "../../components/UI/Input"

interface ForgotPasswordForm {
  email: string
}

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const { forgotPassword } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>()

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true)
    setError("")

    try {
      await forgotPassword(data.email)
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  const securityFeatures = [
    {
      icon: Shield,
      title: "Secure Process",
      description: "Bank-level encryption",
    },
    {
      icon: Clock,
      title: "Quick Delivery",
      description: "Arrives within minutes",
    },
    {
      icon: RefreshCw,
      title: "Easy Reset",
      description: "One-click process",
    },
  ]

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1efdf] via-[#f8f6f0] to-[#f1efdf] relative overflow-hidden flex flex-col">
        <Header />

        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 -left-20 w-32 h-32 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-gradient-to-r from-[#ffc232]/10 to-[#ff7220]/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-20 flex-1 pt-0">
          <div className="w-full h-full">
            {/* Mobile Layout */}
            <div className="lg:hidden">
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                {/* Mobile Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#232013] mb-3">Email Sent!</h1>
                  <p className="text-[#6b7280] text-sm sm:text-base max-w-sm mx-auto">
                    Check your inbox for the password reset link
                  </p>
                </div>

                {/* Mobile Security Features */}
                <div className="mb-6 grid grid-cols-3 gap-3">
                  {securityFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg rounded-xl p-3 text-center"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <feature.icon className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="text-xs font-bold text-[#232013] mb-1">{feature.title}</h3>
                      <p className="text-xs text-[#6b7280] leading-tight">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Mobile Success Actions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-[#232013] mb-2">Check Your Email</h2>
                    <p className="text-[#6b7280] text-sm">
                      Please check your inbox and spam folder. The reset link expires in 24 hours.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link to="/login" className="block">
                      <Button className="w-full h-11 bg-gradient-to-r from-[#232013] to-[#3a3426] hover:from-[#3a3426] hover:to-[#232013] text-white font-semibold rounded-xl text-sm">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Login
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => setIsSuccess(false)}
                      className="w-full h-11 border border-[#e2e8f0] text-[#232013] hover:bg-[#f8f6f0] rounded-xl text-sm"
                    >
                      Send Another Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-2 min-h-[calc(100vh-5rem)] items-center">
              {/* Left Side - Success Branding */}
              <div className="bg-gradient-to-br from-[#f1efdf] to-[#e8e4d0] relative overflow-hidden flex flex-col justify-center p-8 xl:p-12 min-h-full">
                <div className="relative z-10 space-y-8">
                  <div>
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-3xl xl:text-4xl font-bold text-[#232013] mb-4 leading-tight">
                      Check your email for the reset link
                    </h2>

                    <p className="text-[#6b7280] text-lg leading-relaxed max-w-lg">
                      We've sent a secure password reset link to your email address. Follow the instructions to create a
                      new password.
                    </p>
                  </div>

                  {/* Compact Security Features */}
                  <div className="grid grid-cols-3 gap-4">
                    {securityFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-4 text-center"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-[#232013] mb-1">{feature.title}</h3>
                        <p className="text-xs text-[#6b7280]">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Success Actions */}
              <div className="bg-white flex flex-col justify-center p-8 xl:p-12 min-h-full">
                <div className="max-w-sm mx-auto w-full text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <Mail className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-[#232013] mb-4">Email Sent Successfully!</h3>
                  <p className="text-[#6b7280] text-sm mb-8">
                    Please check your inbox and spam folder. The reset link will expire in 24 hours.
                  </p>

                  <div className="space-y-3">
                    <Link to="/login" className="block">
                      <Button className="w-full h-11 bg-gradient-to-r from-[#232013] to-[#3a3426] hover:from-[#3a3426] hover:to-[#232013] text-white font-semibold rounded-xl text-sm">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Login
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => setIsSuccess(false)}
                      className="w-full h-11 border border-[#e2e8f0] text-[#232013] hover:bg-[#f8f6f0] rounded-xl text-sm"
                    >
                      Send Another Email
                    </Button>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1efdf] via-[#f8f6f0] to-[#f1efdf] relative overflow-hidden flex flex-col">
      <Header />

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
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#232013] mb-3">Reset Password</h1>
                <p className="text-[#6b7280] text-sm sm:text-base max-w-sm mx-auto">
                  Enter your email to receive a secure reset link
                </p>
              </div>

              {/* Mobile Security Features */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                {securityFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg rounded-xl p-3 text-center"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-lg flex items-center justify-center mx-auto mb-2">
                      <feature.icon className="w-3 h-3 text-white" />
                    </div>
                    <h3 className="text-xs font-bold text-[#232013] mb-1">{feature.title}</h3>
                    <p className="text-xs text-[#6b7280] leading-tight">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Mobile Reset Form */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-[#232013] mb-1">Forgot Password?</h2>
                  <p className="text-[#6b7280] text-sm">No worries! We'll help you reset it.</p>
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-[#232013] block mb-1">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="h-11 bg-[#f8f6f0]/80 border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl text-sm"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      error={errors.email?.message}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-semibold rounded-xl text-sm"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Mail size={16} />
                        Send Reset Email
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-4 pt-4 border-t border-slate-200/50 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 font-semibold text-[#805117] hover:text-[#ffc232] transition-colors text-sm"
                  >
                    <ArrowLeft size={14} />
                    Back to Login
                  </Link>
                </div>

                {/* Mobile Trust indicators */}
                <div className="mt-3 flex items-center justify-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1">
                    <Shield size={12} />
                    <span className="text-xs font-medium">Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span className="text-xs font-medium">Fast</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <RefreshCw size={12} />
                    <span className="text-xs font-medium">Easy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 min-h-[calc(100vh-5rem)] items-center">
            {/* Left Side - Colored Branding Section */}
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
                    Reset your password securely
                  </h2>
                  <p className="text-[#6b7280] text-lg leading-relaxed max-w-lg">
                    Enter your email address and we'll send you a secure link to reset your password.
                  </p>
                </div>

                {/* Compact Security Features with Glassmorphism */}
                <div className="relative">
                  <div className="grid grid-cols-3 gap-4">
                    {securityFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-[#232013] mb-1">{feature.title}</h3>
                        <p className="text-xs text-[#6b7280] leading-tight">{feature.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Clean White Reset Form */}
            <div className="bg-white flex flex-col justify-center p-8 xl:p-12 min-h-full">
              <div className="max-w-sm mx-auto w-full">
                {/* Form Header */}
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold text-[#232013] mb-2">Forgot your password?</h3>
                  <p className="text-[#6b7280] text-sm">No worries! Enter your email and we'll help you reset it.</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[#232013] block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="h-11 bg-[#f8f6f0]/80 border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl text-sm"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      error={errors.email?.message}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-semibold rounded-xl text-sm"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending Reset Email...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Mail size={16} />
                        Send Reset Email
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-5 pt-4 border-t border-slate-200/50 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 font-semibold text-[#805117] hover:text-[#ffc232] transition-colors text-sm"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="mt-4 flex items-center justify-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1 group">
                    <Shield size={14} className="group-hover:text-[#ffc232] transition-colors" />
                    <span className="text-xs font-medium">Secure</span>
                  </div>
                  <div className="flex items-center gap-1 group">
                    <Clock size={14} className="group-hover:text-[#ffc232] transition-colors" />
                    <span className="text-xs font-medium">Fast</span>
                  </div>
                  <div className="flex items-center gap-1 group">
                    <RefreshCw size={14} className="group-hover:text-[#ffc232] transition-colors" />
                    <span className="text-xs font-medium">Easy</span>
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

export default ForgotPasswordPage
