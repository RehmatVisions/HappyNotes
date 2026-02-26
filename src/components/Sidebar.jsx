const Sidebar = ({ activeView, setActiveView, collapsed, setCollapsed, notesCount }) => {
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', color: 'from-[#a8d8ea] to-[#c7ceea]' },
    { id: 'notes', icon: '📝', label: 'All Notes', badge: notesCount, color: 'from-[#ffd4d4] to-[#ffb3ba]' },
    { id: 'favorites', icon: '⭐', label: 'Favorites', color: 'from-[#ffeaa7] to-[#fdcb6e]' },
    { id: 'reports', icon: '📈', label: 'Reports', color: 'from-[#a8e6cf] to-[#dcedc1]' },
    { id: 'archive', icon: '📦', label: 'Archive', color: 'from-[#dfe6e9] to-[#b2bec3]' },
    { id: 'trash', icon: '🗑️', label: 'Trash', color: 'from-[#ffb3ba] to-[#ffd4d4]' },
  ]

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-[#fef9f3]/80 backdrop-blur-xl border-r border-[#e8dcc8]/50 p-4 md:p-6 flex flex-col gap-6 md:gap-8 transition-all duration-300 sticky top-0 h-screen overflow-y-auto relative z-20 hidden md:flex`}
      style={{
        boxShadow: '8px 0 24px rgba(0, 0, 0, 0.03), inset -1px 0 0 rgba(255, 255, 255, 0.5)'
      }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-2xl md:text-3xl drop-shadow-sm">📝</div>
          {!collapsed && (
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#ff9a9e] via-[#fad0c4] to-[#ffeaa7] bg-clip-text text-transparent">
              NotesHub
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] flex items-center justify-center transition-all hover:scale-105 text-[#8b7355]"
          style={{
            boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.5)'
          }}
        >
          ☰
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 md:gap-3">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 md:py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden animate-slideRight ${
              activeView === item.id
                ? 'scale-105 hover:scale-110'
                : 'hover:scale-105 hover:translate-x-1'
            }`}
            style={
              activeView === item.id
                ? {
                    background: `linear-gradient(135deg, ${item.color.includes('a8d8ea') ? '#a8d8ea' : item.color.includes('ffd4d4') ? '#ffd4d4' : item.color.includes('a8e6cf') ? '#a8e6cf' : item.color.includes('ffeaa7') ? '#ffeaa7' : '#dfe6e9'}, ${item.color.includes('c7ceea') ? '#c7ceea' : item.color.includes('ffb3ba') ? '#ffb3ba' : item.color.includes('dcedc1') ? '#dcedc1' : item.color.includes('fdcb6e') ? '#fdcb6e' : '#b2bec3'})`,
                    boxShadow: '6px 6px 16px rgba(139, 115, 85, 0.2), -6px -6px 16px rgba(255, 255, 255, 0.8), inset 2px 2px 4px rgba(255, 255, 255, 0.5)',
                    color: '#5a4a3a',
                    animationDelay: `${index * 0.1}s`
                  }
                : {
                    background: 'linear-gradient(135deg, #fef9f3, #f5e6d3)',
                    boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.1), -4px -4px 12px rgba(255, 255, 255, 0.9)',
                    color: '#8b7355',
                    animationDelay: `${index * 0.1}s`
                  }
            }
          >
            <span className={`text-lg md:text-xl relative z-10 drop-shadow-sm transition-all duration-300 ${
              activeView === item.id ? '' : 'group-hover:scale-110'
            }`}>{item.icon}</span>
            {!collapsed && (
              <>
                <span className="flex-1 text-left text-sm md:text-base font-semibold relative z-10">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-xl text-xs font-bold relative z-10 bg-white/60 backdrop-blur-sm animate-pulse-glow"
                    style={{
                      boxShadow: 'inset 2px 2px 4px rgba(139, 115, 85, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.5)'
                    }}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
