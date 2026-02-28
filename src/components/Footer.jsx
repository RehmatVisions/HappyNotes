import { memo } from 'react'
import logo from '../assets/logo.png'

const Footer = memo(() => {
  return (
    <footer className="mt-12 pb-6 px-6">
      <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl rounded-3xl p-6 md:p-8"
        style={{
          boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.12), -8px -8px 24px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
        }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Branding */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#ffb3ba] to-[#ffd4d4] flex items-center justify-center animate-float"
              style={{
                boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.7)'
              }}>
              <img src={logo} alt="ThinkPad Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2c3e50]">
                ThinkPad
              </h3>
              <p className="text-xs text-[#8b7355]">Your Personal Notes App</p>
            </div>
          </div>

          {/* Center - Developer Info */}
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1]"
            style={{
              boxShadow: '4px 4px 12px rgba(139, 115, 85, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)'
            }}>
            <span className="text-2xl">👨‍💻</span>
            <div>
              <p className="text-xs text-[#8b7355] font-medium">Developed by</p>
              <p className="text-sm font-bold text-[#5a4a3a]">Rehmat Ali</p>
            </div>
          </div>

          {/* Right side - Portfolio Link */}
          <a
            href="https://rehmat-ali.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-gradient-to-br from-[#a8d8ea] to-[#c7ceea] hover:from-[#8dc4d8] hover:to-[#b0bcd8] text-[#5a4a3a] font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
            style={{
              boxShadow: '6px 6px 16px rgba(139, 115, 85, 0.2), -6px -6px 16px rgba(255, 255, 255, 0.8)'
            }}
          >
            <span className="text-lg group-hover:rotate-12 transition-transform">🌐</span>
            <span>Visit Portfolio</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* Bottom - Copyright */}
        <div className="mt-6 pt-4 border-t border-[#e8dcc8]/50 text-center">
          <p className="text-xs text-[#8b7355]">
            © {new Date().getFullYear()} NotesHub. Crafted with ❤️ by{' '}
            <a 
              href="https://rehmat-ali.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-[#5a4a3a] hover:text-[#ff9a9e] transition-colors underline decoration-wavy"
            >
              Rehmat Ali
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
