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

    const element = elementRef.current
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
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
