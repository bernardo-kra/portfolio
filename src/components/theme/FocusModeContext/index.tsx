import React, { createContext, useContext, useState, useEffect } from 'react'

interface FocusModeContextType {
  isFocusMode: boolean
  toggleFocusMode: () => void
  setFocusMode: (value: boolean) => void
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined)

const STORAGE_KEY = 'focus-mode'

export const FocusModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFocusMode, setIsFocusMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setIsFocusMode(saved === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isFocusMode))
    document.documentElement.setAttribute('data-focus-mode', String(isFocusMode))
  }, [isFocusMode])

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode)
  }
  
  const setFocusMode = (value: boolean) => {
    setIsFocusMode(value)
  }

  return (
    <FocusModeContext.Provider value={{ isFocusMode, toggleFocusMode, setFocusMode }}>
      {children}
    </FocusModeContext.Provider>
  )
}

export const useFocusMode = () => {
  const context = useContext(FocusModeContext)
  if (!context) {
    throw new Error('useFocusMode must be used within FocusModeProvider')
  }
  return context
}
