const Dashboard = ({ notes }) => {
  const totalNotes = notes.length
  const totalWords = notes.reduce((sum, note) => {
    return sum + (note.content?.split(/\s+/).filter(w => w.length > 0).length || 0)
  }, 0)
  const pinnedNotes = notes.filter(n => n.pinned).length
  
  // Calculate streak (simplified - days with notes)
  const today = new Date().toDateString()
  const hasNoteToday = notes.some(n => new Date(n.createdAt).toDateString() === today)
  const streak = hasNoteToday ? Math.min(notes.length, 15) : 0

  const stats = [
    { icon: '📝', label: 'Total Notes', value: totalNotes, gradient: 'from-[#a8d8ea] to-[#c7ceea]' },
    { icon: '🔥', label: 'Day Streak', value: streak, gradient: 'from-[#ffd4d4] to-[#ffb3ba]' },
    { icon: '📊', label: 'Total Words', value: totalWords > 1000 ? `${(totalWords / 1000).toFixed(1)}k` : totalWords, gradient: 'from-[#a8e6cf] to-[#dcedc1]' },
    { icon: '⭐', label: 'Pinned', value: pinnedNotes, gradient: 'from-[#ffeaa7] to-[#fdcb6e]' },
  ]

  const recentNotes = notes.slice(0, 5)

  // Generate weekly activity data based on actual notes
  const weeklyData = Array(7).fill(0).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toDateString()
    return notes.filter(n => new Date(n.createdAt).toDateString() === dateStr).length
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {/* Stats Cards */}
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 hover:scale-105 transition-all duration-300 cursor-pointer group animate-slideUp relative overflow-hidden hover-lift`}
          style={{ 
            animationDelay: `${index * 100}ms`,
            boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.15), -8px -8px 24px rgba(255, 255, 255, 0.9), inset 2px 2px 6px rgba(255, 255, 255, 0.6)'
          }}
        >
          <div className="flex items-center gap-3 md:gap-4 relative z-10">
            <div className="text-3xl md:text-4xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#5a4a3a] drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </h3>
              <p className="text-xs md:text-sm text-[#8b7355] font-medium">{stat.label}</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}

      {/* Chart Card */}
      <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 hover:scale-105 transition-all duration-300 animate-slideUp" 
        style={{ 
          animationDelay: '400ms',
          boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
        }}>
        <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-[#5a4a3a]">Weekly Activity</h3>
        <div className="h-48 md:h-64 flex items-end justify-around gap-2 md:gap-3">
          {weeklyData.map((value, i) => {
            const colors = ['#a8d8ea', '#ffd4d4', '#a8e6cf', '#ffeaa7', '#c7ceea', '#ffb3ba', '#dcedc1']
            const maxValue = Math.max(...weeklyData, 1)
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-2xl transition-all hover:scale-105 animate-growUp relative group cursor-pointer"
                  style={{ 
                    height: `${(value / maxValue) * 100}%`,
                    minHeight: value > 0 ? '20px' : '4px',
                    animationDelay: `${i * 100}ms`,
                    background: `linear-gradient(to top, ${colors[i]}, ${colors[i]}dd)`,
                    boxShadow: `4px 4px 12px rgba(139, 115, 85, 0.15), -2px -2px 8px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.5)`
                  }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#5a4a3a] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {value} notes
                  </div>
                </div>
                <span className="text-xs text-[#8b7355] font-medium">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Notes */}
      <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 hover:scale-105 transition-all duration-300 animate-slideUp" 
        style={{ 
          animationDelay: '500ms',
          boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
        }}>
        <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-[#5a4a3a]">Recent Notes</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentNotes.length > 0 ? (
            recentNotes.map((note, i) => (
              <div
                key={note.id}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] rounded-xl md:rounded-2xl hover:translate-x-2 transition-all cursor-pointer animate-slideRight group"
                style={{ 
                  animationDelay: `${i * 100}ms`,
                  boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8), inset 1px 1px 2px rgba(255, 255, 255, 0.5)'
                }}
              >
                <span className="text-xl md:text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">{note.pinned ? '📌' : '💡'}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#5a4a3a] text-sm md:text-base truncate">{note.title || 'Untitled'}</h4>
                  <p className="text-xs text-[#8b7355]">
                    {new Date(note.createdAt).toLocaleDateString()} • {note.content?.split(/\s+/).filter(w => w).length || 0} words
                  </p>
                </div>
                {note.pinned && <span className="text-sm">📌</span>}
              </div>
            ))
          ) : (
            <div className="text-center py-6 md:py-8 text-[#a89580]">
              <div className="text-3xl md:text-4xl mb-2">📝</div>
              <p className="font-medium text-sm md:text-base">No notes yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
