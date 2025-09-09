import React, { useEffect, useRef } from 'react'
import styles from './styles.module.css'

interface CodeBackgroundProps {
  className?: string
}

const CodeBackground: React.FC<CodeBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const codeLines = [
      'const developer = {',
      '  name: "Bernardo",',
      '  skills: ["React", "TypeScript"],',
      '  experience: "4+ years",',
      '  passion: "Frontend"',
      '};',
      '',
      'function createAmazing() {',
      '  return <Portfolio />;',
      '}',
      '',
      'const projects = [',
      '  "E-commerce", "Web Apps",',
      '  "Mobile Apps", "APIs"',
      '];',
      '',
      'export default developer;'
    ]

    let animationId: number
    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const fontSize = Math.max(12, canvas.width / 80)
      ctx.font = `${fontSize}px 'Fira Code', 'Courier New', monospace`
      
      const lineHeight = fontSize * 1.4
      const startY = 50
      const startX = 30
      
      codeLines.forEach((line, index) => {
        const y = startY + (index * lineHeight)
        const x = startX + Math.sin(time + index * 0.5) * 10
        
        if (line.trim()) {
          const gradient = ctx.createLinearGradient(0, y - fontSize, 0, y)
          gradient.addColorStop(0, 'rgba(255, 153, 0, 0.8)')
          gradient.addColorStop(0.5, 'rgba(255, 153, 0, 0.4)')
          gradient.addColorStop(1, 'rgba(255, 153, 0, 0.1)')
          
          ctx.fillStyle = gradient
          ctx.fillText(line, x, y)
        }
      })

      time += 0.02
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className={`${styles.codeBackground} ${className}`}>
      <canvas ref={canvasRef} className={styles.codeCanvas} />
      <div className={styles.codeOverlay} />
    </div>
  )
}

export default CodeBackground
