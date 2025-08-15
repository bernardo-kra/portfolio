import React, { useRef, useEffect, useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

interface ScrollAnimationProps {
  children: React.ReactNode
  animation?: 'fade-in' | 'slide-left' | 'slide-right' | 'scale' | 'rotate'
  delay?: number
  className?: string
  style?: React.CSSProperties
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ 
  children, 
  animation = 'fade-in',
  delay = 0,
  className = '',
  style 
}) => {
  const { elementRef, isVisible } = useScrollAnimation()
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShouldAnimate(true), delay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, delay])

  const getAnimationClass = () => {
    const baseClass = `scroll-${animation.replace('-', '-')}`
    return shouldAnimate ? `${baseClass} visible` : baseClass
  }

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

export default ScrollAnimation
