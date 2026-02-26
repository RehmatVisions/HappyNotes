const NotesView = ({ notes, onEdit, onDelete, onTogglePin, onArchive, onDuplicate, viewTitle = 'All Notes', emptyMessage = 'No notes yet', emptyIcon = '📝' }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ff9a9e] via-[#fad0c4] to-[#ffeaa7] bg-clip-text text-transparent">
          {viewTitle} ({notes.length})
        </h2>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          <button className="px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-br from-[#a8d8ea] to-[#c7ceea] rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-[#5a4a3a] transition-all hover:scale-105 whitespace-nowrap"
            style={{
              boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.5)'
            }}>
            All
          </button>
          <button className="px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold text-[#8b7355] transition-all hover:scale-105 whitespace-nowrap"
            style={{
              boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8)'
            }}>
            📌 Pinned
          </button>
          <button className="px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold text-[#8b7355] transition-all hover:scale-105 whitespace-nowrap"
            style={{
              boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8)'
            }}>
            🕐 Recent
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 md:py-20 animate-fadeIn">
          <div className="text-5xl md:text-6xl mb-4">{emptyIcon}</div>
          <h3 className="text-xl md:text-2xl font-bold text-[#5a4a3a] mb-2">{emptyMessage}</h3>
          <p className="text-sm md:text-base text-[#8b7355]">
            {viewTitle === 'Favorites' ? 'Pin notes to add them to favorites' : 'Click the + button to create your first note'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {notes.map((note, index) => {
            const gradients = [
              'from-[#a8d8ea] to-[#c7ceea]',
              'from-[#ffd4d4] to-[#ffb3ba]',
              'from-[#a8e6cf] to-[#dcedc1]',
              'from-[#ffeaa7] to-[#fdcb6e]',
              'from-[#dfe6e9] to-[#b2bec3]',
              'from-[#fad0c4] to-[#ffd1ff]'
            ]
            const gradient = gradients[index % gradients.length]
            
            return (
              <div
                key={note.id}
                className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 hover:scale-105 transition-all duration-300 cursor-pointer group animate-noteAppear relative overflow-hidden hover-lift ${
                  note.pinned ? 'ring-2 ring-[#ffd4d4] ring-offset-2' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.15), -8px -8px 24px rgba(255, 255, 255, 0.9), inset 2px 2px 6px rgba(255, 255, 255, 0.6)'
                }}
              >
                {/* Pin indicator */}
                {note.pinned && (
                  <div className="absolute top-3 right-3 text-xl">
                    📌
                  </div>
                )}

                <div className="relative z-10" onClick={() => onEdit(note)}>
                  <h3 className="text-base md:text-lg font-bold text-[#5a4a3a] mb-2 line-clamp-1 group-hover:scale-105 transition-transform duration-300 pr-8">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <p className="text-xs md:text-sm text-[#6a5a4a] mb-3 md:mb-4 line-clamp-3">
                    {note.content || 'No content'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#8b7355] font-medium">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    <span className="group-hover:scale-110 transition-transform">{note.content?.split(/\s+/).filter(w => w).length || 0} words</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#8b7355]/20 relative z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onTogglePin(note.id)
                    }}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-white/40 hover:bg-white/60 transition-all text-xs font-semibold text-[#5a4a3a] hover:scale-105 active:scale-95"
                    title={note.pinned ? 'Unpin' : 'Pin'}
                  >
                    {note.pinned ? '📌' : '📍'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDuplicate(note)
                    }}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-white/40 hover:bg-white/60 transition-all text-xs font-semibold text-[#5a4a3a] hover:scale-105 active:scale-95"
                    title="Duplicate"
                  >
                    📋
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onArchive(note.id)
                    }}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-white/40 hover:bg-white/60 transition-all text-xs font-semibold text-[#5a4a3a] hover:scale-105 active:scale-95"
                    title="Archive"
                  >
                    📦
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(note.id)
                    }}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-[#ffb3ba]/40 hover:bg-[#ffb3ba]/60 transition-all text-xs font-semibold text-[#5a4a3a] hover:scale-105 active:scale-95"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl md:rounded-3xl" />
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default NotesView
