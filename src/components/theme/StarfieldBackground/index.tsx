import type { Nebula, Planet, Comet } from './sceneTypes'
import { drawNebula } from './nebulaScene'
import { drawPlanet, drawMoon, drawStar } from './celestialScene'
import { drawComet } from './cometScene'
import React, { useRef, useEffect, useCallback } from 'react'
import styles from './styles.module.css'

const STAR_COUNT = 150
const NEBULA_COUNT = 3
const PLANET_COUNT = 1
const COMET_COUNT = 0
const getStarColors = () => [
  getComputedStyle(document.documentElement)
    .getPropertyValue('--star-color-1')
    .trim() || '#fff',
  getComputedStyle(document.documentElement)
    .getPropertyValue('--star-color-2')
    .trim() || '#bfcfff',
  getComputedStyle(document.documentElement)
    .getPropertyValue('--star-color-3')
    .trim() || '#e6e9ff',
  getComputedStyle(document.documentElement)
    .getPropertyValue('--star-color-4')
    .trim() || '#cfd8ff',
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

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = React.memo(
  ({ disableParallax = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const stars = useRef<
      {
        x: number
        y: number
        r: number
        speed: number
        color: string
        depth: number
      }[]
    >([])
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
          color:
            getStarColors()[Math.floor(Math.random() * getStarColors().length)],
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
        speed: randomBetween(0.005, 0.015),
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
        phase: Math.random() * Math.PI * 2,
      }))
    }, [])

    const createComets = useCallback((w: number, h: number) => {
      comets.current = Array.from({ length: COMET_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: randomBetween(-2, -0.5),
        vy: randomBetween(-1, 1),
        tail: [],
        life: 1,
      }))
    }, [])

    const animate = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const width = canvas.width
      const height = canvas.height

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      ctx.clearRect(0, 0, width, height)

      const frame = {
        ctx,
        width,
        height,
        mouse: mouse.current,
        disableParallax,
      }
      for (const nebula of nebulae.current) drawNebula(frame, nebula)
      for (const planet of planets.current) drawPlanet(frame, planet)
      for (const comet of comets.current) drawComet(frame, comet)
      drawMoon(frame)
      for (const star of stars.current) drawStar(frame, star)

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
    }, [
      createStars,
      createNebulae,
      createPlanets,
      createComets,
      animate,
      disableParallax,
    ])

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
  }
)

StarfieldBackground.displayName = 'StarfieldBackground'

export default StarfieldBackground
