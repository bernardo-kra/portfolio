import React, { useState, useEffect } from 'react'
import { Code, Zap, Star, Award } from 'lucide-react'
import styles from './styles.module.css'

interface AdvancedProfilePhotoProps {
  src: string
  alt: string
  className?: string
}

const AdvancedProfilePhoto: React.FC<AdvancedProfilePhotoProps> = ({ 
  src, 
  alt, 
  className = '' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const floatingElements = [
    { icon: Code, delay: 0, position: { top: '20%', left: '10%' } },
    { icon: Zap, delay: 1, position: { top: '30%', right: '15%' } },
    { icon: Star, delay: 2, position: { bottom: '25%', left: '20%' } },
    { icon: Award, delay: 3, position: { bottom: '15%', right: '10%' } }
  ]

  if (hasError) {
    return (
      <div className={`${styles.profileContainer} ${className}`}>
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>👤</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`${styles.profileContainer} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.photoWrapper}>
        <div className={styles.photoFrame}>
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`${styles.profileImage} ${isLoaded ? styles.loaded : ''}`}
          />
          <div className={styles.photoOverlay} />
        </div>
        
        <div className={styles.glowEffect} />
        <div className={styles.ringEffect} />
        
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className={styles.floatingElement}
            style={{
              ...element.position,
              animationDelay: `${element.delay}s`
            }}
          >
            <element.icon size={20} />
          </div>
        ))}
        
        <div 
          className={styles.mouseFollower}
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            opacity: isHovered ? 1 : 0
          }}
        />
      </div>
      
    </div>
  )
}

export default AdvancedProfilePhoto
