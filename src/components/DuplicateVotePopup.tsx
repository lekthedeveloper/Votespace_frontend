import type React from "react"
import { X, AlertTriangle } from "lucide-react"

interface DuplicateVotePopupProps {
  isVisible: boolean
  message: string
  onClose: () => void
}

const DuplicateVotePopup: React.FC<DuplicateVotePopupProps> = ({ isVisible, message, onClose }) => {
  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        {/* Popup */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Already Voted!</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-[#ffc232] to-[#ff7220] text-white font-semibold rounded-xl hover:from-[#ffb000] hover:to-[#e55a00] transition-all duration-200"
            >
              Got it
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
}

export default DuplicateVotePopup
