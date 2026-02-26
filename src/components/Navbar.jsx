import { useState } from 'react'

const Navbar = ({ onQuickAdd, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <header className="bg-[#fef9f3]/90 backdrop-blur-xl border border-[#e8dcc8]/50 rounded-2xl md:rounded-3xl p-3 md:p-5 animate-slideDown sticky top-0 z-50 hover-lift"
      style={{
        boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
      }}>
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search..."
            className="w-full px-4 md:px-5 py-2.5 md:py-3.5 pl-10 md:pl-12 bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] border-none rounded-xl md:rounded-2xl focus:outline-none transition-all text-sm md:text-base text-[#5a4a3a] placeholder-[#a89580] focus:scale-105 focus:shadow-lg"
            style={{
              boxShadow: 'inset 4px 4px 12px rgba(139, 115, 85, 0.15), inset -4px -4px 12px rgba(255, 255, 255, 0.7)'
            }}
          />
          <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-lg md:text-xl group-focus-within:scale-110 transition-all duration-300">🔍</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* View Toggle - Hidden on mobile */}
          <div className="hidden lg:flex gap-2 bg-gradient-to-br from-[#fef9f3] to-[#f5e6d3] p-1.5 rounded-2xl animate-slideDown"
            style={{
              boxShadow: 'inset 3px 3px 8px rgba(139, 115, 85, 0.15), inset -3px -3px 8px rgba(255, 255, 255, 0.7)',
              animationDelay: '0.1s'
            }}>
            <button className="px-3 py-2 rounded-xl bg-gradient-to-br from-[#a8d8ea] to-[#c7ceea] text-[#4a5a6a] text-sm transition-all font-semibold hover:scale-110 active:scale-95"
              style={{
                boxShadow: '3px 3px 8px rgba(139, 115, 85, 0.2), -3px -3px 8px rgba(255, 255, 255, 0.8)'
              }}>
              ⊞
            </button>
            <button className="px-3 py-2 rounded-xl text-[#8b7355] text-sm transition-all hover:bg-white/30 hover:scale-110 active:scale-95">
              ☰
            </button>
          </div>

          {/* Quick Add */}
          <button
            onClick={onQuickAdd}
            className="px-3 md:px-6 py-2.5 md:py-3.5 bg-gradient-to-br from-[#ffd4d4] via-[#ffeaa7] to-[#a8e6cf] text-[#5a4a3a] rounded-xl md:rounded-2xl font-bold transition-all hover:scale-110 active:scale-95 relative overflow-hidden group text-sm md:text-base animate-slideDown animate-pulse-glow"
            style={{
              boxShadow: '6px 6px 16px rgba(139, 115, 85, 0.2), -6px -6px 16px rgba(255, 255, 255, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
              animationDelay: '0.2s'
            }}
          >
            <span className="relative z-10 hidden md:inline">+ Quick Add</span>
            <span className="relative z-10 md:hidden">+</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#ffb3ba] to-[#ffd4d4] flex items-center justify-center text-[#5a4a3a] font-bold cursor-pointer hover:scale-110 active:scale-95 transition-all text-xs md:text-base animate-slideDown"
            style={{
              boxShadow: '6px 6px 16px rgba(139, 115, 85, 0.2), -6px -6px 16px rgba(255, 255, 255, 0.8), inset 2px 2px 4px rgba(255, 255, 255, 0.5)',
              animationDelay: '0.3s'
            }}>
            RK
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
