import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../ThemeContext/useTheme'
import styles from './styles.module.css'

const ANIMATION_DURATION = 450

const TransitionThemeEffect: React.FC = React.memo(() => {
  const { registerThemeTransitionCallback } = useTheme()
  const [show, setShow] = useState(false)
  const [direction, setDirection] = useState<'to-dark' | 'to-light'>('to-dark')
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!registerThemeTransitionCallback) return
    const hide = () => setShow(false)
    registerThemeTransitionCallback((newTheme) => {
      setDirection(newTheme === 'dark' ? 'to-dark' : 'to-light')
      setShow(true)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(hide, ANIMATION_DURATION)
    })
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [registerThemeTransitionCallback])

  return show ? (
    <div
      className={
        styles.transitionOverlay +
        ' ' +
        (direction === 'to-dark' ? styles.toDark : styles.toLight)
      }
      style={{ animationDuration: ANIMATION_DURATION + 'ms' }}
      aria-hidden="true"
    />
  ) : null
})

export default TransitionThemeEffect
