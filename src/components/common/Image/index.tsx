import React from 'react'
import styles from './styles.module.css'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'default' | 'rounded' | 'circle' | 'avatar'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
  lazy?: boolean
}

const Image: React.FC<ImageProps> = ({
  variant = 'default',
  size = 'md',
  responsive = true,
  lazy = true,
  className = '',
  alt = '',
  src,
  ...props
}) => {
  const imageClassName = [
    styles.image,
    styles[`image--${variant}`],
    styles[`image--${size}`],
    responsive && styles['image--responsive'],
    className
  ].filter(Boolean).join(' ')

  return (
    <img
      src={src}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      className={imageClassName}
      {...props}
    />
  )
}

export default Image 