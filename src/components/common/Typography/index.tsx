import React from 'react'
import styles from './styles.module.css'

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'button'
  | 'link'

type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'

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
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={typographyClassName} style={style} {...props}>
      {children}
    </Component>
  )
}

const defaultElements: Record<TypographyVariant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'p',
  overline: 'p',
  button: 'p',
  link: 'p',
}
const getDefaultElement = (variant: TypographyVariant): React.ElementType =>
  Object.hasOwn(defaultElements, variant) ? defaultElements[variant] : 'p'

export default Typography
