import React, { useRef, useEffect } from 'react'
import styles from './styles.module.css'
import { InfiniteGenerator } from './InfiniteGenerator'
import { CosmicSettings } from './types'

interface PatternCanvasProps {
  pauseGeneration?: boolean
  settings?: CosmicSettings
}

const PatternCanvas: React.FC<PatternCanvasProps> = ({ pauseGeneration = false, settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const generatorRef = useRef<InfiniteGenerator | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    generatorRef.current = new InfiniteGenerator(ctx, canvas.width, canvas.height)

    const animate = (timestamp: number) => {
      if (generatorRef.current) {
        generatorRef.current.render(timestamp, pauseGeneration)
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [pauseGeneration])

  useEffect(() => {
    if (generatorRef.current && settings) {
      generatorRef.current.updateSettings(settings)
    }
  }, [settings])

  return (
    <div className={styles.canvasContainer}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
      />
    </div>
  )
}

export default PatternCanvas