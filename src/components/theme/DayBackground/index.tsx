import { drawDayScene } from './dayScene'
import React, { useRef, useEffect, useCallback } from 'react'
import styles from './styles.module.css'

const DayBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const animate = useCallback(drawDayScene, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const clouds = Array.from({ length: 12 }, () => ({
      x: Math.random() * width,
      y: 30 + Math.random() * (height * 0.5),
      speed: 0.05 + Math.random() * 0.1,
      size: 60 + Math.random() * 100,
      opacity: 0.6 + Math.random() * 0.3,
    }))

    let animationId: number

    const loop = () => {
      animate(ctx, width, height, clouds)
      animationId = requestAnimationFrame(loop)
    }

    loop()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [animate])

  return (
    <canvas
      ref={canvasRef}
      className={styles.dayBackgroundCanvas}
      aria-hidden="true"
    />
  )
})

export default DayBackground
