import React, { useRef, useEffect, useCallback } from 'react'
import styles from './styles.module.css'

const STAR_COUNT = 120
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

interface StarfieldBackgroundProps {
  disableParallax?: boolean
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = React.memo(({ disableParallax = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const stars = useRef<{ x: number; y: number; r: number; speed: number; color: string; depth: number }[]>([])
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

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)
    
    for (const star of stars.current) {
      const parallaxX = (mouse.current.x - 0.5) * 60 * (1 - star.depth)
      const parallaxY = (mouse.current.y - 0.5) * 30 * (1 - star.depth)
      const x = star.x + (disableParallax ? 0 : parallaxX)
      const y = star.y + (disableParallax ? 0 : parallaxY)
      
      ctx.beginPath()
      ctx.arc(x, y, star.r, 0, 2 * Math.PI)
      ctx.fillStyle = star.color
      ctx.globalAlpha = 0.6 + 0.4 * star.depth
      ctx.fill()
      ctx.globalAlpha = 1
      
      star.x += star.speed * star.depth
      if (star.x > width + 10) star.x = -10
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

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      createStars(width, height)
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
  }, [createStars, animate])

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