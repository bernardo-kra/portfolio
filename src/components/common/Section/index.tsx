import React from 'react'
import styles from './styles.module.css'

type SectionVariant = 'default' | 'hero' | 'content' | 'footer'
type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface SectionProps {
  variant?: SectionVariant
  spacing?: SectionSpacing
  children: React.ReactNode
  className?: string
  id?: string
  background?: 'default' | 'muted' | 'brand' | 'gradient'
  container?: boolean
  style?: React.CSSProperties
}

const Section: React.FC<SectionProps> = ({
  variant = 'default',
  spacing = 'lg',
  children,
  className = '',
  id,
  background = 'default',
  container = true,
  style,
  ...props
}) => {
  const sectionClassName = [
    styles.section,
    styles[`section--${variant}`],
    styles[`section--${spacing}`],
    styles[`section--${background}`],
    className
  ].filter(Boolean).join(' ')

  const content = container ? (
    <div className={styles.section__container}>
      {children}
    </div>
  ) : children

  return (
    <section
      id={id}
      className={sectionClassName}
      style={style}
      {...props}
    >
      {content}
    </section>
  )
}

export default Section 