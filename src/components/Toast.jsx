import { useEffect } from 'react'

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
    created: '✨',
    updated: '✏️',
    deleted: '🗑️',
    pinned: '⭐',
    archived: '📦',
    restored: '♻️'
  }

  const colors = {
    success: 'from-[#a8e6cf] to-[#dcedc1]',
    error: 'from-[#ffb3ba] to-[#ffd4d4]',
    info: 'from-[#a8d8ea] to-[#c7ceea]',
    warning: 'from-[#ffeaa7] to-[#ffd4d4]',
    created: 'from-[#a8e6cf] to-[#dcedc1]',
    updated: 'from-[#a8d8ea] to-[#c7ceea]',
    deleted: 'from-[#ffb3ba] to-[#ffd4d4]',
    pinned: 'from-[#ffeaa7] to-[#ffd4d4]',
    archived: 'from-[#c7ceea] to-[#a8d8ea]',
    restored: 'from-[#a8e6cf] to-[#dcedc1]'
  }

  return (
    <div 
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r ${colors[type]} text-[#5a4a3a] font-semibold shadow-lg animate-slideInRight`}
      style={{
        boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.2), -4px -4px 16px rgba(255, 255, 255, 0.8)'
      }}
    >
      <span className="text-2xl">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-[#8b7355] hover:text-[#5a4a3a] transition-colors text-xl"
      >
        ✕
      </button>
    </div>
  )
}

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 right-6 z-[100] space-y-3 max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default ToastContainer
