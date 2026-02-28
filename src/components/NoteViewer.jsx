import { useState, useEffect } from 'react'

const NoteViewer = ({ note, onClose, onEdit, onDelete, onTogglePin, onArchive }) => {
  const [isFlipping, setIsFlipping] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Entrance animation
    setIsFlipping(true)
    setTimeout(() => setIsFlipping(false), 800)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setIsFlipping(true)
    setTimeout(() => onClose(), 500)
  }

  const handleEdit = () => {
    onEdit(note)
    onClose()
  }

  const formatContent = (content) => {
    if (!content) return ''
    
    // Convert markdown-style formatting to HTML
    return content
      .split('\n')
      .map(line => {
        // Bold
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-[#3a2a1a]">$1</strong>')
        // Italic
        line = line.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
        // Underline
        line = line.replace(/__(.+?)__/g, '<u class="underline decoration-2 decoration-[#8b7355]">$1</u>')
        // Strikethrough
        line = line.replace(/~~(.+?)~~/g, '<del class="line-through opacity-60">$1</del>')
        // Bullet points
        if (line.startsWith('• ')) {
          return `<li class="ml-6 mb-2 list-disc">${line.substring(2)}</li>`
        }
        // Checkboxes
        if (line.startsWith('☐ ')) {
          return `<div class="flex items-start gap-3 mb-2"><span class="text-xl mt-0.5">☐</span><span class="flex-1">${line.substring(2)}</span></div>`
        }
        if (line.startsWith('☑ ')) {
          return `<div class="flex items-start gap-3 mb-2"><span class="text-xl mt-0.5 text-[#a8e6cf]">☑</span><span class="flex-1 line-through opacity-60">${line.substring(2)}</span></div>`
        }
        return line ? `<p class="mb-4 leading-relaxed">${line}</p>` : '<br/>'
      })
      .join('\n')
  }

  const wordCount = note.content?.split(/\s+/).filter(w => w.length > 0).length || 0
  const charCount = note.content?.length || 0
  const readingTime = Math.ceil(wordCount / 200) // Average reading speed

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-2 md:p-6 transition-all duration-500 ${isClosing ? 'opacity-0' : 'animate-fadeIn'}`}>
      <div 
        className={`w-full max-w-5xl h-[95vh] relative transition-all duration-700 ${
          isFlipping ? 'animate-bookOpen' : ''
        }`}
        style={{ 
          perspective: '2000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Book Container with 3D effect */}
        <div className="relative w-full h-full bg-gradient-to-br from-[#fef9f3] via-[#f5e6d3] to-[#f0e5d8] rounded-3xl overflow-hidden transform-gpu"
          style={{
            boxShadow: `
              0 30px 90px rgba(90, 74, 58, 0.4),
              0 15px 40px rgba(139, 115, 85, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.8),
              inset 0 -2px 4px rgba(139, 115, 85, 0.1),
              20px 0 60px -20px rgba(139, 115, 85, 0.5),
              -20px 0 60px -20px rgba(139, 115, 85, 0.5)
            `,
            border: '2px solid rgba(139, 115, 85, 0.2)'
          }}>
          
          {/* Book Spine Effect - Left Side */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#8b7355]/30 via-[#8b7355]/10 to-transparent z-10">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#8b7355]/40 to-transparent" />
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#8b7355]/30 to-transparent" />
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#8b7355]/20 to-transparent" />
          </div>
          
          {/* Page Lines Effect */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 31px, #8b7355 31px, #8b7355 32px)',
              marginTop: '140px',
              marginLeft: '80px',
              marginRight: '40px'
            }}
          />

          {/* Decorative corner ornaments */}
          <div className="absolute top-8 left-20 w-24 h-24 opacity-5 pointer-events-none z-0">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill="#8b7355" />
            </svg>
          </div>
          <div className="absolute top-8 right-20 w-24 h-24 opacity-5 pointer-events-none z-0">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill="#8b7355" />
            </svg>
          </div>

          {/* Header with elegant design */}
          <div className="relative p-6 md:p-8 border-b-2 border-[#e8dcc8]/60 bg-gradient-to-b from-white/50 to-transparent z-20">
            {/* Decorative header line */}
            <div className="absolute top-0 left-20 right-20 h-px bg-gradient-to-r from-transparent via-[#8b7355]/30 to-transparent" />
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 pl-12">
                <h1 className="text-3xl md:text-4xl font-bold text-[#3a2a1a] mb-3 leading-tight"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    textShadow: '2px 2px 4px rgba(139, 115, 85, 0.1)'
                  }}>
                  {note.title || 'Untitled Note'}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#8b7355]">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="text-lg">📅</span>
                    {new Date(note.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="text-[#e8dcc8]">•</span>
                  <span className="flex items-center gap-2 font-medium">
                    <span className="text-lg">📝</span>
                    {wordCount} words
                  </span>
                  <span className="text-[#e8dcc8]">•</span>
                  <span className="flex items-center gap-2 font-medium">
                    <span className="text-lg">⏱️</span>
                    {readingTime} min read
                  </span>
                  {note.pinned && (
                    <>
                      <span className="text-[#e8dcc8]">•</span>
                      <span className="flex items-center gap-2 text-[#ff9a9e] font-semibold">
                        <span className="text-lg">⭐</span>
                        Favorite
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] hover:from-[#a8e6cf] hover:to-[#dcedc1] transition-all flex items-center justify-center hover:scale-110 active:scale-95 text-xl"
                  style={{
                    boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  ⋮
                </button>
                <button
                  onClick={handleClose}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] hover:from-[#ffd4d4] hover:to-[#ffb3ba] transition-all hover:rotate-90 active:scale-95 flex items-center justify-center text-xl text-[#8b7355]"
                  style={{
                    boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Actions Dropdown */}
            {showActions && (
              <div className="absolute right-8 top-24 w-56 bg-white/98 backdrop-blur-xl rounded-2xl overflow-hidden z-30 animate-slideDown"
                style={{
                  boxShadow: '8px 8px 32px rgba(139, 115, 85, 0.3), -4px -4px 16px rgba(255, 255, 255, 0.9)'
                }}>
                <button
                  onClick={handleEdit}
                  className="w-full px-5 py-3.5 text-left hover:bg-[#a8e6cf]/20 transition-colors flex items-center gap-3 text-[#5a4a3a] font-medium"
                >
                  <span className="text-xl">✏️</span>
                  <span>Edit Note</span>
                </button>
                <button
                  onClick={() => {
                    onTogglePin(note.id)
                    setShowActions(false)
                  }}
                  className="w-full px-5 py-3.5 text-left hover:bg-[#ffeaa7]/20 transition-colors flex items-center gap-3 text-[#5a4a3a] font-medium"
                >
                  <span className="text-xl">{note.pinned ? '📌' : '⭐'}</span>
                  <span>{note.pinned ? 'Unpin Note' : 'Pin to Favorites'}</span>
                </button>
                <button
                  onClick={() => {
                    onArchive(note.id)
                    setShowActions(false)
                    setTimeout(handleClose, 300)
                  }}
                  className="w-full px-5 py-3.5 text-left hover:bg-[#c7ceea]/20 transition-colors flex items-center gap-3 text-[#5a4a3a] font-medium"
                >
                  <span className="text-xl">📦</span>
                  <span>{note.archived ? 'Unarchive' : 'Archive Note'}</span>
                </button>
                <div className="h-px bg-[#e8dcc8]/50 mx-3" />
                <button
                  onClick={() => {
                    if (window.confirm('Move this note to trash?')) {
                      onDelete(note.id)
                      handleClose()
                    }
                  }}
                  className="w-full px-5 py-3.5 text-left hover:bg-[#ffd4d4]/30 transition-colors flex items-center gap-3 text-[#d63031] font-medium"
                >
                  <span className="text-xl">🗑️</span>
                  <span>Delete Note</span>
                </button>
              </div>
            )}
          </div>

          {/* Content Area - Book Pages */}
          <div className="relative h-[calc(100%-200px)] overflow-y-auto px-16 md:px-20 py-8 scrollbar-thin scrollbar-thumb-[#8b7355]/30 scrollbar-track-transparent">
            {/* Page shadow effect - right side */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#8b7355]/15 via-[#8b7355]/5 to-transparent pointer-events-none z-10" />
            
            {/* Content with beautiful typography */}
            <div 
              className="prose prose-lg max-w-none text-[#5a4a3a] leading-loose relative z-0"
              style={{
                fontFamily: 'Georgia, "Palatino Linotype", "Book Antiqua", serif',
                fontSize: '1.1rem',
                lineHeight: '2',
                textAlign: 'justify',
                hyphens: 'auto',
                textIndent: '2em',
                textShadow: '0 1px 1px rgba(255, 255, 255, 0.5)'
              }}
              dangerouslySetInnerHTML={{ __html: formatContent(note.content) }}
            />
            
            {!note.content && (
              <div className="text-center text-[#a89580] py-32">
                <div className="text-7xl mb-6 animate-float">📖</div>
                <div className="text-2xl font-serif">This page is empty</div>
                <div className="text-sm mt-2 opacity-60">Start writing to fill these pages</div>
              </div>
            )}

            {/* Page number decoration */}
            {note.content && (
              <div className="text-center mt-12 mb-4 text-[#8b7355]/40 text-sm font-serif">
                ~ • ~
              </div>
            )}
          </div>

          {/* Footer with elegant design */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 border-t-2 border-[#e8dcc8]/60 bg-gradient-to-t from-white/50 to-transparent z-20">
            {/* Decorative footer line */}
            <div className="absolute bottom-full left-20 right-20 h-px bg-gradient-to-r from-transparent via-[#8b7355]/30 to-transparent" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pl-12">
              <div className="text-sm text-[#8b7355] font-medium">
                <span className="opacity-60">Last updated:</span> {new Date(note.updatedAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <button
                onClick={handleEdit}
                className="px-8 py-3 rounded-2xl bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] hover:from-[#8dd4b0] hover:to-[#b5d99c] text-[#3a2a1a] font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-base shadow-lg"
                style={{
                  boxShadow: '6px 6px 20px rgba(139, 115, 85, 0.25), -4px -4px 12px rgba(255, 255, 255, 0.8)'
                }}
              >
                <span className="text-xl">✏️</span>
                <span>Edit Note</span>
              </button>
            </div>
          </div>

          {/* Decorative corner fold effect */}
          <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#8b7355]/20 to-transparent transform rotate-0" 
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
              }}
            />
          </div>
        </div>

        {/* Book shadow and depth */}
        <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-br from-[#8b7355] via-[#a89580] to-[#ffeaa7]" 
          style={{ 
            transform: 'translateY(30px) scale(0.95)',
            filter: 'blur(40px)'
          }} 
        />
        
        {/* Additional depth layer */}
        <div className="absolute inset-0 -z-20 blur-2xl opacity-20 bg-[#5a4a3a]" 
          style={{ 
            transform: 'translateY(40px) scale(0.9)',
            filter: 'blur(50px)'
          }} 
        />
      </div>
    </div>
  )
}

export default NoteViewer
