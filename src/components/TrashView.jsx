const TrashView = ({ notes, onRestore, onPermanentDelete, onEmptyTrash }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ff9a9e] via-[#fad0c4] to-[#ffeaa7] bg-clip-text text-transparent">
          Trash ({notes.length})
        </h2>
        {notes.length > 0 && (
          <button
            onClick={onEmptyTrash}
            className="px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-br from-[#ffb3ba] to-[#ffd4d4] rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-[#5a4a3a] transition-all hover:scale-105 active:scale-95 animate-pulse-glow"
            style={{
              boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.5)'
            }}
          >
            🗑️ Empty Trash
          </button>
        )}
      </div>
      
      {notes.length === 0 ? (
        <div className="text-center py-12 md:py-20 animate-fadeIn">
          <div className="text-5xl md:text-6xl mb-4">🗑️</div>
          <h3 className="text-xl md:text-2xl font-bold text-[#5a4a3a] mb-2">Trash is empty</h3>
          <p className="text-sm md:text-base text-[#8b7355]">Deleted notes will appear here for 30 days</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 p-3 bg-[#ffeaa7]/30 border border-[#ffeaa7]/50 rounded-xl text-sm text-[#8b7355]">
            💡 Notes in trash can be restored or permanently deleted
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className="bg-gradient-to-br from-[#dfe6e9] to-[#b2bec3] backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all duration-300 group animate-noteAppear relative overflow-hidden opacity-70 hover:opacity-100"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.15), -8px -8px 24px rgba(255, 255, 255, 0.9), inset 2px 2px 6px rgba(255, 255, 255, 0.6)'
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base md:text-lg font-bold text-[#5a4a3a] line-clamp-1 flex-1">
                      {note.title || 'Untitled Note'}
                    </h3>
                    <span className="text-xl ml-2">🗑️</span>
                  </div>
                  
                  <p className="text-xs md:text-sm text-[#6a5a4a] mb-3 md:mb-4 line-clamp-3 opacity-70">
                    {note.content || 'No content'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-[#8b7355] font-medium mb-4 pb-4 border-b border-[#8b7355]/20">
                    <span>Deleted: {new Date(note.trashedAt).toLocaleDateString()}</span>
                    <span>{note.content?.split(/\s+/).filter(w => w).length || 0} words</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRestore(note.id)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] hover:scale-105 active:scale-95 transition-all text-xs md:text-sm font-bold text-[#5a4a3a] flex items-center justify-center gap-2"
                      style={{
                        boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <span>↩️</span>
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => onPermanentDelete(note.id)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-br from-[#ffb3ba] to-[#ffd4d4] hover:scale-105 active:scale-95 transition-all text-xs md:text-sm font-bold text-[#5a4a3a] flex items-center justify-center gap-2"
                      style={{
                        boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <span>🗑️</span>
                      <span>Delete Forever</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TrashView
