import React from 'react'
import { useI18n } from '@src/i18n'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../ThemeContext/useTheme'
import styles from './styles.module.css'

const ThemeToggleButton: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => {
  const { theme, toggleTheme } = useTheme()
  const { lang } = useI18n()
  const label =
    lang === 'pt'
      ? theme === 'dark'
        ? 'Mudar para tema claro'
        : 'Mudar para tema escuro'
      : theme === 'dark'
        ? 'Switch to light theme'
        : 'Switch to dark theme'

  return (
    <button
      className={styles.themeToggleButton}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      style={style}
    >
      {theme === 'dark' ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
    </button>
  )
}

export default ThemeToggleButton
