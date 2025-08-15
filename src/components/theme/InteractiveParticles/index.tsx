import React, { useRef, useEffect, useCallback } from 'react'
import styles from './styles.module.css'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
}

const InteractiveParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: 0, y: 0, isActive: false })

  const createParticles = useCallback((count: number, width: number, height: number) => {
    const colors = [
      'rgba(100, 108, 255, 0.6)',
      'rgba(255, 255, 255, 0.4)',
      'rgba(100, 108, 255, 0.3)',
      'rgba(255, 255, 255, 0.2)',
    ]

    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.3,
    }))
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    particles.current.forEach((particle, index) => {
      if (mouse.current.isActive) {
        const dx = mouse.current.x - particle.x
        const dy = mouse.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.vx += (dx / distance) * force * 0.02
          particle.vy += (dy / distance) * force * 0.02
        }
      }

      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < 0 || particle.x > width) particle.vx *= -0.8
      if (particle.y < 0 || particle.y > height) particle.vy *= -0.8

      particle.vx *= 0.99
      particle.vy *= 0.99

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.opacity
      ctx.fill()

      if (index < particles.current.length - 1) {
        const nextParticle = particles.current[index + 1]
        const distance = Math.sqrt(
          Math.pow(particle.x - nextParticle.x, 2) + 
          Math.pow(particle.y - nextParticle.y, 2)
        )
        
        if (distance < 80) {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(nextParticle.x, nextParticle.y)
          ctx.strokeStyle = `rgba(100, 108, 255, ${0.1 * (1 - distance / 80)})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    })

    ctx.globalAlpha = 1
    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    createParticles(50, width, height)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      createParticles(50, width, height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      mouse.current.isActive = true
    }

    const handleMouseLeave = () => {
      mouse.current.isActive = false
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [createParticles, animate])

  return (
    <canvas
      ref={canvasRef}
      className={styles.interactiveParticles}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default InteractiveParticles
