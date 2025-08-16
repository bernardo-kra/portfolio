import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

interface BackButtonProps {
  to?: string
  label?: string
  className?: string
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to = '/portfolio', 
  label = '← Voltar ao Portfólio',
  className = ''
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to === 'back') {
      navigate(-1)
    } else {
      navigate(to)
    }
  }

  return (
    <button 
      className={`${styles.backButton} ${className}`}
      onClick={handleClick}
    >
      <span className={styles.backIcon}>←</span>
      <span className={styles.backLabel}>{label}</span>
    </button>
  )
}

export default BackButton
