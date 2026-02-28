import { useState, useEffect } from 'react'

const NotificationCenter = ({ notifications, onClearAll, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] hover:from-[#a8e6cf] hover:to-[#dcedc1] transition-all flex items-center justify-center hover:scale-105 active:scale-95"
        style={{
          boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.7)'
        }}
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#ff9a9e] to-[#fad0c4] rounded-full text-white text-xs font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-80 max-h-96 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden z-50 animate-slideDown"
            style={{
              boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.9)'
            }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#e8dcc8]/50">
              <h3 className="font-bold text-[#5a4a3a]">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-xs text-[#8b7355] hover:text-[#5a4a3a] font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#a89580]">
                  <div className="text-4xl mb-2">🔕</div>
                  <div className="text-sm">No notifications</div>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-[#e8dcc8]/30 hover:bg-[#fef9f3]/50 transition-colors ${
                      !notification.read ? 'bg-[#ffeaa7]/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{notification.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#5a4a3a] text-sm">
                          {notification.title}
                        </div>
                        <div className="text-xs text-[#8b7355] mt-1">
                          {notification.message}
                        </div>
                        <div className="text-xs text-[#a89580] mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(notification.id)}
                        className="text-[#a89580] hover:text-[#5a4a3a] transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationCenter
