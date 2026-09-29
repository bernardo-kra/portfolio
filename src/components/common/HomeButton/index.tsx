import React from 'react'
import { useI18n } from '@src/i18n'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '@theme/ThemeContext/useTheme'
import styles from './styles.module.css'

interface HomeButtonProps {
  className?: string
  label?: string
}

const HomeButton: React.FC<HomeButtonProps> = ({ className = '', label }) => {
  const { lang } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()

  const getPageTheme = () => {
    const path = location.pathname

    if (path.includes('/pomodoro')) return 'pomodoro'
    if (path.includes('/generative')) return 'generative'
    if (path.includes('/portfolio')) return 'portfolio'
    if (path === '/') return 'home'
    return 'default'
  }

  const getButtonLabel = () => label ?? (lang === 'pt' ? 'Início' : 'Home')

  const handleClick = () => {
    navigate('/')
  }

  const pageTheme = getPageTheme()

  return (
    <button
      className={`${styles.homeButton} ${styles[`homeButton--${pageTheme}`]} ${styles[`homeButton--${theme}`]} ${className}`}
      onClick={handleClick}
      title={lang === 'pt' ? 'Voltar à página inicial' : 'Back to home'}
    >
      <span className={styles.homeIcon}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      </span>
      <span className={styles.homeLabel}>{getButtonLabel()}</span>
      <span className={styles.arrowIcon}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </span>
    </button>
  )
}

export default HomeButton
