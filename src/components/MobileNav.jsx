const MobileNav = ({ activeView, setActiveView, notesCount }) => {
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Home' },
    { id: 'notes', icon: '📝', label: 'Notes', badge: notesCount },
    { id: 'favorites', icon: '⭐', label: 'Favorites' },
    { id: 'reports', icon: '📈', label: 'Reports' },
    { id: 'trash', icon: '🗑️', label: 'Trash' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#fef9f3]/95 backdrop-blur-xl border-t border-[#e8dcc8]/50 z-50 pb-safe animate-slideUp"
      style={{
        boxShadow: '0 -8px 24px rgba(139, 115, 85, 0.12)'
      }}>
      <div className="flex items-center justify-around px-2 py-2.5">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 relative ${
              activeView === item.id
                ? 'scale-110'
                : 'scale-100 opacity-70 hover:scale-105 hover:opacity-100'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className={`text-xl relative transition-transform duration-300 ${
              activeView === item.id ? '' : ''
            }`}>
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#ffd4d4] to-[#ffb3ba] rounded-full text-[8px] font-bold text-[#5a4a3a] flex items-center justify-center animate-pulse-glow"
                  style={{
                    boxShadow: '2px 2px 6px rgba(139, 115, 85, 0.2)'
                  }}>
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </span>
            <span className={`text-[10px] font-semibold transition-all duration-300 ${
              activeView === item.id ? 'text-[#5a4a3a]' : 'text-[#8b7355]'
            }`}>
              {item.label}
            </span>
            {activeView === item.id && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-[#ffd4d4] to-[#a8e6cf] animate-scale-pulse" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav
