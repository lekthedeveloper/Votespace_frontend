import type React from "react"
import { useState, type FormEvent } from "react"
import { InputSanitizer } from "../../security/InputSanitizer"
import { useRateLimit } from "../../security/RateLimiter"

interface SecureFormProps {
  onSubmit: (data: Record<string, string>) => Promise<void>
  fields: Array<{
    name: string
    type: string
    label: string
    required?: boolean
    validation?: (value: string) => { isValid: boolean; errors: string[] }
  }>
  rateLimitKey: string
  className?: string
}

export const SecureForm: React.FC<SecureFormProps> = ({ onSubmit, fields, rateLimitKey, className = "" }) => {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { checkRateLimit, getRemainingAttempts } = useRateLimit()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Rate limiting check
    if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
      // 5 attempts per 15 minutes
      setErrors({ form: [`Too many attempts. ${getRemainingAttempts(rateLimitKey, 5)} attempts remaining.`] })
      return
    }

    // Validate all fields
    const newErrors: Record<string, string[]> = {}
    const sanitizedData: Record<string, string> = {}

    fields.forEach((field) => {
      const value = formData[field.name] || ""

      // Sanitize input
      sanitizedData[field.name] =
        field.type === "email" ? value.toLowerCase().trim() : InputSanitizer.sanitizeText(value)

      // Validate
      if (field.required && !value) {
        newErrors[field.name] = ["This field is required"]
      } else if (field.validation) {
        const validation = field.validation(value)
        if (!validation.isValid) {
          newErrors[field.name] = validation.errors
        }
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(sanitizedData)
      setFormData({})
      setErrors({})
    } catch (error) {
      setErrors({ form: ["An error occurred. Please try again."] })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
            autoComplete={field.type === "password" ? "current-password" : field.name}
          />
          {errors[field.name] && (
            <div className="mt-1 text-sm text-red-600">
              {errors[field.name].map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>
      ))}

      {errors.form && (
        <div className="text-sm text-red-600">
          {errors.form.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  )
}
