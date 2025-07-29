import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import ThemeToggleButton from '@theme/ThemeToggleButton'
import type { Lang } from '@src/i18n'

interface PortfolioNavProps {
  t: any
  lang: Lang
  setLang: (lang: Lang) => void
}

const navItems = [
  { id: 'sobre', labelKey: 'aboutTitle' },
  { id: 'projetos', labelKey: 'projectsTitle' },
  { id: 'demo', labelKey: 'demoTitle' },
  { id: 'contato', labelKey: 'contactTitle' },
]

const PortfolioNav: React.FC<PortfolioNavProps> = ({ t, lang, setLang }) => {
  const [active, setActive] = useState('sobre')

  useEffect(() => {
    const handleScroll = () => {
      let found = 'sobre'
      for (const item of navItems) {
        const el = document.getElementById(item.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) found = item.id
        }
      }
      setActive(found)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) section.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={styles.portfolioNav}>
      <ul className={styles.portfolioNavList}>
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={styles.portfolioNavLink + (active === item.id ? ' ' + styles.active : '')}
              onClick={() => scrollToSection(item.id)}
            >
              {t[item.labelKey] || item.id}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.portfolioNavActions}>
        <button
          className={styles.langToggle}
          onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          aria-label={t.langToggle}
        >
          {t.langToggle}
        </button>
        <ThemeToggleButton />
      </div>
    </nav>
  )
}

export default PortfolioNav 