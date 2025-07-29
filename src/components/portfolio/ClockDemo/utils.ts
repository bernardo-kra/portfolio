export const clockCode = `import React, { useState, useEffect } from 'react'

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')

  return (
    <div className={styles.clock}>
      <div className={styles.clock__time}>
        {hours}:{minutes}:{seconds}
      </div>
      <div className={styles.clock__date}>
        {time.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  )
}`

export const clockCSS = `.clock {
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
  border-radius: 20px;
  padding: var(--spacing-2xl) var(--spacing-xl);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  min-width: 300px;
  position: relative;
  overflow: hidden;
}

.clock::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--brand-orange), #ffb366);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

.clock__time {
  font-size: 4rem;
  font-weight: 900;
  color: var(--brand-orange);
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 4px rgba(255, 153, 0, 0.3);
  font-family: 'Space Grotesk', monospace;
  letter-spacing: 2px;
}

.clock__date {
  font-size: var(--font-size-lg);
  color: var(--text-muted);
  text-transform: capitalize;
  font-weight: 500;
}` 