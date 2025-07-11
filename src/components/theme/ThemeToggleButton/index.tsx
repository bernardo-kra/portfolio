import React from 'react';
import { Sun, Moon } from 'lucide-react';
import styles from './styles.module.css';
import { useTheme } from '@theme/ThemeContext';

interface ThemeToggleButtonProps {
  style?: React.CSSProperties;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = React.memo(({ style }) => {
  const { theme, setThemeWithTransition } = useTheme();
  return (
    <button
      className={styles.themeToggleButton}
      style={style}
      onClick={() => setThemeWithTransition && setThemeWithTransition(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      {theme === 'dark' ? (
        <Sun size={16} color="#ffd700" />
      ) : (
        <Moon size={16} color="var(--gray-900)" />
      )}
    </button>
  );
});

export default ThemeToggleButton; 