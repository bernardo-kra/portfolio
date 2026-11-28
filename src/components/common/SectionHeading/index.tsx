import React, { lazy, Suspense } from 'react'
import styles from './styles.module.css'

// React Bits BlurText, loaded on demand so `motion` stays out of shared bundles.
const BlurText = lazy(() => import('@components/reactbits/BlurText/BlurText'))

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
        {typeof title === 'string' ? (
          <Suspense fallback={title}>
            <BlurText
              key={title}
              text={title}
              animateBy="words"
              direction="bottom"
              delay={90}
              stepDuration={0.35}
            />
          </Suspense>
        ) : (
          title
        )}
      </h2>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </header>
  )
}
