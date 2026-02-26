const ArchiveView = ({ notes, onRestore, onDelete }) => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ff9a9e] via-[#fad0c4] to-[#ffeaa7] bg-clip-text text-transparent mb-4 md:mb-6">
        Archived Notes ({notes.length})
      </h2>
      
      {notes.length === 0 ? (
        <div className="text-center py-12 md:py-20 animate-fadeIn">
          <div className="text-5xl md:text-6xl mb-4">📦</div>
          <h3 className="text-xl md:text-2xl font-bold text-[#5a4a3a] mb-2">No archived notes</h3>
          <p className="text-sm md:text-base text-[#8b7355]">Your archived notes will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {notes.map((note, index) => (
            <div
              key={note.id}
              className="bg-gradient-to-br from-[#dfe6e9] to-[#b2bec3] backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all duration-300 group animate-noteAppear relative overflow-hidden hover-lift"
              style={{ 
                animationDelay: `${index * 50}ms`,
                boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.15), -8px -8px 24px rgba(255, 255, 255, 0.9), inset 2px 2px 6px rgba(255, 255, 255, 0.6)'
              }}
            >
              <div className="relative z-10">
                <h3 className="text-base md:text-lg font-bold text-[#5a4a3a] mb-2 line-clamp-1">
                  {note.title || 'Untitled Note'}
                </h3>
                <p className="text-xs md:text-sm text-[#6a5a4a] mb-3 md:mb-4 line-clamp-3 opacity-70">
                  {note.content || 'No content'}
                </p>
                <div className="flex items-center justify-between text-xs text-[#8b7355] font-medium mb-4">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  <span>{note.content?.split(/\s+/).filter(w => w).length || 0} words</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRestore(note.id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] hover:scale-105 active:scale-95 transition-all text-xs font-bold text-[#5a4a3a]"
                    style={{
                      boxShadow: '3px 3px 8px rgba(139, 115, 85, 0.15), -3px -3px 8px rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    ↩️ Restore
                  </button>
                  <button
                    onClick={() => onDelete(note.id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-br from-[#ffb3ba] to-[#ffd4d4] hover:scale-105 active:scale-95 transition-all text-xs font-bold text-[#5a4a3a]"
                    style={{
                      boxShadow: '3px 3px 8px rgba(139, 115, 85, 0.15), -3px -3px 8px rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ArchiveView
