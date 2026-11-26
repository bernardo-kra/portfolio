import type { CSSProperties, ReactNode } from 'react'
import shared from '../shared.module.css'
import { useSeenOnce } from './useSeenOnce'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

const Reveal = ({ children, className = '', delay = 0 }: RevealProps) => {
  const [ref, seen] = useSeenOnce<HTMLDivElement>()
  const style = delay
    ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties)
    : undefined

  return (
    <div
      ref={ref}
      className={`${shared.reveal} ${className}`}
      data-shown={seen}
      style={style}
    >
      {children}
    </div>
  )
}

export default Reveal
