import React from 'react'
import { Star, StarOff } from 'lucide-react'
import styles from './styles.module.css'

interface StarParallaxToggleProps {
  value: boolean
  onChange: (v: boolean) => void
  className?: string
  style?: React.CSSProperties
}

const StarParallaxToggle: React.FC<StarParallaxToggleProps> = React.memo(({ value, onChange, className, style }) => {
  return (
    <button
      className={`${styles.starParallaxToggle} ${value ? styles.starParallaxToggleActive : ''} ${className || ''}`}
      style={style}
      onClick={() => onChange(!value)}
      aria-label={value ? 'Desativar movimento das estrelas' : 'Ativar movimento das estrelas'}
      title={value ? 'Clique para ativar o movimento das estrelas' : 'Clique para parar o movimento das estrelas'}
    >
      {value ? (
        <StarOff size={16} color="var(--color-primary)" />
      ) : (
        <Star size={16} color="var(--color-primary)" />
      )}
    </button>
  )
})

StarParallaxToggle.displayName = 'StarParallaxToggle'

export default StarParallaxToggle 