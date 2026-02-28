import { memo, useMemo } from 'react'
import AnalogClock from './AnalogClock'

const Dashboard = memo(({ notes }) => {
  const stats = useMemo(() => {
    const totalNotes = notes.length
    const totalWords = notes.reduce((sum, note) => {
      return sum + (note.content?.split(/\s+/).filter(w => w.length > 0).length || 0)
    }, 0)
    const pinnedNotes = notes.filter(n => n.pinned).length
    
    // Calculate streak (simplified - days with notes)
    const today = new Date().toDateString()
    const hasNoteToday = notes.some(n => new Date(n.createdAt).toDateString() === today)
    const streak = hasNoteToday ? Math.min(notes.length, 15) : 0

    return [
      { icon: '📝', label: 'Total Notes', value: totalNotes, gradient: 'from-[#a8d8ea] to-[#c7ceea]' },
      { icon: '🔥', label: 'Day Streak', value: streak, gradient: 'from-[#ffd4d4] to-[#ffb3ba]' },
      { icon: '📊', label: 'Total Words', value: totalWords > 1000 ? `${(totalWords / 1000).toFixed(1)}k` : totalWords, gradient: 'from-[#a8e6cf] to-[#dcedc1]' },
      { icon: '⭐', label: 'Pinned', value: pinnedNotes, gradient: 'from-[#ffeaa7] to-[#fdcb6e]' },
    ]
  }, [notes])

  const recentNotes = useMemo(() => notes.slice(0, 5), [notes])

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

      {/* Real-Time Clock Card */}
      <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 hover:scale-105 transition-all duration-300 animate-slideUp" 
        style={{ 
          animationDelay: '400ms',
          boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
        }}>
        <AnalogClock />
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
})

Dashboard.displayName = 'Dashboard'

export default Dashboard
