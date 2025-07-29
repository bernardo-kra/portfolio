import React from 'react'
import styles from './styles.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  className?: string
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  href?: string
  target?: string
  rel?: string
  style?: React.CSSProperties
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  href,
  target,
  rel,
  style,
  ...props
}) => {
  const buttonClassName = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth && styles['button--fullWidth'],
    disabled && styles['button--disabled'],
    loading && styles['button--loading'],
    className
  ].filter(Boolean).join(' ')

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className={styles.button__icon}>{icon}</span>
      )}
      <span className={styles.button__text}>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className={styles.button__icon}>{icon}</span>
      )}
      {loading && (
        <span className={styles.button__loader}>
          <div className={styles.button__spinner}></div>
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={buttonClassName}
        style={style}
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={buttonClassName}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      {...props}
    >
      {content}
    </button>
  )
}

export default Button 