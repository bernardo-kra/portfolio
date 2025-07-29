import { createContext } from 'react'
import { type Theme } from '@theme/themeUtils'

export const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
  setThemeWithTransition?: (theme: Theme) => void
  registerThemeTransitionCallback?: (cb: (theme: Theme) => void) => void
} | undefined>(undefined) 