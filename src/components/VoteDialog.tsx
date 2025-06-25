import type React from "react"
import { X, AlertTriangle, CheckCircle } from "lucide-react"

interface VoteDialogProps {
  isOpen: boolean
  onClose: () => void
  type: "already-voted" | "confirm-vote" | "error"
  title: string
  message: string
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
}

const VoteDialog: React.FC<VoteDialogProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case "already-voted":
        return <CheckCircle className="dialog-icon voted" />
      case "error":
        return <AlertTriangle className="dialog-icon error" />
      case "confirm-vote":
        return <AlertTriangle className="dialog-icon warning" />
      default:
        return <AlertTriangle className="dialog-icon" />
    }
  }

  const getDialogClass = () => {
    switch (type) {
      case "already-voted":
        return "vote-dialog voted"
      case "error":
        return "vote-dialog error"
      case "confirm-vote":
        return "vote-dialog confirm"
      default:
        return "vote-dialog"
    }
  }

  return (
    <div className="dialog-overlay">
      <div className={getDialogClass()}>
        <div className="dialog-header">
          <div className="dialog-icon-container">{getIcon()}</div>
          <button onClick={onClose} className="dialog-close">
            <X className="close-icon" />
          </button>
        </div>

        <div className="dialog-content">
          <h3 className="dialog-title">{title}</h3>
          <p className="dialog-message">{message}</p>
        </div>

        <div className="dialog-actions">
          {onConfirm ? (
            <>
              <button onClick={onClose} className="dialog-btn secondary">
                {cancelText}
              </button>
              <button onClick={onConfirm} className="dialog-btn primary">
                {confirmText}
              </button>
            </>
          ) : (
            <button onClick={onClose} className="dialog-btn primary">
              Understood
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .vote-dialog {
          background: white;
          border-radius: 24px;
          padding: 32px;
          max-width: 480px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 3px solid #FF8C42;
          position: relative;
          animation: dialogSlideIn 0.3s ease-out;
        }

        .vote-dialog.voted {
          border-color: #22c55e;
        }

        .vote-dialog.error {
          border-color: #ef4444;
        }

        .vote-dialog.confirm {
          border-color: #3b82f6;
        }

        .dialog-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .dialog-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, #FF6B35, #FF8C42);
          box-shadow: 0 8px 32px rgba(255, 107, 53, 0.4);
        }

        .vote-dialog.voted .dialog-icon-container {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4);
        }

        .vote-dialog.error .dialog-icon-container {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4);
        }

        .vote-dialog.confirm .dialog-icon-container {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
        }

        .dialog-icon {
          width: 28px;
          height: 28px;
          color: white;
        }

        .dialog-close {
          background: rgba(107, 78, 61, 0.1);
          border: none;
          border-radius: 12px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dialog-close:hover {
          background: rgba(107, 78, 61, 0.2);
        }

        .close-icon {
          width: 20px;
          height: 20px;
          color: #6B4E3D;
        }

        .dialog-content {
          text-align: center;
          margin-bottom: 32px;
        }

        .dialog-title {
          font-size: 24px;
          font-weight: 800;
          color: #4A3728;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .dialog-message {
          font-size: 16px;
          color: #6B4E3D;
          line-height: 1.6;
          margin: 0;
        }

        .dialog-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .dialog-btn {
          padding: 12px 24px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          min-width: 120px;
        }

        .dialog-btn.primary {
          background: linear-gradient(135deg, #FF6B35, #FF8C42);
          color: white;
          box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
        }

        .vote-dialog.voted .dialog-btn.primary {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
        }

        .vote-dialog.error .dialog-btn.primary {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
        }

        .vote-dialog.confirm .dialog-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
        }

        .dialog-btn.secondary {
          background: #E8DDD4;
          color: #6B4E3D;
          border: 2px solid #FF9F7A;
        }

        .dialog-btn:hover {
          transform: translateY(-2px);
        }

        .dialog-btn.primary:hover {
          box-shadow: 0 8px 32px rgba(255, 107, 53, 0.4);
        }

        .vote-dialog.voted .dialog-btn.primary:hover {
          box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4);
        }

        .vote-dialog.error .dialog-btn.primary:hover {
          box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4);
        }

        .vote-dialog.confirm .dialog-btn.primary:hover {
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
        }

        .dialog-btn.secondary:hover {
          background: #F5F1EB;
          border-color: #FF8C42;
        }

        @keyframes dialogSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .vote-dialog {
            padding: 24px;
            margin: 16px;
          }

          .dialog-title {
            font-size: 20px;
          }

          .dialog-message {
            font-size: 14px;
          }

          .dialog-actions {
            flex-direction: column;
          }

          .dialog-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default VoteDialog
