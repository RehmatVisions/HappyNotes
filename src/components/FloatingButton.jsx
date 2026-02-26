const FloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-6 md:bottom-10 md:right-10 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#ffd4d4] via-[#ffeaa7] to-[#a8e6cf] text-[#5a4a3a] rounded-full text-2xl md:text-3xl font-bold transition-all duration-300 z-40 flex items-center justify-center hover:scale-125 hover:rotate-90 active:scale-95"
      style={{
        boxShadow: '8px 8px 24px rgba(139, 115, 85, 0.25), -8px -8px 24px rgba(255, 255, 255, 0.9), inset 2px 2px 6px rgba(255, 255, 255, 0.6)'
      }}
    >
      <span>+</span>
    </button>
  )
}

export default FloatingButton
