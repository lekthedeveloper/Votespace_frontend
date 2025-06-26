"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, Vote, Users, BarChart3, Shield } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Header from "../../components/Layout/Header"

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Simple form state management
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const totalSteps = 2

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("registrationFormData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
      } catch (error) {
        console.error("Error loading saved form data:", error)
        localStorage.removeItem("registrationFormData")
      }
    }
  }, [])

  // Save form data whenever it changes
  useEffect(() => {
    if (formData.name || formData.email || formData.password || formData.confirmPassword) {
      localStorage.setItem("registrationFormData", JSON.stringify(formData))
    }
  }, [formData])

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  // Handle input blur
  const handleInputBlur = (field: keyof FormData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
    validateField(field)
  }

  // Validate individual field
  const validateField = (field: keyof FormData) => {
    const value = formData[field]
    let error = ""

    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required"
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters"
        }
        break

      case "email":
        if (!value.trim()) {
          error = "Email is required"
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = "Please enter a valid email address"
        }
        break

      case "password":
        if (!value) {
          error = "Password is required"
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters"
        }
        break

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password"
        } else if (value !== formData.password) {
          error = "Passwords do not match"
        }
        break
    }

    setFormErrors((prev) => ({
      ...prev,
      [field]: error || undefined,
    }))

    return !error
  }

  // Validate step
  const validateStep = (step: number) => {
    let isValid = true
    const errors: FormErrors = {}

    if (step === 1) {
      // Validate name
      if (!formData.name.trim()) {
        errors.name = "Name is required"
        isValid = false
      } else if (formData.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters"
        isValid = false
      }

      // Validate email
      if (!formData.email.trim()) {
        errors.email = "Email is required"
        isValid = false
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = "Please enter a valid email address"
        isValid = false
      }
    }

    if (step === 2) {
      // Validate password
      if (!formData.password) {
        errors.password = "Password is required"
        isValid = false
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters"
        isValid = false
      }

      // Validate confirm password
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password"
        isValid = false
      } else if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword = "Passwords do not match"
        isValid = false
      }
    }

    setFormErrors(errors)
    return isValid
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(1) || !validateStep(2)) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await registerUser(formData.email, formData.password, formData.name)
      localStorage.removeItem("registrationFormData")
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password)
      return {
        strength: 0,
        label: "",
        color: "",
        percentage: 0,
        requirements: {
          length: false,
          lowercase: false,
          uppercase: false,
          number: false,
          special: false,
          noRepeats: false,
        },
      }

    let strength = 0
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      noRepeats: !/(.)\1{2,}/.test(password),
    }

    if (requirements.length) strength += 1
    if (requirements.lowercase) strength += 1
    if (requirements.uppercase) strength += 1
    if (requirements.number) strength += 1
    if (requirements.special) strength += 1
    if (requirements.noRepeats) strength += 1

    if (password.length >= 12) strength += 1
    if (password.length >= 16) strength += 1

    const commonPatterns = [/123456/, /password/i, /qwerty/i, /abc123/i, /admin/i, /login/i]
    const hasCommonPattern = commonPatterns.some((pattern) => pattern.test(password))
    if (hasCommonPattern) strength = Math.max(0, strength - 2)

    strength = Math.min(strength, 8)

    const configs = [
      { label: "", color: "bg-gray-300", textColor: "text-gray-500", percentage: 0 },
      { label: "Very Weak", color: "bg-red-500", textColor: "text-red-600", percentage: 12.5 },
      { label: "Weak", color: "bg-red-400", textColor: "text-red-500", percentage: 25 },
      { label: "Fair", color: "bg-orange-500", textColor: "text-orange-600", percentage: 37.5 },
      { label: "Good", color: "bg-yellow-500", textColor: "text-yellow-600", percentage: 50 },
      { label: "Strong", color: "bg-lime-500", textColor: "text-lime-600", percentage: 62.5 },
      { label: "Very Strong", color: "bg-green-500", textColor: "text-green-600", percentage: 75 },
      { label: "Excellent", color: "bg-green-600", textColor: "text-green-700", percentage: 87.5 },
      { label: "Maximum", color: "bg-emerald-600", textColor: "text-emerald-700", percentage: 100 },
    ]

    return {
      strength,
      requirements,
      percentage: configs[strength].percentage,
      ...configs[strength],
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

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
      title: "Enterprise Security",
      description: "Bank-level protection",
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Step 1: Basic Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-[#232013] block mb-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          onBlur={() => handleInputBlur("name")}
                          className={`w-full h-11 px-4 bg-[#f8f6f0]/80 border rounded-xl text-sm transition-all duration-200 outline-none placeholder:text-slate-400 ${
                            formErrors.name && touched.name
                              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20"
                          }`}
                        />
                        {formErrors.name && touched.name && (
                          <p className="text-red-600 text-xs mt-1 font-medium">{formErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-[#232013] block mb-1">Email Address</label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          onBlur={() => handleInputBlur("email")}
                          className={`w-full h-11 px-4 bg-[#f8f6f0]/80 border rounded-xl text-sm transition-all duration-200 outline-none placeholder:text-slate-400 ${
                            formErrors.email && touched.email
                              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20"
                          }`}
                        />
                        {formErrors.email && touched.email && (
                          <p className="text-red-600 text-xs mt-1 font-medium">{formErrors.email}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Password */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-[#232013] block mb-1">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            onBlur={() => handleInputBlur("password")}
                            className={`w-full h-11 px-4 pr-10 bg-[#f8f6f0]/80 border rounded-xl text-sm transition-all duration-200 outline-none placeholder:text-slate-400 ${
                              formErrors.password && touched.password
                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ffc232] transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {formErrors.password && touched.password && (
                          <p className="text-red-600 text-xs mt-1 font-medium">{formErrors.password}</p>
                        )}

                        {formData.password && (
                          <div className="mt-3 space-y-2">
                            {/* Strength Bar */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ease-out ${passwordStrength.color}`}
                                  style={{ width: `${passwordStrength.percentage}%` }}
                                ></div>
                              </div>
                              <span className={`text-xs font-semibold ${passwordStrength.textColor} min-w-[70px]`}>
                                {passwordStrength.label}
                              </span>
                            </div>

                            {/* Requirements Checklist */}
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <div
                                className={`flex items-center gap-1 ${passwordStrength.requirements.length ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordStrength.requirements.length ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.length ? "✓" : "○"}
                                </div>
                                <span>8+ chars</span>
                              </div>
                              <div
                                className={`flex items-center gap-1 ${passwordStrength.requirements.uppercase ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordStrength.requirements.uppercase ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.uppercase ? "✓" : "○"}
                                </div>
                                <span>Uppercase</span>
                              </div>
                              <div
                                className={`flex items-center gap-1 ${passwordStrength.requirements.lowercase ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordStrength.requirements.lowercase ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.lowercase ? "✓" : "○"}
                                </div>
                                <span>Lowercase</span>
                              </div>
                              <div
                                className={`flex items-center gap-1 ${passwordStrength.requirements.number ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordStrength.requirements.number ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.number ? "✓" : "○"}
                                </div>
                                <span>Number</span>
                              </div>
                              <div
                                className={`flex items-center gap-1 ${passwordStrength.requirements.special ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordStrength.requirements.special ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.special ? "✓" : "○"}
                                </div>
                                <span>Symbol</span>
                              </div>
                              <div
                                className={`flex items-center gap-1 ${passwordStrength.requirements.noRepeats ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordStrength.requirements.noRepeats ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.noRepeats ? "✓" : "○"}
                                </div>
                                <span>No repeats</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-[#232013] block mb-1">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            onBlur={() => handleInputBlur("confirmPassword")}
                            className={`w-full h-11 px-4 pr-10 bg-[#f8f6f0]/80 border rounded-xl text-sm transition-all duration-200 outline-none placeholder:text-slate-400 ${
                              formErrors.confirmPassword && touched.confirmPassword
                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ffc232] transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {formErrors.confirmPassword && touched.confirmPassword && (
                          <p className="text-red-600 text-xs mt-1 font-medium">{formErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation Buttons */}
                  <div className="flex gap-3 pt-4">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 h-11 border border-[#e2e8f0] text-[#232013] hover:bg-[#f8f6f0] rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <ArrowLeft size={14} />
                        Back
                      </button>
                    )}

                    {currentStep < totalSteps ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1 h-11 bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        Continue
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 h-11 bg-gradient-to-r from-[#232013] to-[#3a3426] hover:from-[#3a3426] hover:to-[#232013] text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
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

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Step 1: Basic Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-[#232013] mb-3">Personal Information</h4>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-[#232013] block">Full Name</label>
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          onBlur={() => handleInputBlur("name")}
                          className={`w-full h-11 px-4 bg-[#f8f6f0]/80 border rounded-xl text-sm transition-all duration-200 outline-none placeholder:text-slate-400 ${
                            formErrors.name && touched.name
                              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20"
                          }`}
                        />
                        {formErrors.name && touched.name && (
                          <p className="text-red-600 text-xs mt-1 font-medium">{formErrors.name}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-[#232013] block">Email Address</label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          onBlur={() => handleInputBlur("email")}
                          className={`w-full h-11 px-4 bg-[#f8f6f0]/80 border rounded-xl text-sm transition-all duration-200 outline-none placeholder:text-slate-400 ${
                            formErrors.email && touched.email
                              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20"
                          }`}
                        />
                        {formErrors.email && touched.email && (
                          <p className="text-red-600 text-xs mt-1 font-medium">{formErrors.email}</p>
                        )}
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
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            onBlur={() => handleInputBlur("password")}
                            className={`w-full h-11 px-4 pr-10 bg-[#f8f6f0]/80 border rounded-xl text-sm transition-all duration-200 outline-none placeholder:text-slate-400 ${
                              formErrors.password && touched.password
                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ffc232] transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {formErrors.password && touched.password && (
                          <p className="text-red-600 text-xs mt-1 font-medium">{formErrors.password}</p>
                        )}

                        {formData.password && (
                          <div className="mt-3 space-y-3">
                            {/* Strength Bar */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className={`h-2.5 rounded-full transition-all duration-500 ease-out ${passwordStrength.color}`}
                                  style={{ width: `${passwordStrength.percentage}%` }}
                                ></div>
                              </div>
                              <span className={`text-sm font-semibold ${passwordStrength.textColor} min-w-[80px]`}>
                                {passwordStrength.label}
                              </span>
                            </div>

                            {/* Requirements Checklist */}
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div
                                className={`flex items-center gap-2 ${passwordStrength.requirements.length ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordStrength.requirements.length ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.length ? "✓" : "○"}
                                </div>
                                <span>8+ characters</span>
                              </div>
                              <div
                                className={`flex items-center gap-2 ${passwordStrength.requirements.uppercase ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordStrength.requirements.uppercase ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.uppercase ? "✓" : "○"}
                                </div>
                                <span>Uppercase</span>
                              </div>
                              <div
                                className={`flex items-center gap-2 ${passwordStrength.requirements.lowercase ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordStrength.requirements.lowercase ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.lowercase ? "✓" : "○"}
                                </div>
                                <span>Lowercase</span>
                              </div>
                              <div
                                className={`flex items-center gap-2 ${passwordStrength.requirements.number ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordStrength.requirements.number ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.number ? "✓" : "○"}
                                </div>
                                <span>Number</span>
                              </div>
                              <div
                                className={`flex items-center gap-2 ${passwordStrength.requirements.special ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordStrength.requirements.special ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.special ? "✓" : "○"}
                                </div>
                                <span>Special character</span>
                              </div>
                              <div
                                className={`flex items-center gap-2 ${passwordStrength.requirements.noRepeats ? "text-green-600" : "text-gray-400"}`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordStrength.requirements.noRepeats ? "bg-green-100" : "bg-gray-100"}`}
                                >
                                  {passwordStrength.requirements.noRepeats ? "✓" : "○"}
                                </div>
                                <span>No repeated chars</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-[#232013] block">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            onBlur={() => handleInputBlur("confirmPassword")}
                            className={`w-full h-11 px-4 pr-10 bg-[#f8f6f0]/80 border rounded-xl text-sm transition-all duration-200 outline-none placeholder:text-slate-400 ${
                              formErrors.confirmPassword && touched.confirmPassword
                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ffc232] transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {formErrors.confirmPassword && touched.confirmPassword && (
                          <p className="text-red-600 text-xs mt-1 font-medium">{formErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-4">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 h-11 border border-[#e2e8f0] text-[#232013] hover:bg-[#f8f6f0] rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <ArrowLeft size={16} />
                        Back
                      </button>
                    )}

                    {currentStep < totalSteps ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1 h-11 bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        Continue
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 h-11 bg-gradient-to-r from-[#232013] to-[#3a3426] hover:from-[#3a3426] hover:to-[#232013] text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
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
