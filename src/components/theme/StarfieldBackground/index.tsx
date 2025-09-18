import React, { useRef, useEffect, useCallback } from 'react'
import styles from './styles.module.css'

const STAR_COUNT = 150
const NEBULA_COUNT = 3
const PLANET_COUNT = 1
const COMET_COUNT = 0
const getStarColors = () => [
  getComputedStyle(document.documentElement).getPropertyValue('--star-color-1').trim() || '#fff',
  getComputedStyle(document.documentElement).getPropertyValue('--star-color-2').trim() || '#bfcfff',
  getComputedStyle(document.documentElement).getPropertyValue('--star-color-3').trim() || '#e6e9ff',
  getComputedStyle(document.documentElement).getPropertyValue('--star-color-4').trim() || '#cfd8ff',
]
const STAR_MIN_RADIUS = 0.5
const STAR_MAX_RADIUS = 1.5
const STAR_MIN_SPEED = 0.01
const STAR_MAX_SPEED = 0.08

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function hexToRgba(hex: string, alpha: number): string {
  // Remove # if present
  hex = hex.replace('#', '')
  
  // Handle 3-digit hex colors
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }
  
  // Ensure we have 6 digits
  if (hex.length !== 6) {
    return `rgba(255, 255, 255, ${alpha})` // fallback to white
  }
  
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

interface StarfieldBackgroundProps {
  disableParallax?: boolean
}

interface Nebula {
  x: number
  y: number
  width: number
  height: number
  color: string
  opacity: number
  speed: number
}

interface Planet {
  x: number
  y: number
  radius: number
  color: string
  speed: number
  phase: number
}

interface Comet {
  x: number
  y: number
  vx: number
  vy: number
  tail: { x: number; y: number }[]
  life: number
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = React.memo(({ disableParallax = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const stars = useRef<{ x: number; y: number; r: number; speed: number; color: string; depth: number }[]>([])
  const nebulae = useRef<Nebula[]>([])
  const planets = useRef<Planet[]>([])
  const comets = useRef<Comet[]>([])
  const mouse = useRef({ x: 0.5, y: 0.5 })

  const createStars = useCallback((w: number, h: number) => {
    stars.current = Array.from({ length: STAR_COUNT }, () => {
      const depth = randomBetween(0.2, 1)
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: randomBetween(STAR_MIN_RADIUS, STAR_MAX_RADIUS) * depth,
        speed: randomBetween(STAR_MIN_SPEED, STAR_MAX_SPEED) * depth,
        color: getStarColors()[Math.floor(Math.random() * getStarColors().length)],
        depth,
      }
    })
  }, [])

  const createNebulae = useCallback((w: number, h: number) => {
    const nebulaColors = ['#1a1a2e', '#16213e', '#0f3460']
    nebulae.current = Array.from({ length: NEBULA_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      width: randomBetween(200, 400),
      height: randomBetween(150, 300),
      color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
      opacity: randomBetween(0.05, 0.15),
      speed: randomBetween(0.005, 0.015)
    }))
  }, [])

  const createPlanets = useCallback((w: number, h: number) => {
    const planetColors = ['#4a5568', '#2d3748', '#1a202c']
    planets.current = Array.from({ length: PLANET_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: randomBetween(3, 6),
      color: planetColors[Math.floor(Math.random() * planetColors.length)],
      speed: randomBetween(0.01, 0.02),
      phase: Math.random() * Math.PI * 2
    }))
  }, [])

  const createComets = useCallback((w: number, h: number) => {
    comets.current = Array.from({ length: COMET_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: randomBetween(-2, -0.5),
      vy: randomBetween(-1, 1),
      tail: [],
      life: 1
    }))
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Enable smooth rendering
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // Clear completely
    ctx.clearRect(0, 0, width, height)
    
    // Render nebulae first (background)
    for (const nebula of nebulae.current) {
      const parallaxX = (mouse.current.x - 0.5) * 20 * 0.3
      const parallaxY = (mouse.current.y - 0.5) * 10 * 0.3
      const x = nebula.x + (disableParallax ? 0 : parallaxX)
      const y = nebula.y + (disableParallax ? 0 : parallaxY)
      
      // Create smooth elliptical nebula instead of rectangular
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(x, y, nebula.width / 2, nebula.height / 2, 0, 0, 2 * Math.PI)
      ctx.clip()
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(nebula.width, nebula.height) / 2)
      const alpha1 = nebula.opacity
      const alpha2 = nebula.opacity * 0.5
      gradient.addColorStop(0, hexToRgba(nebula.color, alpha1))
      gradient.addColorStop(0.7, hexToRgba(nebula.color, alpha2))
      gradient.addColorStop(1, hexToRgba(nebula.color, 0))
      
      ctx.fillStyle = gradient
      ctx.fillRect(x - nebula.width, y - nebula.height, nebula.width * 2, nebula.height * 2)
      ctx.restore()
      
      nebula.x += nebula.speed
      if (nebula.x > width + nebula.width) nebula.x = -nebula.width
    }
    
    // Render planets
    for (const planet of planets.current) {
      const parallaxX = (mouse.current.x - 0.5) * 40 * 0.5
      const parallaxY = (mouse.current.y - 0.5) * 20 * 0.5
      const x = planet.x + (disableParallax ? 0 : parallaxX)
      const y = planet.y + (disableParallax ? 0 : parallaxY)
      
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        ctx.beginPath()
        ctx.arc(x, y, planet.radius, 0, 2 * Math.PI)
        ctx.fillStyle = planet.color
        ctx.globalAlpha = 0.3
        ctx.fill()
        ctx.globalAlpha = 1
      }
      
      planet.x += planet.speed * 0.5
      if (planet.x > width + planet.radius) planet.x = -planet.radius
    }
    
    // Render comets
    for (const comet of comets.current) {
      comet.x += comet.vx
      comet.y += comet.vy
      comet.life -= 0.005
      
      if (comet.life <= 0 || comet.x < -100 || comet.x > width + 100 || comet.y < -100 || comet.y > height + 100) {
        comet.x = Math.random() * width
        comet.y = Math.random() * height
        comet.vx = randomBetween(-2, -0.5)
        comet.vy = randomBetween(-1, 1)
        comet.life = 1
        comet.tail = []
      }
      
      // Update tail
      comet.tail.unshift({ x: comet.x, y: comet.y })
      if (comet.tail.length > 20) comet.tail.pop()
      
      // Only render if comet is visible or close to viewport
      if (comet.x > -50 && comet.x < width + 50 && comet.y > -50 && comet.y < height + 50) {
        ctx.save()
        
        // Draw smooth tail with gradient
        if (comet.tail.length > 1) {
          ctx.globalAlpha = comet.life * 0.8
          for (let i = 0; i < comet.tail.length - 1; i++) {
            const point = comet.tail[i]
            const nextPoint = comet.tail[i + 1]
            const alpha = (1 - i / comet.tail.length) * comet.life * 0.8
            
            const gradient = ctx.createLinearGradient(point.x, point.y, nextPoint.x, nextPoint.y)
            gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
            gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.5})`)
            
            ctx.strokeStyle = gradient
            ctx.lineWidth = Math.max(1, 3 * (1 - i / comet.tail.length))
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
            ctx.lineTo(nextPoint.x, nextPoint.y)
            ctx.stroke()
          }
        }
        
        // Draw comet head with glow
        const headGlow = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 8)
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${comet.life})`)
        headGlow.addColorStop(0.5, `rgba(255, 255, 255, ${comet.life * 0.5})`)
        headGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.fillStyle = headGlow
        ctx.beginPath()
        ctx.arc(comet.x, comet.y, 8, 0, 2 * Math.PI)
        ctx.fill()
        
        // Draw main head
        ctx.beginPath()
        ctx.arc(comet.x, comet.y, 3, 0, 2 * Math.PI)
        ctx.fillStyle = '#ffffff'
        ctx.globalAlpha = comet.life
        ctx.fill()
        
        ctx.restore()
      }
    }
    
    // Render moon
    const moonX = width * 0.15
    const moonY = height * 0.2
    const moonRadius = 30
    
    // Moon glow
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonRadius * 2)
    moonGlow.addColorStop(0, 'rgba(255, 255, 200, 0.3)')
    moonGlow.addColorStop(0.5, 'rgba(255, 255, 200, 0.1)')
    moonGlow.addColorStop(1, 'rgba(255, 255, 200, 0)')
    ctx.fillStyle = moonGlow
    ctx.fillRect(moonX - moonRadius * 2, moonY - moonRadius * 2, moonRadius * 4, moonRadius * 4)
    
    // Moon body
    ctx.beginPath()
    ctx.arc(moonX, moonY, moonRadius, 0, 2 * Math.PI)
    ctx.fillStyle = '#F5F5DC'
    ctx.fill()
    
    // Moon craters
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.beginPath()
    ctx.arc(moonX - 8, moonY - 5, 3, 0, 2 * Math.PI)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(moonX + 5, moonY + 8, 2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(moonX - 3, moonY + 10, 1.5, 0, 2 * Math.PI)
    ctx.fill()
    
    // Render stars last (foreground)
    for (const star of stars.current) {
      const parallaxX = (mouse.current.x - 0.5) * 60 * (1 - star.depth)
      const parallaxY = (mouse.current.y - 0.5) * 30 * (1 - star.depth)
      const x = star.x + (disableParallax ? 0 : parallaxX)
      const y = star.y + (disableParallax ? 0 : parallaxY)
      
      // Only render stars that are fully visible
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        ctx.beginPath()
        ctx.arc(x, y, star.r, 0, 2 * Math.PI)
        ctx.fillStyle = star.color
        ctx.globalAlpha = 0.4 + 0.3 * star.depth
        ctx.fill()
        ctx.globalAlpha = 1
      }
      
      star.x += star.speed * star.depth
      if (star.x > width + 20) star.x = -20
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }, [disableParallax])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height
    
    createStars(width, height)
    createNebulae(width, height)
    createPlanets(width, height)
    createComets(width, height)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      createStars(width, height)
      createNebulae(width, height)
      createPlanets(width, height)
      createComets(width, height)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const handleMouseMove = (e: MouseEvent) => {
      if (disableParallax) return
      mouse.current.x = e.clientX / width
      mouse.current.y = e.clientY / height
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [createStars, createNebulae, createPlanets, createComets, animate])

  return (
    <canvas
      ref={canvasRef}
      className={styles.starfieldBackground}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  )
})

StarfieldBackground.displayName = 'StarfieldBackground'

export default StarfieldBackground 