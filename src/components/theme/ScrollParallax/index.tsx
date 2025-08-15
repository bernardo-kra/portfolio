import React, { useRef, useEffect, useState } from 'react'
import styles from './styles.module.css'

interface ScrollParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
  style?: React.CSSProperties
}

const ScrollParallax: React.FC<ScrollParallaxProps> = ({ 
  children, 
  speed = 0.5, 
  className = '', 
  style 
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return
      
      const rect = elementRef.current.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const rate = scrolled * -speed
      
      setOffset(rate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={elementRef}
      className={`${styles.scrollParallax} ${className}`}
      style={{
        ...style,
        transform: `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  )
}

export default ScrollParallax
