import { useState, useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const ReportsView = ({ notes }) => {
  const [timeRange, setTimeRange] = useState('week') // week, month, all

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalNotes = notes.length
    const favoriteNotes = notes.filter(n => n.pinned).length
    const totalWords = notes.reduce((sum, note) => 
      sum + (note.content?.split(/\s+/).filter(w => w.length > 0).length || 0), 0)
    const totalChars = notes.reduce((sum, note) => sum + (note.content?.length || 0), 0)
    
    // Calculate percentages
    const favoritePercentage = totalNotes > 0 ? ((favoriteNotes / totalNotes) * 100).toFixed(1) : 0
    const avgWordsPerNote = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0
    
    // Weekly activity data
    const now = new Date()
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const created = notes.filter(n => {
        const noteDate = new Date(n.createdAt)
        return noteDate >= dayStart && noteDate <= dayEnd
      }).length
      
      const updated = notes.filter(n => {
        const noteDate = new Date(n.updatedAt)
        return noteDate >= dayStart && noteDate <= dayEnd && n.createdAt !== n.updatedAt
      }).length
      
      return { day: dayName, created, updated, total: created + updated }
    })
    
    // Time distribution (when notes are created)
    const timeDistribution = notes.reduce((acc, note) => {
      const hour = new Date(note.createdAt).getHours()
      const period = hour < 6 ? 'Night' : hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening'
      acc[period] = (acc[period] || 0) + 1
      return acc
    }, {})
    
    const timeData = Object.entries(timeDistribution).map(([name, value]) => ({ name, value }))
    
    // Top 5 notes by word count
    const topNotes = [...notes]
      .map(note => ({
        id: note.id,
        title: note.title || 'Untitled',
        words: note.content?.split(/\s+/).filter(w => w.length > 0).length || 0,
        created: new Date(note.createdAt).toLocaleDateString(),
        updated: new Date(note.updatedAt).toLocaleDateString()
      }))
      .sort((a, b) => b.words - a.words)
      .slice(0, 5)
    
    return {
      totalNotes,
      favoriteNotes,
      favoritePercentage,
      totalWords,
      totalChars,
      avgWordsPerNote,
      weeklyData,
      timeData,
      topNotes
    }
  }, [notes])

  const exportToPDF = async () => {
    const reportElement = document.getElementById('analytics-report')
    if (!reportElement) return

    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`ThinkPad-Analytics-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }

  const COLORS = ['#a8d8ea', '#ffd4d4', '#a8e6cf', '#ffeaa7', '#c7ceea']

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff9a9e] via-[#fad0c4] to-[#ffeaa7] bg-clip-text text-transparent">
          Analytics & Reports
        </h2>
        <button
          onClick={exportToPDF}
          className="px-6 py-3 rounded-2xl bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] text-[#5a4a3a] font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          style={{
            boxShadow: '6px 6px 16px rgba(139, 115, 85, 0.2), -6px -6px 16px rgba(255, 255, 255, 0.8)'
          }}
        >
          <span>📄</span>
          <span>Export PDF</span>
        </button>
      </div>

      <div id="analytics-report" className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 hover:-translate-y-1 transition-all"
            style={{ boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9)' }}>
            <div className="text-sm font-semibold text-[#8b7355] mb-2">Total Notes</div>
            <div className="text-4xl font-bold text-[#5a4a3a] mb-1">{analytics.totalNotes}</div>
            <div className="text-xs text-[#a89580]">All active notes</div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 hover:-translate-y-1 transition-all"
            style={{ boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9)' }}>
            <div className="text-sm font-semibold text-[#8b7355] mb-2">Favorite Notes</div>
            <div className="text-4xl font-bold text-[#5a4a3a] mb-1">{analytics.favoriteNotes}</div>
            <div className="text-xs text-[#a89580]">{analytics.favoritePercentage}% of total</div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 hover:-translate-y-1 transition-all"
            style={{ boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9)' }}>
            <div className="text-sm font-semibold text-[#8b7355] mb-2">Total Words</div>
            <div className="text-4xl font-bold text-[#5a4a3a] mb-1">{analytics.totalWords.toLocaleString()}</div>
            <div className="text-xs text-[#a89580]">Across all notes</div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 hover:-translate-y-1 transition-all"
            style={{ boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9)' }}>
            <div className="text-sm font-semibold text-[#8b7355] mb-2">Avg Words/Note</div>
            <div className="text-4xl font-bold text-[#5a4a3a] mb-1">{analytics.avgWordsPerNote}</div>
            <div className="text-xs text-[#a89580]">Per note average</div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6"
          style={{ boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9)' }}>
          <h3 className="text-xl font-bold text-[#5a4a3a] mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8dcc8" />
              <XAxis dataKey="day" stroke="#8b7355" />
              <YAxis stroke="#8b7355" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fef9f3', 
                  border: '1px solid #e8dcc8',
                  borderRadius: '12px'
                }} 
              />
              <Legend />
              <Bar dataKey="created" fill="#a8e6cf" name="Created" radius={[8, 8, 0, 0]} />
              <Bar dataKey="updated" fill="#ffd4d4" name="Updated" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Distribution & Top Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time Distribution */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6"
            style={{ boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9)' }}>
            <h3 className="text-xl font-bold text-[#5a4a3a] mb-4">Note Creation Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.timeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Notes */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6"
            style={{ boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9)' }}>
            <h3 className="text-xl font-bold text-[#5a4a3a] mb-4">Top 5 Notes by Length</h3>
            <div className="space-y-3">
              {analytics.topNotes.map((note, index) => (
                <div key={note.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#fef9f3] to-[#f5e6d3] rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] flex items-center justify-center font-bold text-[#5a4a3a]">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#5a4a3a] truncate">{note.title}</div>
                    <div className="text-xs text-[#8b7355]">Updated: {note.updated}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#5a4a3a]">{note.words}</div>
                    <div className="text-xs text-[#8b7355]">words</div>
                  </div>
                </div>
              ))}
              {analytics.topNotes.length === 0 && (
                <div className="text-center text-[#a89580] py-8">No notes available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsView
