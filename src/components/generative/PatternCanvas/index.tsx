import { useRef, useEffect } from 'react'
import styles from './styles.module.css'
import { InfiniteGenerator, type CosmicSettings } from './InfiniteGenerator'

interface PatternCanvasProps {
  isPaused?: boolean
  settings?: CosmicSettings
}
const PatternCanvas = ({ isPaused = false, settings }: PatternCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const generatorRef = useRef<InfiniteGenerator | null>(null)
  const settingsRef = useRef(settings)
  const clockRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let width = 0
    let height = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (
        !rect.width ||
        !rect.height ||
        (width === rect.width && height === rect.height)
      )
        return
      width = rect.width
      height = rect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const generator = new InfiniteGenerator(context, width, height)
      if (settingsRef.current) generator.updateSettings(settingsRef.current)
      generatorRef.current = generator
      generator.render(clockRef.current)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => {
      observer.disconnect()
      generatorRef.current = null
    }
  }, [])

  useEffect(() => {
    settingsRef.current = settings
    if (settings) generatorRef.current?.updateSettings(settings)
    generatorRef.current?.render(clockRef.current)
  }, [settings])

  useEffect(() => {
    let frame: number | undefined
    let previous: number | undefined
    const animate = (timestamp: number) => {
      clockRef.current +=
        previous === undefined ? 0 : Math.min(timestamp - previous, 100)
      previous = timestamp
      generatorRef.current?.render(clockRef.current)
      frame = requestAnimationFrame(animate)
    }
    const sync = () => {
      if (frame !== undefined) cancelAnimationFrame(frame)
      frame = undefined
      previous = undefined
      if (!isPaused && !document.hidden) frame = requestAnimationFrame(animate)
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [isPaused])

  return (
    <div className={styles.canvasContainer}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label="Arte generativa em canvas"
        role="img"
      />
    </div>
  )
}
export default PatternCanvas
