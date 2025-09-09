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
  { id: 'sobre', labelKey: 'aboutTitle', icon: '👤' },
  { id: 'experiencia', labelKey: 'experienceTitle', icon: '💼' },
  { id: 'educacao', labelKey: 'educationTitle', icon: '🎓' },
  { id: 'contato', labelKey: 'contactTitle', icon: '📧' },
]

const PortfolioNav: React.FC<PortfolioNavProps> = ({ t, lang, setLang }) => {
  const [active, setActive] = useState('sobre')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

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

      // Calculate scroll progress
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <nav className={styles.portfolioNav}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        
        <div className={styles.navContent}>
          <ul className={styles.portfolioNavList}>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`${styles.portfolioNavLink} ${active === item.id ? styles.active : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{t[item.labelKey] || item.id}</span>
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
              {lang === 'pt' ? 'EN' : 'PT'}
            </button>
            <ThemeToggleButton />
          </div>
        </div>
        
        <button 
          className={styles.mobileMenuToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </nav>
      
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <ul className={styles.mobileNavList}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`${styles.mobileNavLink} ${active === item.id ? styles.active : ''}`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabel}>{t[item.labelKey] || item.id}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.mobileActions}>
              <button
                className={styles.mobileLangToggle}
                onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              >
                {lang === 'pt' ? 'English' : 'Português'}
              </button>
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PortfolioNav 