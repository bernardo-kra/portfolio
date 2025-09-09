import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'

interface FadeInOnScrollProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  threshold?: number
}

const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.1
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [delay, threshold])

  return (
    <div
      ref={elementRef}
      className={`${styles.fadeInOnScroll} ${isVisible ? styles.visible : ''} ${className}`}
      style={{ '--duration': `${duration}s` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export default FadeInOnScroll
