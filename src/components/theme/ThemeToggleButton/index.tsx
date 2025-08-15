import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../ThemeContext/useTheme'
import styles from './styles.module.css'

const ThemeToggleButton: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className={styles.themeToggleButton}
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={theme === 'dark' ? 'Clique para ativar o tema claro' : 'Clique para ativar o tema escuro'}
      style={style}
    >
      {theme === 'dark' ? (
        <Sun size={16} color="var(--color-primary)" />
      ) : (
        <Moon size={16} color="var(--color-primary)" />
      )}
    </button>
  )
}

export default ThemeToggleButton 