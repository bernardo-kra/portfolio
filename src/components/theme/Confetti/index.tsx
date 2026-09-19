import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles.module.css'

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

interface ConfettiPiece {
  id: number
  x: number
  y: number
  color: string
  delay: number
}

const colors = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
]

const Confetti: React.FC<ConfettiProps> = ({ trigger, onComplete }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(false)

  const createConfetti = useCallback(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5
    }))

    setPieces(newPieces)

    setTimeout(() => {
      setIsActive(false)
      setPieces([])
      onComplete?.()
    }, 3000)
  }, [onComplete])

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      createConfetti()
    }
  }, [trigger, isActive, createConfetti])

  if (!isActive) return null

  return (
    <div className={styles.confettiContainer}>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`${styles.confettiPiece} confetti-piece`}
          style={{
            left: piece.x,
            top: piece.y,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
