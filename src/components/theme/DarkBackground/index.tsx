import React, { useRef, useEffect } from 'react'
import styles from './styles.module.css'

const DarkBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const grad = ctx.createLinearGradient(0, 0, 0, height)
      grad.addColorStop(0, '#23263a')
      grad.addColorStop(1, '#181f2e')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)
    }
    
    draw()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      draw()
    }
    
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={styles.darkBackgroundCanvas}
      aria-hidden="true"
    />
  )
})

export default DarkBackground 