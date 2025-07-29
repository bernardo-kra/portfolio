import React from 'react'
import styles from './styles.module.css'

type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled'
type CardSize = 'sm' | 'md' | 'lg'

interface CardProps {
  variant?: CardVariant
  size?: CardSize
  children: React.ReactNode
  className?: string
  padding?: boolean
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  padding = true,
  hover = false,
  clickable = false,
  onClick,
  style,
  ...props
}) => {
  const cardClassName = [
    styles.card,
    styles[`card--${variant}`],
    styles[`card--${size}`],
    padding && styles['card--padding'],
    hover && styles['card--hover'],
    clickable && styles['card--clickable'],
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClassName}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card 