import React from 'react'
import styles from './styles.module.css'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'var(--color-primary)', 
  className = '' 
}) => {
  const sizeClass = styles[`spinner--${size}`]
  
  return (
    <div className={`${styles.spinner} ${sizeClass} ${className}`}>
      <div 
        className={styles.spinnerRing} 
        style={{ borderColor: `${color} transparent transparent transparent` }}
      />
    </div>
  )
}

export default LoadingSpinner
