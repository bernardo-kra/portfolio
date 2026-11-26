import React from 'react'
import styles from './styles.module.css'

type SectionHeadingProps = {
  index: string
  eyebrow: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'start' | 'center'
  id?: string
  className?: string
  children?: React.ReactNode
}

/** Numbered editorial heading shared by the portfolio sections. */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = 'start',
  id,
  className = '',
  children,
}: SectionHeadingProps) {
  return (
    <header className={`${styles.heading} ${className}`} data-align={align}>
      <p className={styles.eyebrow}>
        <span>{index}</span>
        {eyebrow}
      </p>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </header>
  )
}
