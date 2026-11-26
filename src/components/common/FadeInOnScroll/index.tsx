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
  threshold = 0.1,
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let timeout = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reveal once; re-hiding on scroll back reads as flicker.
          observer.disconnect()
          timeout = window.setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )

    const element = elementRef.current
    if (element) observer.observe(element)

    return () => {
      observer.disconnect()
      window.clearTimeout(timeout)
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
