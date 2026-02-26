import { useState, useEffect } from 'react'

const NoteEditor = ({ note, onSave, onClose, onDelete }) => {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  const isEditMode = !!note?.id

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length
    setWordCount(words)
    setCharCount(content.length)
  }, [content])

  // Track changes
  useEffect(() => {
    if (note) {
      const changed = title !== (note.title || '') || content !== (note.content || '')
      setHasChanges(changed)
    } else {
      setHasChanges(title.trim() !== '' || content.trim() !== '')
    }
  }, [title, content, note])

  // Auto-save functionality (every 10 seconds if there are changes)
  useEffect(() => {
    if (!hasChanges) return

    const autoSaveTimer = setTimeout(() => {
      if (hasChanges && (title.trim() || content.trim())) {
        handleAutoSave()
      }
    }, 10000) // 10 seconds

    return () => clearTimeout(autoSaveTimer)
  }, [title, content, hasChanges])

  const handleAutoSave = () => {
    if (!title.trim() && !content.trim()) return

    setIsSaving(true)
    const savedNote = {
      ...note,
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
    }
    
    onSave(savedNote)
    setLastSaved(new Date())
    setHasChanges(false)
    
    setTimeout(() => {
      setIsSaving(false)
    }, 500)
  }

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      alert('Please add a title or content before saving')
      return
    }

    setIsSaving(true)
    
    const savedNote = {
      ...note,
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
    }
    
    onSave(savedNote)
    setLastSaved(new Date())
    setHasChanges(false)
    
    setTimeout(() => {
      setIsSaving(false)
      onClose()
    }, 300)
  }

  const handleDelete = () => {
    if (window.confirm('Move this note to trash?')) {
      if (note?.id && onDelete) {
        onDelete(note.id)
      }
      onClose()
    }
  }

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm('You have unsaved changes. Do you want to save before closing?')
      if (confirmClose) {
        handleSave()
      } else {
        onClose()
      }
    } else {
      onClose()
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      // Escape to close
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [title, content, hasChanges])

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-2 md:p-4 animate-fadeIn">
      <div className="w-full max-w-6xl h-[95vh] bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden animate-modalSlideIn flex flex-col relative z-10"
        style={{
          boxShadow: '12px 12px 32px rgba(139, 115, 85, 0.2), -12px -12px 32px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
        }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#e8dcc8]/50">
          <div className="flex-1 flex items-center gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="flex-1 text-xl md:text-2xl font-bold bg-transparent border-none outline-none text-[#5a4a3a] placeholder-[#a89580]"
              autoFocus
            />
            {/* Status indicator */}
            {hasChanges && !isSaving && (
              <span className="text-xs text-[#ffd4d4] font-semibold animate-pulse">
                • Unsaved
              </span>
            )}
            {isSaving && (
              <span className="text-xs text-[#a8e6cf] font-semibold animate-pulse">
                • Saving...
              </span>
            )}
            {!hasChanges && lastSaved && (
              <span className="text-xs text-[#8b7355] font-medium">
                ✓ Saved
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] hover:from-[#ffd4d4] hover:to-[#ffb3ba] transition-all hover:rotate-90 active:scale-95 flex items-center justify-center text-lg md:text-xl text-[#8b7355]"
            style={{
              boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.7)'
            }}
          >
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 px-4 md:px-6 py-2 md:py-3 border-b border-[#e8dcc8]/50 overflow-x-auto">
          <div className="flex items-center gap-1.5 md:gap-2">
            <button 
              className="px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] hover:from-[#a8e6cf] hover:to-[#dcedc1] transition-all font-bold text-[#5a4a3a] text-sm md:text-base whitespace-nowrap hover:scale-105 active:scale-95"
              style={{
                boxShadow: '3px 3px 8px rgba(139, 115, 85, 0.12), -3px -3px 8px rgba(255, 255, 255, 0.8)'
              }}
              title="Bold (Ctrl+B)"
            >
              B
            </button>
            <button 
              className="px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] hover:from-[#a8e6cf] hover:to-[#dcedc1] transition-all italic text-[#5a4a3a] text-sm md:text-base whitespace-nowrap hover:scale-105 active:scale-95"
              style={{
                boxShadow: '3px 3px 8px rgba(139, 115, 85, 0.12), -3px -3px 8px rgba(255, 255, 255, 0.8)'
              }}
              title="Italic (Ctrl+I)"
            >
              I
            </button>
            <button 
              className="px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] hover:from-[#a8e6cf] hover:to-[#dcedc1] transition-all text-[#5a4a3a] text-sm md:text-base whitespace-nowrap hover:scale-105 active:scale-95"
              style={{
                boxShadow: '3px 3px 8px rgba(139, 115, 85, 0.12), -3px -3px 8px rgba(255, 255, 255, 0.8)'
              }}
              title="List"
            >
              ☰
            </button>
            <button 
              className="px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] hover:from-[#a8e6cf] hover:to-[#dcedc1] transition-all text-[#5a4a3a] text-sm md:text-base whitespace-nowrap hover:scale-105 active:scale-95"
              style={{
                boxShadow: '3px 3px 8px rgba(139, 115, 85, 0.12), -3px -3px 8px rgba(255, 255, 255, 0.8)'
              }}
              title="Checklist"
            >
              ☑
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-[#8b7355] font-medium">
              {isEditMode ? 'Editing' : 'New Note'}
            </div>
            {isEditMode && (
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-[#ffb3ba] to-[#ffd4d4] hover:scale-105 active:scale-95 transition-all text-xs font-bold text-[#5a4a3a] flex items-center gap-1"
                style={{
                  boxShadow: '3px 3px 8px rgba(139, 115, 85, 0.15), -3px -3px 8px rgba(255, 255, 255, 0.8)'
                }}
                title="Delete Note"
              >
                <span>🗑️</span>
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Editor */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note... (Auto-saves every 10 seconds)"
          className="flex-1 w-full p-4 md:p-6 bg-transparent border-none outline-none resize-none text-[#5a4a3a] placeholder-[#a89580] text-sm md:text-base leading-relaxed"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 border-t border-[#e8dcc8]/50 gap-3 bg-[#fef9f3]/50">
          <div className="flex gap-3 md:gap-4 text-xs md:text-sm text-[#8b7355]">
            <span className="font-semibold">{wordCount} words</span>
            <span>{charCount} characters</span>
            {note?.createdAt && (
              <span className="hidden md:inline">
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
            <button
              onClick={handleClose}
              className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] hover:from-[#dfe6e9] hover:to-[#b2bec3] transition-all font-medium text-[#8b7355] text-sm md:text-base hover:scale-105 active:scale-95"
              style={{
                boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8)'
              }}
            >
              Cancel
            </button>
            
            {isEditMode && (
              <button
                onClick={handleDelete}
                className="flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#ffb3ba] to-[#ffd4d4] text-[#5a4a3a] font-bold transition-all text-sm md:text-base hover:scale-105 active:scale-95 flex items-center gap-2"
                style={{
                  boxShadow: '6px 6px 16px rgba(139, 115, 85, 0.2), -6px -6px 16px rgba(255, 255, 255, 0.8), inset 2px 2px 4px rgba(255, 255, 255, 0.5)'
                }}
              >
                <span>🗑️</span>
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
            
            <button
              onClick={handleSave}
              disabled={isSaving || (!title.trim() && !content.trim())}
              className={`flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] text-[#5a4a3a] font-bold transition-all text-sm md:text-base relative overflow-hidden group ${
                isSaving || (!title.trim() && !content.trim()) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 active:scale-95 animate-pulse-glow'
              }`}
              style={{
                boxShadow: '6px 6px 16px rgba(139, 115, 85, 0.2), -6px -6px 16px rgba(255, 255, 255, 0.8), inset 2px 2px 4px rgba(255, 255, 255, 0.5)'
              }}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> 
                  <span className="hidden sm:inline">Saving...</span>
                </span>
              ) : isEditMode ? (
                <span className="flex items-center gap-2">
                  <span>💾</span>
                  <span>Update</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>✨</span>
                  <span>Create</span>
                </span>
              )}
              {!isSaving && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              )}
            </button>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="px-4 md:px-6 py-2 bg-[#fef9f3]/30 border-t border-[#e8dcc8]/30">
          <p className="text-xs text-[#8b7355] text-center">
            💡 Tip: Press <kbd className="px-1.5 py-0.5 bg-white/50 rounded text-[10px] font-mono">Ctrl+S</kbd> to save • <kbd className="px-1.5 py-0.5 bg-white/50 rounded text-[10px] font-mono">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  )
}

export default NoteEditor
