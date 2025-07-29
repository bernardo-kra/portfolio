import React from 'react'
import styles from './styles.module.css'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const Container = React.memo(function Container({ 
  children, 
  className = '', 
  style,
  ...props 
}: ContainerProps) {
  const containerClassName = [styles.container, className].filter(Boolean).join(' ')
  
  return (
    <div className={containerClassName} style={style} {...props}>
      {children}
    </div>
  )
})

export default Container