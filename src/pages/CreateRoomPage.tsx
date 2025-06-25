import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { ArrowLeft, Plus, X, Calendar, Users, Settings, Sparkles } from "lucide-react"

interface CreateRoomForm {
  title: string
  description: string
  options: { value: string }[]
  isAnonymous: boolean
  allowMultipleVotes: boolean
  endDate?: string
}

const CreateRoomPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateRoomForm>({
    defaultValues: {
      title: "",
      description: "",
      options: [{ value: "" }, { value: "" }],
      isAnonymous: true,
      allowMultipleVotes: false,
      endDate: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  })

  const onSubmit = async (data: CreateRoomForm) => {
    setIsLoading(true)
    setError("")

    try {
      // Filter out empty options and format the data
      const filteredOptions = data.options.map((option) => option.value.trim()).filter((option) => option.length > 0)

      if (filteredOptions.length < 2) {
        setError("Please provide at least 2 options for voting")
        setIsLoading(false)
        return
      }

      const roomData = {
        title: data.title.trim(),
        description: data.description.trim(),
        options: filteredOptions,
        isAnonymous: data.isAnonymous,
        allowMultipleVotes: data.allowMultipleVotes,
        ...(data.endDate && { endDate: new Date(data.endDate).toISOString() }),
      }

      console.log("Creating room with data:", roomData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to dashboard or room page
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room")
    } finally {
      setIsLoading(false)
    }
  }

  const addOption = () => {
    append({ value: "" })
  }

  const removeOption = (index: number) => {
    if (fields.length > 2) {
      remove(index)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1efdf] via-[#f8f6f0] to-[#f1efdf] relative overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-white/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-[#232013]">Create Room</h1>
          <div className="w-10 h-10"></div> {/* Spacer */}
        </div>
      </div>

      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:block sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-white/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-xl font-bold text-[#232013]">Create New Room</h1>
          <div></div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-10 md:-left-20 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-r from-[#ffc232]/10 to-[#ff7220]/10 rounded-full blur-2xl md:blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-10 md:-right-20 w-24 md:w-40 h-24 md:h-40 bg-gradient-to-r from-[#646B47]/10 to-[#b2d57a]/10 rounded-full blur-2xl md:blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 md:pt-12">
        {/* Hero Section - Desktop */}
        <div className="hidden md:block text-center mb-8 lg:mb-12">
          <div className="w-16 lg:w-20 h-16 lg:h-20 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-xl">
            <Sparkles className="w-8 lg:w-10 h-8 lg:h-10 text-white" />
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-[#232013] mb-3 lg:mb-4 leading-tight">Create Decision Room</h2>
          <p className="text-[#6b7280] text-base lg:text-lg max-w-2xl mx-auto">
            Set up a collaborative space where your team can vote on ideas and make decisions together
          </p>
        </div>

        {/* Hero Section - Mobile */}
        <div className="md:hidden text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#232013] mb-2 leading-tight">Create Decision Room</h2>
          <p className="text-[#6b7280] text-sm px-4">
            Set up a space for collaborative voting and decision making
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-10">
            {error && (
              <div className="p-3 md:p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl md:rounded-2xl">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-4 md:w-5 h-4 md:h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 md:w-6 h-5 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#232013]">Basic Information</h3>
                  <p className="text-sm md:text-base text-[#6b7280] hidden md:block">Give your decision room a clear title and description</p>
                  <p className="text-xs text-[#6b7280] md:hidden">Add title and description</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#232013] block mb-2">Room Title</label>
                  <input
                    placeholder="e.g., Team Meeting Ideas"
                    className="w-full h-12 md:h-14 px-3 md:px-4 text-[#232013] bg-[#f8f6f0]/80 backdrop-blur-sm border border-[#e2e8f0] focus:border-[#ffc232] focus:ring-4 focus:ring-[#ffc232]/20 rounded-xl md:rounded-2xl transition-all duration-200 outline-none placeholder:text-slate-400 text-sm md:text-base"
                    {...register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 3,
                        message: "Title must be at least 3 characters",
                      },
                      maxLength: {
                        value: 100,
                        message: "Title must be less than 100 characters",
                      },
                    })}
                  />
                  {errors.title && <p className="text-red-600 text-xs md:text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#232013] block mb-2">Description</label>
                  <textarea
                    placeholder="Describe what this room is for..."
                    className="w-full px-3 md:px-4 py-3 text-[#232013] bg-[#f8f6f0]/80 backdrop-blur-sm border border-[#e2e8f0] focus:border-[#ffc232] focus:ring-4 focus:ring-[#ffc232]/20 rounded-xl md:rounded-2xl transition-all duration-200 outline-none placeholder:text-slate-400 text-sm md:text-base resize-none"
                    rows={3}
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "Description must be at least 10 characters",
                      },
                      maxLength: {
                        value: 500,
                        message: "Description must be less than 500 characters",
                      },
                    })}
                  />
                  {errors.description && <p className="text-red-600 text-xs md:text-sm mt-1">{errors.description.message}</p>}
                </div>
              </div>
            </div>

            {/* Voting Options */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-[#646B47] to-[#b2d57a] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 md:w-6 h-5 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#232013]">Voting Options</h3>
                  <p className="text-sm md:text-base text-[#6b7280] hidden md:block">Add the choices that people can vote on</p>
                  <p className="text-xs text-[#6b7280] md:hidden">Add voting choices</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 md:gap-4 p-3 md:p-4 bg-[#f8f6f0]/50 backdrop-blur-sm border border-[#e2e8f0] rounded-xl md:rounded-2xl"
                  >
                    <div className="w-7 md:w-8 h-7 md:h-8 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-lg md:rounded-xl flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg flex-shrink-0">
                      {index + 1}
                    </div>
                    <input
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 h-10 md:h-12 px-3 md:px-4 text-[#232013] bg-white/80 backdrop-blur-sm border border-[#e2e8f0] focus:border-[#ffc232] focus:ring-2 focus:ring-[#ffc232]/20 rounded-lg md:rounded-xl transition-all duration-200 outline-none placeholder:text-slate-400 text-sm md:text-base"
                      {...register(`options.${index}.value`, {
                        required: index < 2 ? "This option is required" : false,
                        minLength: {
                          value: 1,
                          message: "Option cannot be empty",
                        },
                        maxLength: {
                          value: 100,
                          message: "Option must be less than 100 characters",
                        },
                      })}
                    />
                    {fields.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="w-8 md:w-10 h-8 md:h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0"
                      >
                        <X className="w-4 md:w-5 h-4 md:h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {errors.options && (
                  <p className="text-red-600 text-xs md:text-sm">
                    {errors.options.message || errors.options.find(o => o?.value)?.value?.message}
                  </p>
                )}

                <button
                  type="button"
                  onClick={addOption}
                  disabled={fields.length >= 10}
                  className="w-full h-10 md:h-12 border-2 border-dashed border-[#e2e8f0] hover:border-[#ffc232] text-[#6b7280] hover:text-[#ffc232] rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <Plus className="w-4 md:w-5 h-4 md:h-5" />
                  <span className="text-sm md:text-base">Add Option {fields.length >= 10 && "(Max 10)"}</span>
                </button>
                {fields.length >= 10 && <p className="text-[#6b7280] text-xs md:text-sm text-center">Maximum 10 options allowed</p>}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                  <Settings className="w-5 md:w-6 h-5 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#232013]">Room Settings</h3>
                  <p className="text-sm md:text-base text-[#6b7280] hidden md:block">Configure how voting works in your room</p>
                  <p className="text-xs text-[#6b7280] md:hidden">Configure voting settings</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                <div className="p-4 md:p-6 bg-[#f8f6f0]/50 backdrop-blur-sm border border-[#e2e8f0] rounded-xl md:rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-2">
                        <h4 className="font-bold text-[#232013] text-sm md:text-base">Anonymous Voting</h4>
                        <span className="px-2 py-1 bg-gradient-to-r from-[#ffc232] to-[#ff7220] text-white text-xs font-bold rounded-full w-fit">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-[#6b7280]">Hide voter identities to encourage honest feedback</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-3 md:ml-4">
                      <input
                        type="checkbox"
                        {...register("isAnonymous")}
                        className="sr-only peer"
                      />
                      <div className="w-10 md:w-11 h-5 md:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ffc232]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 md:after:h-5 after:w-4 md:after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#ffc232] peer-checked:to-[#ff7220]"></div>
                    </label>
                  </div>
                </div>

                <div className="p-4 md:p-6 bg-[#f8f6f0]/50 backdrop-blur-sm border border-[#e2e8f0] rounded-xl md:rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-bold text-[#232013] mb-2 text-sm md:text-base">Multiple Votes</h4>
                      <p className="text-xs md:text-sm text-[#6b7280]">Allow users to vote for multiple options</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-3 md:ml-4">
                      <input
                        type="checkbox"
                        {...register("allowMultipleVotes")}
                        className="sr-only peer"
                      />
                      <div className="w-10 md:w-11 h-5 md:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ffc232]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 md:after:h-5 after:w-4 md:after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#ffc232] peer-checked:to-[#ff7220]"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-[#232013] block mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#805117]" />
                  End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  className="w-full h-12 md:h-14 px-3 md:px-4 text-[#232013] bg-[#f8f6f0]/80 backdrop-blur-sm border border-[#e2e8f0] focus:border-[#ffc232] focus:ring-4 focus:ring-[#ffc232]/20 rounded-xl md:rounded-2xl transition-all duration-200 outline-none text-sm md:text-base"
                  {...register("endDate")}
                />
                <p className="text-xs md:text-sm text-[#6b7280] mt-2">
                  Set a deadline for voting, or leave empty for no expiration
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full md:flex-1 h-12 md:h-14 border border-[#e2e8f0] text-[#232013] hover:bg-[#f8f6f0] rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200 text-sm md:text-base font-medium"
              >
                <ArrowLeft className="w-4 md:w-5 h-4 md:h-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:flex-1 h-12 md:h-14 bg-gradient-to-r from-[#ffc232] to-[#ff7220] hover:from-[#ffb000] hover:to-[#e55a00] text-white font-semibold rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 md:w-5 h-4 md:h-5" />
                    Create Room
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateRoomPage