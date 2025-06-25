import type React from "react"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  children: ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5
  `

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#ffc232] to-[#ff7220] text-white hover:from-[#ffb000] hover:to-[#e55a00] focus:ring-[#ffc232]/50 shadow-lg hover:shadow-xl",
    secondary: "bg-[#232013] text-white hover:bg-[#3a3426] focus:ring-[#232013]/50 shadow-md hover:shadow-lg",
    outline: "border-2 border-[#ffc232] text-[#232013] hover:bg-[#ffc232] hover:text-white focus:ring-[#ffc232]/50",
    ghost: "text-[#232013] hover:bg-[#f1efdf] focus:ring-[#ffc232]/30",
    danger: "bg-[#ff7220] text-white hover:bg-[#e55a00] focus:ring-[#ff7220]/50 shadow-md hover:shadow-lg",
    success: "bg-[#b2d57a] text-[#232013] hover:bg-[#9bc95a] focus:ring-[#b2d57a]/50 shadow-md hover:shadow-lg",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export default Button
