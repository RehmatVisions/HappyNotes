const ReportsView = ({ notes }) => {
  const totalNotes = notes.length
  const totalWords = notes.reduce((sum, note) => {
    return sum + (note.content?.split(/\s+/).filter(w => w.length > 0).length || 0)
  }, 0)

  const exportToPDF = () => {
    // Get top notes by word count
    const topNotes = [...notes]
      .map(note => ({
        title: note.title || 'Untitled',
        words: note.content?.split(/\s+/).filter(w => w.length > 0).length || 0,
        created: new Date(note.createdAt).toLocaleDateString()
      }))
      .sort((a, b) => b.words - a.words)
      .slice(0, 5)

    // Generate HTML report
    const reportHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NotesHub Analytics Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f5e6d3 0%, #fef3e2 50%, #f0e5d8 100%);
      padding: 40px 20px;
      color: #5a4a3a;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(139, 115, 85, 0.15);
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #ffeaa7;
    }
    .header h1 {
      font-size: 36px;
      background: linear-gradient(135deg, #ff9a9e, #fad0c4, #ffeaa7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    .header p {
      color: #8b7355;
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: linear-gradient(135deg, #a8d8ea, #c7ceea);
      padding: 25px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 4px 4px 12px rgba(139, 115, 85, 0.12);
    }
    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #ffd4d4, #ffb3ba);
    }
    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #a8e6cf, #dcedc1);
    }
    .stat-card h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #5a4a3a;
    }
    .stat-card .value {
      font-size: 32px;
      font-weight: bold;
      color: #5a4a3a;
    }
    .section {
      margin-bottom: 40px;
    }
    .section h2 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #5a4a3a;
      border-left: 4px solid #ffeaa7;
      padding-left: 15px;
    }
    .top-notes {
      background: #fef9f3;
      border-radius: 15px;
      padding: 20px;
    }
    .note-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      margin-bottom: 10px;
      background: white;
      border-radius: 10px;
      box-shadow: 2px 2px 8px rgba(139, 115, 85, 0.08);
    }
    .note-item:last-child {
      margin-bottom: 0;
    }
    .note-title {
      font-weight: 600;
      color: #5a4a3a;
      flex: 1;
    }
    .note-meta {
      display: flex;
      gap: 15px;
      font-size: 14px;
      color: #8b7355;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #f5e6d3;
      color: #8b7355;
      font-size: 12px;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📝 NotesHub Analytics Report</h1>
      <p>Generated on ${new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Notes</h3>
        <div class="value">${totalNotes}</div>
      </div>
      <div class="stat-card">
        <h3>Total Words</h3>
        <div class="value">${totalWords.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <h3>Avg Words/Note</h3>
        <div class="value">${totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0}</div>
      </div>
    </div>

    <div class="section">
      <h2>📊 Top Notes by Word Count</h2>
      <div class="top-notes">
        ${topNotes.length > 0 ? topNotes.map((note, index) => `
          <div class="note-item">
            <div class="note-title">${index + 1}. ${note.title}</div>
            <div class="note-meta">
              <span><strong>${note.words}</strong> words</span>
              <span>${note.created}</span>
            </div>
          </div>
        `).join('') : '<p style="text-align: center; color: #8b7355;">No notes available</p>'}
      </div>
    </div>

    <div class="section">
      <h2>📈 Summary</h2>
      <div style="background: #fef9f3; padding: 20px; border-radius: 15px; line-height: 1.8;">
        <p><strong>Total Notes Created:</strong> ${totalNotes}</p>
        <p><strong>Total Content Written:</strong> ${totalWords.toLocaleString()} words</p>
        <p><strong>Average Note Length:</strong> ${totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0} words</p>
        <p><strong>Most Productive Note:</strong> ${topNotes[0]?.title || 'N/A'} (${topNotes[0]?.words || 0} words)</p>
      </div>
    </div>

    <div class="footer">
      <p>📝 NotesHub - Your Personal Notes App</p>
      <p>This report was generated automatically from your notes data</p>
    </div>
  </div>
</body>
</html>
    `

    // Create blob and download
    const blob = new Blob([reportHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `NotesHub-Report-${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Show instructions
    setTimeout(() => {
      alert('📄 Report downloaded!\n\nTo save as PDF:\n1. Open the downloaded HTML file in your browser\n2. Press Ctrl+P (or Cmd+P on Mac)\n3. Select "Save as PDF" as the printer\n4. Click Save')
    }, 500)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ff9a9e] via-[#fad0c4] to-[#ffeaa7] bg-clip-text text-transparent">
          Analytics & Reports
        </h2>
        <button
          onClick={exportToPDF}
          className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] text-[#5a4a3a] font-bold transition-all text-sm md:text-base hover:scale-105 active:scale-95 flex items-center gap-2 animate-pulse-glow"
          style={{
            boxShadow: '6px 6px 16px rgba(139, 115, 85, 0.2), -6px -6px 16px rgba(255, 255, 255, 0.8), inset 2px 2px 4px rgba(255, 255, 255, 0.5)'
          }}
        >
          <span>📄</span>
          <span>Export Report</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 hover:-translate-y-1 transition-all"
          style={{
            boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
          }}>
          <h3 className="text-base md:text-lg font-bold mb-4 text-[#5a4a3a]">Daily Report</h3>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-br from-[#a8d8ea] to-[#c7ceea] rounded-xl md:rounded-2xl"
              style={{
                boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8)'
              }}>
              <span className="text-[#5a4a3a] font-semibold text-sm md:text-base">Total Notes</span>
              <span className="text-xl md:text-2xl font-bold text-[#5a4a3a]">{totalNotes}</span>
            </div>
            <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-br from-[#ffd4d4] to-[#ffb3ba] rounded-xl md:rounded-2xl"
              style={{
                boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8)'
              }}>
              <span className="text-[#5a4a3a] font-semibold text-sm md:text-base">Total Words</span>
              <span className="text-xl md:text-2xl font-bold text-[#5a4a3a]">{totalWords}</span>
            </div>
            <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] rounded-xl md:rounded-2xl"
              style={{
                boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.8)'
              }}>
              <span className="text-[#5a4a3a] font-semibold text-sm md:text-base">Avg Words/Note</span>
              <span className="text-xl md:text-2xl font-bold text-[#5a4a3a]">{totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 hover:-translate-y-1 transition-all"
          style={{
            boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
          }}>
          <h3 className="text-base md:text-lg font-bold mb-4 text-[#5a4a3a]">Productivity Heatmap</h3>
          <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const colors = ['#a8d8ea', '#ffd4d4', '#a8e6cf', '#ffeaa7', '#c7ceea', '#ffb3ba', '#dcedc1']
              const color = colors[i % colors.length]
              return (
                <div
                  key={i}
                  className="aspect-square rounded-lg hover:scale-110 transition-transform cursor-pointer"
                  style={{ 
                    backgroundColor: color,
                    opacity: Math.random() * 0.6 + 0.4,
                    boxShadow: '2px 2px 6px rgba(139, 115, 85, 0.15), -2px -2px 6px rgba(255, 255, 255, 0.8)'
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsView
