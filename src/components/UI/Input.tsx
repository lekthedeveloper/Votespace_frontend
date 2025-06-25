import { type InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: "default" | "filled"
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, variant = "default", className = "", ...props }, ref) => {
    const inputClasses = {
      default: `
        w-full px-3 py-2 border rounded-lg shadow-sm
        focus:outline-none focus:ring-2 focus:ring-[#ffc232]/50 focus:border-[#ffc232]
        disabled:bg-[#f1efdf] disabled:cursor-not-allowed
        transition-all duration-200
        ${error ? "border-[#ff7220] focus:ring-[#ff7220]/50 focus:border-[#ff7220]" : "border-[#232013]/20"}
      `,
      filled: `
        w-full px-3 py-2 rounded-lg shadow-sm
        bg-[#f1efdf] border border-[#232013]/10
        focus:outline-none focus:ring-2 focus:ring-[#ffc232]/50 focus:border-[#ffc232] focus:bg-white
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${error ? "border-[#ff7220] focus:ring-[#ff7220]/50 focus:border-[#ff7220]" : ""}
      `,
    }

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-[#232013] mb-1">{label}</label>}
        <input ref={ref} className={`${inputClasses[variant]} ${className}`} {...props} />
        {error && (
          <p className="mt-1 text-sm text-[#ff7220] flex items-center">
            <span className="inline-block w-1 h-1 bg-[#ff7220] rounded-full mr-1"></span>
            {error}
          </p>
        )}
        {helperText && !error && <p className="mt-1 text-sm text-[#232013]/60">{helperText}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"

export default Input
