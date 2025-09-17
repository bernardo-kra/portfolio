import React, { useState } from 'react'
import styles from './styles.module.css'

interface ProfilePhotoProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'hero' | 'card'
  className?: string
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ 
  src, 
  alt, 
  size = 'lg', 
  variant = 'default',
  className = '' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)


  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={`${styles.profilePhoto} ${styles[size]} ${styles[variant]} ${className}`}>
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>👤</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.profilePhoto} ${styles[size]} ${styles[variant]} ${className}`}>
      <div className={styles.photoContainer}>
        <div className={styles.photoFrame}>
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`${styles.photoImage} ${isLoaded ? styles.loaded : ''}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          <div className={styles.photoOverlay} />
        </div>
        <div className={styles.photoGlow} />
        <div className={styles.photoParticles}>
          <div className={styles.particle} />
          <div className={styles.particle} />
          <div className={styles.particle} />
          <div className={styles.particle} />
        </div>
      </div>
    </div>
  )
}

export default ProfilePhoto
