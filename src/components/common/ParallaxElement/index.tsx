import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'

interface ParallaxElementProps {
  children: React.ReactNode
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
  disabled?: boolean
}

const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
  disabled = false
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (disabled) return

    const handleScroll = () => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height
      
      const scrolled = window.scrollY
      const rate = scrolled * speed
      
      let newOffset = 0
      switch (direction) {
        case 'up':
          newOffset = rate
          break
        case 'down':
          newOffset = -rate
          break
        case 'left':
          newOffset = rate
          break
        case 'right':
          newOffset = -rate
          break
      }
      
      setOffset(newOffset)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, direction, disabled])

  const transformStyle = disabled ? {} : {
    transform: direction === 'left' || direction === 'right' 
      ? `translateX(${offset}px)` 
      : `translateY(${offset}px)`
  }

  return (
    <div 
      ref={elementRef}
      className={`${styles.parallaxElement} ${className}`}
      style={transformStyle}
    >
      {children}
    </div>
  )
}

export default ParallaxElement
