import React, { useEffect, useState, useRef, useCallback } from 'react'
import { THEME_KEY, type Theme } from '@theme/themeUtils'
import { ThemeContext } from '../ThemeContextDef'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })
  const themeTransitionCallback = useRef<((theme: Theme) => void) | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* Theme works without persistent storage. */
    }
  }, [theme])

  const setThemeWithTransition = (newTheme: Theme) => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      themeTransitionCallback.current?.(newTheme)
    setTheme(newTheme)
  }

  const toggleTheme = () =>
    setThemeWithTransition(theme === 'dark' ? 'light' : 'dark')

  const registerThemeTransitionCallback = useCallback(
    (cb: (theme: Theme) => void) => {
      themeTransitionCallback.current = cb
    },
    []
  )

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setThemeWithTransition,
        registerThemeTransitionCallback,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
