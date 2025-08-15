import React, { createContext, useContext, useState, useEffect } from 'react'

interface BackgroundTransparencyContextType {
  isTransparent: boolean
  toggleTransparency: () => void
  setTransparency: (value: boolean) => void
}

const BackgroundTransparencyContext = createContext<BackgroundTransparencyContextType | undefined>(undefined)

const STORAGE_KEY = 'background-transparency'

export const BackgroundTransparencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransparent, setIsTransparent] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setIsTransparent(saved === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isTransparent))
    document.documentElement.setAttribute('data-background-transparent', String(isTransparent))
  }, [isTransparent])

  const toggleTransparency = () => setIsTransparent(!isTransparent)
  const setTransparency = (value: boolean) => setIsTransparent(value)

  return (
    <BackgroundTransparencyContext.Provider value={{ isTransparent, toggleTransparency, setTransparency }}>
      {children}
    </BackgroundTransparencyContext.Provider>
  )
}

export const useBackgroundTransparency = () => {
  const context = useContext(BackgroundTransparencyContext)
  if (!context) {
    throw new Error('useBackgroundTransparency must be used within BackgroundTransparencyProvider')
  }
  return context
}
