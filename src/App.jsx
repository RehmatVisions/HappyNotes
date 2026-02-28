import { useState, useEffect, useMemo, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import MobileNav from './components/MobileNav'
import Dashboard from './components/Dashboard'
import NotesView from './components/NotesView'
import ReportsView from './components/ReportsView'
import TrashView from './components/TrashView'
import ArchiveView from './components/ArchiveView'
import NoteEditor from './components/NoteEditor'
import NoteViewer from './components/NoteViewer'
import FloatingButton from './components/FloatingButton'
import NotificationCenter from './components/NotificationCenter'
import ToastContainer from './components/Toast'
import Footer from './components/Footer'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [notes, setNotes] = useState([])
  const [trashedNotes, setTrashedNotes] = useState([])
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [currentNote, setCurrentNote] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([])
  const [toasts, setToasts] = useState([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    const savedTrashed = localStorage.getItem('trashedNotes')
    const savedNotifications = localStorage.getItem('notifications')
    
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes)
        setNotes(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error('Error loading notes:', error)
        setNotes([])
      }
    }
    
    if (savedTrashed) {
      try {
        const parsed = JSON.parse(savedTrashed)
        setTrashedNotes(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error('Error loading trashed notes:', error)
        setTrashedNotes([])
      }
    }

    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        setNotifications(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error('Error loading notifications:', error)
        setNotifications([])
      }
    }
  }, [])

  // Add notification helper - memoized
  const addNotification = useCallback((title, message, icon = '📝') => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      icon,
      timestamp: new Date().toISOString(),
      read: false
    }
    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Add toast helper - memoized
  const showToast = useCallback((message, type = 'success') => {
    const newToast = {
      id: Date.now(),
      message,
      type
    }
    setToasts(prev => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
    localStorage.setItem('notifications', JSON.stringify([]))
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id)
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
  }, [])

  const saveNote = useCallback((note) => {
    setNotes(prev => {
      let updatedNotes
      if (note.id) {
        // Update existing note
        updatedNotes = prev.map(n => n.id === note.id ? { ...note, updatedAt: new Date().toISOString() } : n)
        addNotification('Note Updated', `"${note.title}" has been updated`, '✏️')
        showToast(`Note "${note.title}" updated successfully`, 'updated')
      } else {
        // Create new note
        const newNote = { 
          ...note, 
          id: Date.now(), 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pinned: false,
          archived: false,
          tags: note.tags || []
        }
        updatedNotes = [newNote, ...prev]
        addNotification('Note Created', `"${newNote.title}" has been created successfully`, '✨')
        showToast(`Note "${newNote.title}" created successfully`, 'created')
      }
      localStorage.setItem('notes', JSON.stringify(updatedNotes))
      return updatedNotes
    })
    setIsEditorOpen(false)
    setCurrentNote(null)
  }, [addNotification, showToast])

  const deleteNote = useCallback((id) => {
    setNotes(prev => {
      const noteToTrash = prev.find(n => n.id === id)
      if (noteToTrash) {
        setTrashedNotes(prevTrashed => {
          const updated = [{ ...noteToTrash, trashedAt: new Date().toISOString() }, ...prevTrashed]
          localStorage.setItem('trashedNotes', JSON.stringify(updated))
          return updated
        })
        addNotification('Note Moved to Trash', `"${noteToTrash.title}" has been moved to trash`, '🗑️')
        showToast(`Note "${noteToTrash.title}" moved to trash`, 'deleted')
        const updated = prev.filter(n => n.id !== id)
        localStorage.setItem('notes', JSON.stringify(updated))
        return updated
      }
      return prev
    })
  }, [addNotification, showToast])

  const permanentDelete = useCallback((id) => {
    if (window.confirm('Permanently delete this note? This cannot be undone!')) {
      setTrashedNotes(prev => {
        const noteToDelete = prev.find(n => n.id === id)
        const updated = prev.filter(n => n.id !== id)
        localStorage.setItem('trashedNotes', JSON.stringify(updated))
        addNotification('Note Deleted', `"${noteToDelete?.title}" has been permanently deleted`, '❌')
        showToast(`Note permanently deleted`, 'deleted')
        return updated
      })
    }
  }, [addNotification, showToast])

  const restoreNote = useCallback((id) => {
    setTrashedNotes(prev => {
      const noteToRestore = prev.find(n => n.id === id)
      if (noteToRestore) {
        const { trashedAt, ...restoredNote } = noteToRestore
        setNotes(prevNotes => {
          const updated = [{ ...restoredNote, updatedAt: new Date().toISOString() }, ...prevNotes]
          localStorage.setItem('notes', JSON.stringify(updated))
          return updated
        })
        addNotification('Note Restored', `"${noteToRestore.title}" has been restored`, '♻️')
        const updated = prev.filter(n => n.id !== id)
        localStorage.setItem('trashedNotes', JSON.stringify(updated))
        return updated
      }
      return prev
    })
  }, [addNotification])

  const emptyTrash = useCallback(() => {
    if (window.confirm('Empty trash? All notes will be permanently deleted!')) {
      setTrashedNotes([])
      localStorage.setItem('trashedNotes', JSON.stringify([]))
      addNotification('Trash Emptied', 'All notes in trash have been permanently deleted', '🗑️')
    }
  }, [addNotification])

  const togglePin = useCallback((id) => {
    setNotes(prev => {
      const note = prev.find(n => n.id === id)
      const updated = prev.map(n => 
        n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n
      )
      localStorage.setItem('notes', JSON.stringify(updated))
      if (note) {
        addNotification(
          note.pinned ? 'Note Unpinned' : 'Note Pinned',
          `"${note.title}" has been ${note.pinned ? 'unpinned' : 'pinned'}`,
          note.pinned ? '📌' : '⭐'
        )
      }
      return updated
    })
  }, [addNotification])

  const archiveNote = useCallback((id) => {
    setNotes(prev => {
      const note = prev.find(n => n.id === id)
      const updated = prev.map(n => 
        n.id === id ? { ...n, archived: !n.archived, updatedAt: new Date().toISOString() } : n
      )
      localStorage.setItem('notes', JSON.stringify(updated))
      if (note) {
        addNotification(
          note.archived ? 'Note Unarchived' : 'Note Archived',
          `"${note.title}" has been ${note.archived ? 'unarchived' : 'archived'}`,
          '📦'
        )
      }
      return updated
    })
  }, [addNotification])

  const duplicateNote = useCallback((note) => {
    setNotes(prev => {
      const newNote = {
        ...note,
        id: Date.now(),
        title: `${note.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pinned: false
      }
      const updated = [newNote, ...prev]
      localStorage.setItem('notes', JSON.stringify(updated))
      addNotification('Note Duplicated', `"${note.title}" has been duplicated`, '📋')
      return updated
    })
  }, [addNotification])

  const openEditor = useCallback((note = null) => {
    setCurrentNote(note)
    setIsEditorOpen(true)
    setIsViewerOpen(false)
  }, [])

  const openViewer = useCallback((note) => {
    setCurrentNote(note)
    setIsViewerOpen(true)
  }, [])

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  // Filter notes based on search query - memoized
  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes
    const searchLower = searchQuery.toLowerCase()
    return notes.filter(note => 
      note.title?.toLowerCase().includes(searchLower) ||
      note.content?.toLowerCase().includes(searchLower) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }, [notes, searchQuery])

  // Memoize filtered note lists
  const activeNotes = useMemo(() => notes.filter(n => !n.archived), [notes])
  const pinnedNotes = useMemo(() => notes.filter(n => n.pinned && !n.archived), [notes])
  const archivedNotes = useMemo(() => notes.filter(n => n.archived), [notes])
  const filteredActiveNotes = useMemo(() => 
    searchQuery ? filteredNotes.filter(n => !n.archived) : activeNotes,
    [searchQuery, filteredNotes, activeNotes]
  )

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen bg-gradient-to-br from-[#f5e6d3] via-[#fef3e2] to-[#f0e5d8] transition-colors duration-500 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-50">
          {/* Main floating orbs - simplified */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#ffd4d4]/20 via-[#ffeaa7]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-[#a8e6cf]/20 via-[#c7ceea]/10 to-transparent rounded-full blur-3xl" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'radial-gradient(circle, #8b7355 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <Sidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          notesCount={activeNotes.length}
        />

        <main className="flex-1 p-3 md:p-6 relative z-10 pb-20 md:pb-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <Navbar 
              onQuickAdd={() => openEditor()}
              onSearch={handleSearch}
            />
            <NotificationCenter 
              notifications={notifications}
              onClearAll={clearAllNotifications}
              onRemove={removeNotification}
            />
          </div>

          <div className="mt-4 md:mt-6">
            {activeView === 'dashboard' && <Dashboard notes={activeNotes} />}
            {activeView === 'notes' && (
              <NotesView 
                notes={filteredActiveNotes} 
                onEdit={openEditor}
                onView={openViewer}
                onDelete={deleteNote}
                onTogglePin={togglePin}
                onArchive={archiveNote}
                onDuplicate={duplicateNote}
              />
            )}
            {activeView === 'favorites' && (
              <NotesView 
                notes={pinnedNotes} 
                onEdit={openEditor}
                onView={openViewer}
                onDelete={deleteNote}
                onTogglePin={togglePin}
                onArchive={archiveNote}
                onDuplicate={duplicateNote}
                viewTitle="Favorites"
                emptyMessage="No pinned notes yet"
                emptyIcon="⭐"
              />
            )}
            {activeView === 'reports' && <ReportsView notes={activeNotes} />}
            {activeView === 'archive' && (
              <ArchiveView 
                notes={archivedNotes}
                onRestore={archiveNote}
                onDelete={deleteNote}
              />
            )}
            {activeView === 'trash' && (
              <TrashView 
                notes={trashedNotes}
                onRestore={restoreNote}
                onPermanentDelete={permanentDelete}
                onEmptyTrash={emptyTrash}
              />
            )}
          </div>

          {/* Footer */}
          <Footer />
        </main>

        <MobileNav 
          activeView={activeView}
          setActiveView={setActiveView}
          notesCount={activeNotes.length}
        />

        <FloatingButton onClick={() => openEditor()} />

        {isEditorOpen && (
          <NoteEditor
            note={currentNote}
            onSave={saveNote}
            onDelete={deleteNote}
            onClose={() => {
              setIsEditorOpen(false)
              setCurrentNote(null)
            }}
          />
        )}

        {isViewerOpen && currentNote && (
          <NoteViewer
            note={currentNote}
            onClose={() => {
              setIsViewerOpen(false)
              setCurrentNote(null)
            }}
            onEdit={openEditor}
            onDelete={deleteNote}
            onTogglePin={togglePin}
            onArchive={archiveNote}
          />
        )}

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  )
}

export default App
