import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import MobileNav from './components/MobileNav'
import Dashboard from './components/Dashboard'
import NotesView from './components/NotesView'
import ReportsView from './components/ReportsView'
import TrashView from './components/TrashView'
import ArchiveView from './components/ArchiveView'
import NoteEditor from './components/NoteEditor'
import FloatingButton from './components/FloatingButton'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [notes, setNotes] = useState([])
  const [trashedNotes, setTrashedNotes] = useState([])
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [currentNote, setCurrentNote] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    const savedTrashed = localStorage.getItem('trashedNotes')
    
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
  }, [])

  const saveNote = (note) => {
    let updatedNotes
    if (note.id) {
      // Update existing note
      updatedNotes = notes.map(n => n.id === note.id ? { ...note, updatedAt: new Date().toISOString() } : n)
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
      updatedNotes = [newNote, ...notes]
    }
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    setIsEditorOpen(false)
    setCurrentNote(null)
  }

  const deleteNote = (id) => {
    // Move to trash instead of permanent delete
    const noteToTrash = notes.find(n => n.id === id)
    if (noteToTrash) {
      const updatedTrashed = [{ ...noteToTrash, trashedAt: new Date().toISOString() }, ...trashedNotes]
      setTrashedNotes(updatedTrashed)
      localStorage.setItem('trashedNotes', JSON.stringify(updatedTrashed))
      
      const updatedNotes = notes.filter(n => n.id !== id)
      setNotes(updatedNotes)
      localStorage.setItem('notes', JSON.stringify(updatedNotes))
    }
  }

  const permanentDelete = (id) => {
    if (window.confirm('Permanently delete this note? This cannot be undone!')) {
      const updatedTrashed = trashedNotes.filter(n => n.id !== id)
      setTrashedNotes(updatedTrashed)
      localStorage.setItem('trashedNotes', JSON.stringify(updatedTrashed))
    }
  }

  const restoreNote = (id) => {
    const noteToRestore = trashedNotes.find(n => n.id === id)
    if (noteToRestore) {
      const { trashedAt, ...restoredNote } = noteToRestore
      const updatedNotes = [{ ...restoredNote, updatedAt: new Date().toISOString() }, ...notes]
      setNotes(updatedNotes)
      localStorage.setItem('notes', JSON.stringify(updatedNotes))
      
      const updatedTrashed = trashedNotes.filter(n => n.id !== id)
      setTrashedNotes(updatedTrashed)
      localStorage.setItem('trashedNotes', JSON.stringify(updatedTrashed))
    }
  }

  const emptyTrash = () => {
    if (window.confirm('Empty trash? All notes will be permanently deleted!')) {
      setTrashedNotes([])
      localStorage.setItem('trashedNotes', JSON.stringify([]))
    }
  }

  const togglePin = (id) => {
    const updatedNotes = notes.map(n => 
      n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n
    )
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  }

  const archiveNote = (id) => {
    const updatedNotes = notes.map(n => 
      n.id === id ? { ...n, archived: !n.archived, updatedAt: new Date().toISOString() } : n
    )
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  }

  const duplicateNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now(),
      title: `${note.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false
    }
    const updatedNotes = [newNote, ...notes]
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  }

  const openEditor = (note = null) => {
    setCurrentNote(note)
    setIsEditorOpen(true)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      note.title?.toLowerCase().includes(searchLower) ||
      note.content?.toLowerCase().includes(searchLower) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    )
  })

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
          notesCount={notes.filter(n => !n.archived).length}
        />

        <main className="flex-1 p-3 md:p-6 relative z-10 pb-20 md:pb-6">
          <Navbar 
            onQuickAdd={() => openEditor()}
            onSearch={handleSearch}
          />

          <div className="mt-4 md:mt-6">
            {activeView === 'dashboard' && <Dashboard notes={notes.filter(n => !n.archived)} />}
            {activeView === 'notes' && (
              <NotesView 
                notes={searchQuery ? filteredNotes.filter(n => !n.archived) : notes.filter(n => !n.archived)} 
                onEdit={openEditor} 
                onDelete={deleteNote}
                onTogglePin={togglePin}
                onArchive={archiveNote}
                onDuplicate={duplicateNote}
              />
            )}
            {activeView === 'favorites' && (
              <NotesView 
                notes={notes.filter(n => n.pinned && !n.archived)} 
                onEdit={openEditor} 
                onDelete={deleteNote}
                onTogglePin={togglePin}
                onArchive={archiveNote}
                onDuplicate={duplicateNote}
                viewTitle="Favorites"
                emptyMessage="No pinned notes yet"
                emptyIcon="⭐"
              />
            )}
            {activeView === 'reports' && <ReportsView notes={notes.filter(n => !n.archived)} />}
            {activeView === 'archive' && (
              <ArchiveView 
                notes={notes.filter(n => n.archived)}
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
        </main>

        <MobileNav 
          activeView={activeView}
          setActiveView={setActiveView}
          notesCount={notes.filter(n => !n.archived).length}
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
      </div>
    </div>
  )
}

export default App
