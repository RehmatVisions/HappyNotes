import { useState, useEffect, useRef, memo, useCallback } from 'react'

const NoteEditor = memo(({ note, onSave, onClose, onDelete }) => {
  const [title, setTitle] = useState(note?.title || '')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isBoldActive, setIsBoldActive] = useState(false)
  const [isItalicActive, setIsItalicActive] = useState(false)
  const [isUnderlineActive, setIsUnderlineActive] = useState(false)
  const editorRef = useRef(null)

  const isEditMode = !!note?.id

  useEffect(() => {
    if (editorRef.current && note?.content) {
      editorRef.current.innerHTML = note.content
      updateCounts()
    }
  }, [])

  const updateCounts = useCallback(() => {
    if (!editorRef.current) return
    const text = editorRef.current.innerText || ''
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length
    setWordCount(words)
    setCharCount(text.length)
  }, [])

  const getEditorHTML = useCallback(() => {
    return editorRef.current?.innerHTML || ''
  }, [])

  const getEditorText = useCallback(() => {
    return editorRef.current?.innerText || ''
  }, [])

  useEffect(() => {
    if (note) {
      const currentHTML = getEditorHTML()
      const changed = title !== (note.title || '') || currentHTML !== (note.content || '')
      setHasChanges(changed)
    } else {
      setHasChanges(title.trim() !== '' || getEditorText().trim() !== '')
    }
  }, [title, note, getEditorHTML, getEditorText])

  const handleSave = useCallback(() => {
    const content = getEditorHTML()
    const text = getEditorText()
    
    if (!title.trim() && !text.trim()) {
      alert('Please add a title or content before saving')
      return
    }

    setIsSaving(true)
    
    const savedNote = {
      ...note,
      title: title.trim() || 'Untitled Note',
      content: content,
    }
    
    onSave(savedNote)
    setLastSaved(new Date())
    setHasChanges(false)
    
    setTimeout(() => {
      setIsSaving(false)
      onClose()
    }, 300)
  }, [title, note, onSave, onClose, getEditorHTML, getEditorText])

  const handleDelete = useCallback(() => {
    if (window.confirm('Move this note to trash?')) {
      if (note?.id && onDelete) {
        onDelete(note.id)
      }
      onClose()
    }
  }, [note, onDelete, onClose])

  const handleClose = useCallback(() => {
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
  }, [hasChanges, handleSave, onClose])

  const toggleBold = useCallback(() => {
    setIsBoldActive(prev => !prev)
    document.execCommand('bold', false, null)
    editorRef.current?.focus()
  }, [])

  const toggleItalic = useCallback(() => {
    setIsItalicActive(prev => !prev)
    document.execCommand('italic', false, null)
    editorRef.current?.focus()
  }, [])

  const toggleUnderline = useCallback(() => {
    setIsUnderlineActive(prev => !prev)
    document.execCommand('underline', false, null)
    editorRef.current?.focus()
  }, [])

  const insertList = useCallback(() => {
    document.execCommand('insertUnorderedList', false, null)
    editorRef.current?.focus()
  }, [])

  const handleInput = useCallback(() => {
    updateCounts()
    setHasChanges(true)
  }, [updateCounts])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        toggleBold()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault()
        toggleItalic()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault()
        toggleUnderline()
      }
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave, handleClose, toggleBold, toggleItalic, toggleUnderline])

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-2 md:p-4 animate-fadeIn">
      <div className="w-full max-w-6xl h-[95vh] bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden animate-modalSlideIn flex flex-col relative z-10"
        style={{
          boxShadow: '12px 12px 32px rgba(139, 115, 85, 0.2), -12px -12px 32px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
        }}>
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

        <div className="flex items-center justify-between gap-2 px-4 md:px-6 py-2 md:py-3 border-b border-[#e8dcc8]/50 overflow-x-auto">
          <div className="flex items-center gap-1.5 md:gap-2">
            <button 
              onClick={toggleBold}
              className={`px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-br transition-all font-bold text-sm md:text-base whitespace-nowrap hover:scale-105 active:scale-95 ${
                isBoldActive 
                  ? 'from-[#a8e6cf] to-[#dcedc1] text-[#2d5016] ring-2 ring-[#2d5016]'
                  : 'from-[#fef9f3] to-[#f5e6d3] text-[#8b7355]'
              }`}
              style={{
                boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8)'
              }}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button 
              onClick={toggleItalic}
              className={`px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-br transition-all font-bold text-sm md:text-base whitespace-nowrap hover:scale-105 active:scale-95 ${
                isItalicActive 
                  ? 'from-[#a8e6cf] to-[#dcedc1] text-[#2d5016] ring-2 ring-[#2d5016]'
                  : 'from-[#fef9f3] to-[#f5e6d3] text-[#8b7355]'
              }`}
              style={{
                boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8)'
              }}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button 
              onClick={toggleUnderline}
              className={`px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-br transition-all font-bold text-sm md:text-base whitespace-nowrap hover:scale-105 active:scale-95 ${
                isUnderlineActive 
                  ? 'from-[#a8e6cf] to-[#dcedc1] text-[#2d5016] ring-2 ring-[#2d5016]'
                  : 'from-[#fef9f3] to-[#f5e6d3] text-[#8b7355]'
              }`}
              style={{
                boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8)'
              }}
              title="Underline (Ctrl+U)"
            >
              <u>U</u>
            </button>
            <button 
              onClick={insertList}
              className="px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] text-[#8b7355] transition-all font-bold text-sm md:text-base whitespace-nowrap hover:scale-105 active:scale-95"
              style={{
                boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8)'
              }}
              title="List"
            >
              ≡
            </button>
          </div>
          <div className="text-xs md:text-sm text-[#8b7355] font-medium whitespace-nowrap">
            {wordCount} words • {charCount} chars
          </div>
        </div>

        <div 
          ref={editorRef}
          onInput={handleInput}
          contentEditable
          suppressContentEditableWarning
          className="flex-1 overflow-y-auto p-4 md:p-6 text-[#5a4a3a] text-base md:text-lg leading-relaxed outline-none focus:outline-none"
          style={{
            WebkitUserModify: 'read-write-plaintext-only'
          }}
        />

        <div className="flex items-center justify-between gap-2 p-4 md:p-6 border-t border-[#e8dcc8]/50 bg-gradient-to-r from-[#fef9f3]/50 to-[#f5e6d3]/50">
          <button
            onClick={handleDelete}
            className="px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#ffb3ba] to-[#ffd4d4] hover:from-[#ff9aa2] hover:to-[#ffb3ba] transition-all text-xs md:text-sm font-bold text-[#5a4a3a] hover:scale-105 active:scale-95"
            style={{
              boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.7)'
            }}
            title="Delete"
          >
            🗑️ Delete
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] hover:from-[#f5e6d3] hover:to-[#e8dcc8] transition-all text-xs md:text-sm font-bold text-[#8b7355] hover:scale-105 active:scale-95"
              style={{
                boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] hover:from-[#8dd4b0] hover:to-[#c5e8a8] disabled:opacity-50 transition-all text-xs md:text-sm font-bold text-[#2d5016] hover:scale-105 active:scale-95"
              style={{
                boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.7)'
              }}
            >
              {isSaving ? '💾 Saving...' : '💾 Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

NoteEditor.displayName = 'NoteEditor'

export default NoteEditor
