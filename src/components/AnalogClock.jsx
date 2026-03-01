import { memo, useState, useEffect, useRef } from 'react'

const AnalogClock = memo(() => {
  const [time, setTime] = useState(new Date())
  const timerRef = useRef(null)

  useEffect(() => {
    // Update immediately
    setTime(new Date())
    
    // Set up interval
    timerRef.current = setInterval(() => {
      setTime(new Date())
    }, 100)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const milliseconds = time.getMilliseconds()

  const totalSeconds = seconds + milliseconds / 1000
  const secondDegrees = (totalSeconds / 60) * 360

  const totalMinutes = minutes + totalSeconds / 60
  const minuteDegrees = (totalMinutes / 60) * 360

  const totalHours = hours + totalMinutes / 60
  const hourDegrees = (totalHours / 12) * 360

  // Memoized styles to prevent recalculation
  const clockStyle = {
    background: `
      linear-gradient(135deg, #fef9f3 0%, #f5e6d3 30%, #ede7e0 60%, #e0d9d0 100%),
      radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8) 0%, transparent 50%)
    `,
    boxShadow: `
      inset -12px -12px 40px rgba(139, 115, 85, 0.12),
      inset 12px 12px 40px rgba(255, 255, 255, 0.85)
    `,
  }

  const outerRingStyle = {
    border: '6px solid #8b7355',
    boxSizing: 'border-box',
    boxShadow: `
      inset 0 3px 10px rgba(255,255,255,0.6),
      0 3px 10px rgba(0,0,0,0.2),
      inset 0 -2px 5px rgba(0,0,0,0.1)
    `,
  }

  const innerRingStyle = {
    border: '2px solid #d4a574',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.5), 0 0 10px rgba(212, 165, 116, 0.1)',
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      {/* Premium Clock */}
      <div 
        className="relative w-72 h-72 rounded-full flex items-center justify-center"
        style={{
          ...clockStyle,
          animation: 'pulse-ring 4s ease-in-out infinite',
          zIndex: 10,
          willChange: 'transform',
        }}
      >
        {/* Glossy overlay */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.5) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Outer ring */}
        <div 
          className="absolute inset-0 rounded-full"
          style={outerRingStyle}
        />

        {/* Inner ring */}
        <div 
          className="absolute inset-4 rounded-full"
          style={innerRingStyle}
        />

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180)
          const x = Math.sin(angle) * 125
          const y = -Math.cos(angle) * 125
          const isMainHour = i % 3 === 0
          return (
            <div
              key={`marker-${i}`}
              className="absolute rounded-full"
              style={{
                width: isMainHour ? '5px' : '2px',
                height: isMainHour ? '20px' : '10px',
                background: isMainHour 
                  ? 'linear-gradient(180deg, #5a4a3a 0%, #d4a574 50%, #5a4a3a 100%)'
                  : 'linear-gradient(180deg, #8b7355 0%, #a89580 100%)',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(-50%, -50%)`,
                boxShadow: isMainHour 
                  ? '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)'
                  : '0 1px 3px rgba(0,0,0,0.2)',
                borderRadius: isMainHour ? '3px' : '1px',
              }}
            />
          )
        })}

        {/* Numbers */}
        {[...Array(12)].map((_, i) => {
          const number = i === 0 ? 12 : i
          const angle = (i * 30) * (Math.PI / 180)
          const x = Math.sin(angle) * 95
          const y = -Math.cos(angle) * 95
          return (
            <div
              key={`num-${number}`}
              className="absolute font-black"
              style={{
                fontSize: '20px',
                fontWeight: '900',
                color: '#5a4a3a',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 1px 3px rgba(255,255,255,0.5)',
                letterSpacing: '1px',
              }}
            >
              {number}
            </div>
          )
        })}

        {/* Center circle */}
        <div 
          className="absolute rounded-full z-20"
          style={{
            width: '16px',
            height: '16px',
            background: 'radial-gradient(circle at 30% 30%, #f0e68c 0%, #d4a574 50%, #5a4a3a 100%)',
            boxShadow: `
              0 4px 10px rgba(0,0,0,0.4),
              inset -2px -2px 4px rgba(0,0,0,0.3),
              inset 2px 2px 4px rgba(255,255,255,0.3),
              0 0 8px rgba(212, 165, 116, 0.4)
            `,
          }}
        />

        {/* Hour hand */}
        <div
          className="absolute top-1/2 left-1/2 origin-bottom"
          style={{
            width: '8px',
            height: '48px',
            background: 'linear-gradient(90deg, #5a4a3a 0%, #8b7355 40%, #d4a574 50%, #8b7355 60%, #5a4a3a 100%)',
            borderRadius: '4px',
            transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)`,
            zIndex: 10,
            boxShadow: `
              0 3px 8px rgba(0,0,0,0.3),
              inset 0 1px 2px rgba(255,255,255,0.2),
              0 0 6px rgba(212, 165, 116, 0.15)
            `,
            willChange: 'transform',
          }}
        />

        {/* Minute hand */}
        <div
          className="absolute top-1/2 left-1/2 origin-bottom"
          style={{
            width: '6px',
            height: '65px',
            background: 'linear-gradient(90deg, #8b7355 0%, #a89580 40%, #d4c5b9 50%, #a89580 60%, #8b7355 100%)',
            borderRadius: '3px',
            transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)`,
            zIndex: 11,
            boxShadow: `
              0 3px 7px rgba(0,0,0,0.25),
              inset 0 1px 2px rgba(255,255,255,0.15),
              0 0 5px rgba(212, 165, 116, 0.1)
            `,
            willChange: 'transform',
          }}
        />

        {/* Second hand */}
        <div
          className="absolute top-1/2 left-1/2 origin-bottom"
          style={{
            width: '3px',
            height: '72px',
            background: 'linear-gradient(90deg, #d4a574 0%, #f0e68c 50%, #d4a574 100%)',
            borderRadius: '2px',
            transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)`,
            zIndex: 12,
            boxShadow: `
              0 2px 6px rgba(212, 165, 116, 0.4),
              inset 0 1px 1px rgba(255,255,255,0.3),
              0 0 10px rgba(212, 165, 116, 0.3)
            `,
            willChange: 'transform',
          }}
        />
      </div>

      {/* Digital time display */}
      <div className="text-center mt-4">
        <p className="text-4xl font-black text-[#5a4a3a] tracking-tighter" style={{
          textShadow: '0 3px 8px rgba(139, 115, 85, 0.15)',
        }}>
          {time.toLocaleTimeString()}
        </p>
        <p className="text-xs text-[#8b7355] mt-3 font-bold tracking-widest" style={{
          textShadow: '0 1px 3px rgba(139, 115, 85, 0.08)',
        }}>
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
      </div>
    </div>
  )
})

AnalogClock.displayName = 'AnalogClock'

export default AnalogClock
