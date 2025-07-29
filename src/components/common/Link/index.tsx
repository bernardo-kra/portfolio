import React from 'react'
import Typography from '../Typography'
import styles from './styles.module.css'

interface LinkProps {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'brand' | 'muted'
  external?: boolean
  className?: string
  icon?: React.ReactNode
  underline?: boolean
}

const Link: React.FC<LinkProps> = ({
  href,
  children,
  variant = 'default',
  external = false,
  className = '',
  icon,
  underline = false
}) => {
  const linkClassName = [
    styles.link,
    styles[`link--${variant}`],
    underline && styles['link--underline'],
    className
  ].filter(Boolean).join(' ')

  const target = external ? '_blank' : undefined
  const rel = external ? 'noopener noreferrer' : undefined

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={linkClassName}
    >
      {icon && <span className={styles.link__icon}>{icon}</span>}
      <Typography variant="link" className={styles.link__text}>
        {children}
      </Typography>
      {external && (
        <span className={styles.link__external} aria-label="Abre em nova aba">
          ↗
        </span>
      )}
    </a>
  )
}

export default Link 