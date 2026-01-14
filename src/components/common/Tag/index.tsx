import React from 'react'
import Typography from '../Typography'
import styles from './styles.module.css'

interface TagProps {
  children: React.ReactNode
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  clickable?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  clickable = false,
  onClick,
  className = '',
  style
}) => {
  const tagClassName = [
    styles.tag,
    styles[`tag--${variant}`],
    styles[`tag--${size}`],
    clickable && styles['tag--clickable'],
    className
  ].filter(Boolean).join(' ')

  const handleClick = () => {
    if (clickable && onClick) {
      onClick()
    }
  }

  return (
    <div
      className={tagClassName}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      style={style}
    >
      {icon && <span className={styles.tag__icon}>{icon}</span>}
      <Typography variant="caption" className={styles.tag__text}>
        {children}
      </Typography>
    </div>
  )
}

export default Tag 