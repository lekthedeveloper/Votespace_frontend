"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, Vote, Users, BarChart3, Shield } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Header from "../../components/Layout/Header"
import Button from "../../components/UI/Button"
import Input from "../../components/UI/Input"

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterForm>()

  const password = watch("password")
  const totalSteps = 2

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterForm)[] = []

    if (currentStep === 1) {
      fieldsToValidate = ["name", "email"]
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError("")

    try {
      await registerUser(data.email, data.password, data.name)
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "", requirements: [] }

    let strength = 0
    const requirements = []

    // Length requirements
    if (password.length >= 8) {
      strength += 1
      requirements.push("✓ At least 8 characters")
    } else {
      requirements.push("✗ At least 8 characters")
    }

    // Uppercase letter
    if (/[A-Z]/.test(password)) {
      strength += 1
      requirements.push("✓ One uppercase letter")
    } else {
      requirements.push("✗ One uppercase letter")
    }

    // Lowercase letter
    if (/[a-z]/.test(password)) {
      strength += 1
      requirements.push("✓ One lowercase letter")
    } else {
      requirements.push("✗ One lowercase letter")
    }

    // Number
    if (/[0-9]/.test(password)) {
      strength += 1
      requirements.push("✓ One number")
    } else {
      requirements.push("✗ One number")
    }

    // Special character
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1
      requirements.push("✓ One special character")
    } else {
      requirements.push("✗ One special character")
    }

    const configs = [
      { label: "", color: "" },
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-red-400" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-green-400" },
      { label: "Strong", color: "bg-green-500" },
    ]

    return { strength, ...configs[strength], requirements }
  }

  const passwordStrength = getPasswordStrength(password || "")

  const features = [
    {
      icon: Vote,
      title: "Anonymous Voting",
      description: "Secure decision making",
      color: "from-[#ffc232] to-[#ff7220]",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Unlimited members",
      color: "from-[#b2d57a] to-[#9cb86f]",
    },
    {
      icon: BarChart3,
      title: "Real-time Results",
      description: "Live analytics",
      color: "from-[#ff7220] to-[#e55a00]",
    },
    {
      icon: Shield,
      title: "Unlimited  Room ",
      description: " Create generic rooms",
      color: "from-[#805117] to-[#a66b1f]",
    },
  ]

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
                <h1 className="text-2xl sm:text-3xl font-bold text-[#232013] mb-3">Join VoteSpace</h1>
                <p className="text-[#6b7280] text-sm sm:text-base max-w-sm mx-auto">
                  Create your account and start making collaborative decisions
                </p>
              </div>

              {/* Mobile Progress Indicator */}
              <div className="flex items-center justify-center mb-6">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
                        currentStep >= step
                          ? "bg-gradient-to-r from-[#ffc232] to-[#ff7220] text-white shadow-lg"
                          : "bg-gray-100 text-[#6b7280] border-2 border-gray-200"
                      }`}
                    >
                      {currentStep > step ? <CheckCircle size={14} /> : step}
                    </div>
                    {step < totalSteps && (
                      <div
                        className={`w-6 h-1 mx-2 rounded-full transition-all duration-300 ${
                          currentStep > step ? "bg-gradient-to-r from-[#ffc232] to-[#ff7220]" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Compact Mobile Features */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                {features.slice(0, 2).map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg rounded-xl p-3"
                  >
                    <div
                      className={`w-6 h-6 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-2 shadow-lg`}
                    >
                      <feature.icon className="w-3 h-3 text-white" />
                    </div>
                    <h3 className="text-xs font-bold text-[#232013] mb-1">{feature.title}</h3>
                    <p className="text-xs text-[#6b7280] leading-tight">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Mobile Registration Form */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-[#232013] mb-1">
                    Step {currentStep} of {totalSteps}
                  </h2>
                  <p className="text-[#6b7280] text-sm">
                    {currentStep === 1 && "Personal Information"}
                    {currentStep === 2 && "Create Password"}
                  </p>
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
                  {/* Step 1: Basic Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-[#232013] block mb-1">Full Name</label>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          className="h-11 bg-[#f8f6f0]/80 border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl text-sm"
                          {...register("name", {
                            required: "Name is required",
                            minLength: {
                              value: 2,
                              message: "Name must be at least 2 characters",
                            },
                          })}
                          error={errors.name?.message}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-[#232013] block mb-1">Email Address</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
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
                    </div>
                  )}

                  {/* Step 2: Password */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-[#232013] block mb-1">Password</label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="h-11 bg-[#f8f6f0]/80 border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl pr-10 text-sm"
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                              },
                              validate: {
                                hasUpperCase: (value) =>
                                  /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                                hasLowerCase: (value) =>
                                  /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
                                hasNumber: (value) =>
                                  /[0-9]/.test(value) || "Password must contain at least one number",
                                hasSpecialChar: (value) =>
                                  /[^A-Za-z0-9]/.test(value) || "Password must contain at least one special character",
                              },
                            })}
                            error={errors.password?.message}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ffc232] transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {password && (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-[#6b7280]">{passwordStrength.label}</span>
                            </div>
                            <div className="text-xs space-y-1">
                              {passwordStrength.requirements.map((req, index) => (
                                <div
                                  key={index}
                                  className={`${req.startsWith("✓") ? "text-green-600" : "text-gray-500"}`}
                                >
                                  {req}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-[#232013] block mb-1">Confirm Password</label>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="h-11 bg-[#f8f6f0]/80 border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl pr-10 text-sm"
                            {...register("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) => value === password || "Passwords do not match",
                            })}
                            error={errors.confirmPassword?.message}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ffc232] transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation Buttons */}
                  <div className="flex gap-3 pt-4">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="flex-1 h-11 border-[#e2e8f0] text-[#232013] hover:bg-[#f8f6f0] rounded-xl text-sm"
                      >
                        <ArrowLeft size={14} className="mr-2" />
                        Back
                      </Button>
                    )}

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 h-11 bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-semibold rounded-xl text-sm"
                      >
                        Continue
                        <ArrowRight size={14} className="ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 h-11 bg-gradient-to-r from-[#232013] to-[#3a3426] hover:from-[#3a3426] hover:to-[#232013] text-white font-semibold rounded-xl text-sm"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            Complete Registration
                            <ArrowRight size={14} className="ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>

                <div className="mt-4 pt-4 border-t border-slate-200/50 text-center">
                  <p className="text-[#6b7280] text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-[#805117] hover:text-[#ffc232] transition-colors">
                      Sign in
                    </Link>
                  </p>
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
                    Join thousands of teams making better decisions together
                  </h2>
                  <p className="text-[#6b7280] text-lg leading-relaxed max-w-lg">
                    Create your account and start making collaborative decisions with your team in minutes.
                  </p>
                </div>

                {/* Compact Features Grid with Glassmorphism */}
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-4 transform hover:scale-105 transition-all duration-300"
                      >
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}
                        >
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-[#232013] mb-1">{feature.title}</h3>
                        <p className="text-xs text-[#6b7280] leading-tight">{feature.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                    <Vote className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Clean White Registration Form */}
            <div className="bg-white flex flex-col justify-center p-8 xl:p-12 min-h-full">
              <div className="max-w-sm mx-auto w-full">
                {/* Form Header */}
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold text-[#232013] mb-2">Create your account</h3>
                  <p className="text-[#6b7280] text-sm">
                    Step {currentStep} of {totalSteps} - Let's get you started
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-6">
                  {[1, 2].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                          currentStep >= step
                            ? "bg-gradient-to-r from-[#ffc232] to-[#ff7220] text-white shadow-lg"
                            : "bg-gray-100 text-[#6b7280] border-2 border-gray-200"
                        }`}
                      >
                        {currentStep > step ? <CheckCircle size={16} /> : step}
                      </div>
                      {step < totalSteps && (
                        <div
                          className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
                            currentStep > step ? "bg-gradient-to-r from-[#ffc232] to-[#ff7220]" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
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
                  {/* Step 1: Basic Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-[#232013] mb-3">Personal Information</h4>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-[#232013] block">Full Name</label>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          className="h-11 bg-[#f8f6f0]/80 border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl text-sm"
                          {...register("name", {
                            required: "Name is required",
                            minLength: {
                              value: 2,
                              message: "Name must be at least 2 characters",
                            },
                          })}
                          error={errors.name?.message}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-[#232013] block">Email Address</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
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
                    </div>
                  )}

                  {/* Step 2: Password */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-[#232013] mb-3">Create Password</h4>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-[#232013] block">Password</label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="h-11 bg-[#f8f6f0]/80 border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl pr-10 text-sm"
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                              },
                              validate: {
                                hasUpperCase: (value) =>
                                  /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                                hasLowerCase: (value) =>
                                  /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
                                hasNumber: (value) =>
                                  /[0-9]/.test(value) || "Password must contain at least one number",
                                hasSpecialChar: (value) =>
                                  /[^A-Za-z0-9]/.test(value) || "Password must contain at least one special character",
                              },
                            })}
                            error={errors.password?.message}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ffc232] transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {password && (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-[#6b7280]">{passwordStrength.label}</span>
                            </div>
                            <div className="text-xs space-y-1">
                              {passwordStrength.requirements.map((req, index) => (
                                <div
                                  key={index}
                                  className={`${req.startsWith("✓") ? "text-green-600" : "text-gray-500"}`}
                                >
                                  {req}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-[#232013] block">Confirm Password</label>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="h-11 bg-[#f8f6f0]/80 border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-xl pr-10 text-sm"
                            {...register("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) => value === password || "Passwords do not match",
                            })}
                            error={errors.confirmPassword?.message}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ffc232] transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-4">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="flex-1 h-11 border-[#e2e8f0] text-[#232013] hover:bg-[#f8f6f0] rounded-xl text-sm"
                      >
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                      </Button>
                    )}

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 h-11 bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-semibold rounded-xl text-sm"
                      >
                        Continue
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 h-11 bg-gradient-to-r from-[#232013] to-[#3a3426] hover:from-[#3a3426] hover:to-[#232013] text-white font-semibold rounded-xl text-sm"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Sign Up
                            <ArrowRight size={16} className="ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>

                <div className="mt-5 pt-4 border-t border-slate-200/50">
                  <p className="text-center text-[#6b7280] text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-[#805117] hover:text-[#ffc232] transition-colors">
                      Sign in
                    </Link>
                  </p>
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

export default RegisterPage
