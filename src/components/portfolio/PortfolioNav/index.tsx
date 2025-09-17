import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import ThemeToggleButton from '@theme/ThemeToggleButton'
import { useAuth } from '@src/hooks/useAuth'
import { useAppConfig } from '@context'
import { SimpleAuthModal } from '@components/auth/SimpleAuthModal'
import { FloatingChatButton } from '@components/chat'
import { NotificationCenter } from '@components/notifications'
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
  const navigate = useNavigate()
  const [active, setActive] = useState('sobre')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const { user, login, logout, isAuthenticated } = useAuth()
  const { isFeatureEnabled, config } = useAppConfig()

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

      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)

      if (scrollTop > 100) {
        setShowUserDropdown(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(`.${styles.userDropdown}`) && !target.closest(`.${styles.userInfo}`)) {
        setShowUserDropdown(false)
      }
    }

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserDropdown])

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
            {!isAuthenticated && isFeatureEnabled('authentication') && config.ui.showAuthButton && (
              <button
                className={styles.loginBtn}
                onClick={() => setIsAuthModalOpen(true)}
              >
                Login
              </button>
            )}
            {isAuthenticated && (
              <div className={styles.userInfo}>
                <button 
                  className={styles.userButton}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <span className={styles.userName}>Olá, {user?.firstName}</span>
                  <span className={`${styles.dropdownArrow} ${showUserDropdown ? styles.open : ''}`}>▼</span>
                </button>
                
                {showUserDropdown && (
                  <div className={styles.userDropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownUserInfo}>
                        <div className={styles.dropdownDetails}>
                          <span className={styles.dropdownName}>
                            {user?.firstName} {user?.lastName}
                          </span>
                          <span className={styles.dropdownEmail}>
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.dropdownDivider}></div>
                    
                    <div className={styles.dropdownMenu}>
                      <button 
                        className={styles.dropdownItem}
                        onClick={() => {
                          setShowUserDropdown(false)
                        }}
                      >
                        <span className={styles.dropdownIcon}>👤</span>
                        Meu Perfil
                      </button>
                      
                 <button
                   className={styles.dropdownItem}
                   onClick={() => {
                     setShowUserDropdown(false)
                   }}
                 >
                   <span className={styles.dropdownIcon}>⚙️</span>
                   Configurações
                 </button>

                 {user?.role === 'admin' && (
                   <button
                     className={styles.dropdownItem}
                     onClick={() => {
                       setShowUserDropdown(false)
                       navigate('/admin/chat')
                     }}
                   >
                     <span className={styles.dropdownIcon}>💬</span>
                     Admin Chat
                   </button>
                 )}
                      
                      <div className={styles.dropdownDivider}></div>
                      
                      <button 
                        className={styles.dropdownItem}
                        onClick={() => {
                          logout()
                          setShowUserDropdown(false)
                        }}
                      >
                        <span className={styles.dropdownIcon}>🚪</span>
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
                        {isAuthenticated && <NotificationCenter />}
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

      <SimpleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => {
          login(userData);
          setIsAuthModalOpen(false);
        }}
      />

      <FloatingChatButton />
    </>
  )
}

export default PortfolioNav 