import type { Toast } from '../types'

interface ToastContainerProps {
  toasts: Toast[]
  onRemoveToast: (id: string) => void
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  return (
    <div className="toast toast-top toast-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert ${
            toast.type === 'success' ? 'alert-success' :
            toast.type === 'error' ? 'alert-error' :
            toast.type === 'warning' ? 'alert-warning' :
            'alert-info'
          }`}
        >
          <span>{toast.message}</span>
          <button 
            onClick={() => onRemoveToast(toast.id)}
            className="btn btn-ghost btn-xs"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}