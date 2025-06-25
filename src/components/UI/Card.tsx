import type React from "react"
import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  variant?: "default" | "elevated" | "outlined" | "gradient"
}

const Card: React.FC<CardProps> = ({ children, className = "", hover = false, variant = "default" }) => {
  const baseClasses = `
    rounded-xl p-6 transition-all duration-200
    ${hover ? "hover:shadow-lg hover:-translate-y-1" : ""}
  `

  const variantClasses = {
    default: "bg-white shadow-sm border border-[#232013]/10",
    elevated: "bg-white shadow-lg border border-[#232013]/5",
    outlined: "bg-[#f1efdf]/50 border-2 border-[#ffc232]/30",
    gradient: "bg-gradient-to-br from-[#f1efdf] to-white border border-[#ffc232]/20 shadow-md",
  }

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</div>
}

export default Card
