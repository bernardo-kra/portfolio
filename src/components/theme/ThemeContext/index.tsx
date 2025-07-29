import React, { useEffect, useState, useRef } from 'react'
import { THEME_KEY, type Theme } from '@theme/themeUtils'
import { ThemeContext } from '../ThemeContextDef'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark')
  const themeTransitionCallback = useRef<((theme: Theme) => void) | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const setThemeWithTransition = (newTheme: Theme) => {
    if (themeTransitionCallback.current) {
      themeTransitionCallback.current(newTheme)
      setTimeout(() => setTheme(newTheme), 1800)
    } else {
      setTheme(newTheme)
    }
  }

  const toggleTheme = () => setThemeWithTransition(theme === 'dark' ? 'light' : 'dark')
  
  const registerThemeTransitionCallback = (cb: (theme: Theme) => void) => {
    themeTransitionCallback.current = cb
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeWithTransition, registerThemeTransitionCallback }}>
      {children}
    </ThemeContext.Provider>
  )
} 