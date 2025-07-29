import { createContext, useContext, useState } from 'react'
import type { ReactNode, ReactElement } from 'react'
import pt from './pt'
import en from './en'

export type Lang = 'pt' | 'en'

export type PortfolioI18n = typeof pt & {
  aboutDescriptionLong?: string
  workExperience: {
    title: string
    expandButton: string
    collapseButton: string
    technologiesTitle: string
    achievementsTitle: string
    experiences: Array<{
      id: string
      company: string
      location: string
      role: string
      period: string
      shortDescription: string
      fullDescription: string
      technologies: string[]
      achievements: string[]
      isCurrent?: boolean
    }>
  }
}

const translations: Record<Lang, PortfolioI18n> = { pt, en }

interface I18nContextProps {
  lang: Lang
  setLang: (lang: Lang) => void
  t: PortfolioI18n
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined)

export const I18nProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [lang, setLang] = useState<Lang>('pt')
  const t = translations[lang]
  
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
} 