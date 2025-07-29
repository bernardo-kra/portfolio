import React from 'react'
import styles from './styles.module.css'

type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body1' | 'body2' | 'caption' | 'overline'
  | 'button' | 'link'

type TypographyColor = 
  | 'primary' | 'secondary' | 'muted' | 'brand' | 'success' | 'warning' | 'error'

interface TypographyProps {
  variant?: TypographyVariant
  color?: TypographyColor
  children: React.ReactNode
  className?: string
  as?: React.ElementType
  align?: 'left' | 'center' | 'right' | 'justify'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  truncate?: boolean
  noWrap?: boolean
  style?: React.CSSProperties
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'primary',
  children,
  className = '',
  as,
  align = 'left',
  weight,
  size,
  truncate = false,
  noWrap = false,
  style,
  ...props
}) => {
  const Component = as || getDefaultElement(variant)
  
  const typographyClassName = [
    styles.typography,
    styles[`typography--${variant}`],
    styles[`typography--${color}`],
    styles[`typography--${align}`],
    weight && styles[`typography--${weight}`],
    size && styles[`typography--${size}`],
    truncate && styles['typography--truncate'],
    noWrap && styles['typography--nowrap'],
    className
  ].filter(Boolean).join(' ')

  return (
    <Component 
      className={typographyClassName}
      style={style}
      {...props}
    >
      {children}
    </Component>
  )
}

const getDefaultElement = (variant: TypographyVariant): React.ElementType => {
  switch (variant) {
    case 'h1': return 'h1'
    case 'h2': return 'h2'
    case 'h3': return 'h3'
    case 'h4': return 'h4'
    case 'h5': return 'h5'
    case 'h6': return 'h6'
    case 'body1':
    case 'body2':
    case 'caption':
    case 'overline':
    case 'button':
    case 'link':
    default:
      return 'p'
  }
}

export default Typography 