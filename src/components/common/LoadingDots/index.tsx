import React from 'react'
import styles from './styles.module.css'

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'accent' | 'muted'
  className?: string
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  return (
    <div className={`${styles.loadingDots} ${styles[`loadingDots--${size}`]} ${styles[`loadingDots--${color}`]} ${className}`}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  )
}

export default LoadingDots
