import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import ThemeToggleButton from '@theme/ThemeToggleButton'
import { useAuth } from '@src/hooks/useAuth'
import { useAppConfig } from '@context'
import { SimpleAuthModal } from '@components/auth/SimpleAuthModal'
import { FloatingChatButton } from '@components/chat'
import { NotificationCenter } from '@components/notifications'
import type { Lang, PortfolioI18n } from '@src/i18n'

interface PortfolioNavProps {
  t: PortfolioI18n
  lang: Lang
  setLang: (lang: Lang) => void
}

type NavLabelKey =
  | 'aboutTitle'
  | 'experienceTitle'
  | 'educationTitle'
  | 'contactTitle'
  | 'projectsTitle'
type RenderPortfolioAccountTriggerProps = {
  setShowUserDropdown: React.Dispatch<React.SetStateAction<boolean>>
  showUserDropdown: boolean
  lang: Lang
  user: import('../../../hooks/useAuth').AuthUser | null
  navigate: import('react-router-dom').NavigateFunction
  logout: () => void
}

function renderPortfolioAccountTrigger({
  setShowUserDropdown,
  showUserDropdown,
  lang,
  user,
  navigate,
  logout,
}: RenderPortfolioAccountTriggerProps) {
  return (
    <div className={styles.userInfo}>
      <button
        className={styles.userButton}
        onClick={() => setShowUserDropdown(!showUserDropdown)}
      >
        <span className={styles.userName}>
          {lang === 'pt' ? 'Olá' : 'Hello'}, {user?.firstName}
        </span>
        <span
          className={`${styles.dropdownArrow} ${showUserDropdown ? styles.open : ''}`}
        >
          ▼
        </span>
      </button>

      {renderPortfolioAccountMenu({
        showUserDropdown,
        user,
        setShowUserDropdown,
        lang,
        navigate,
        logout,
      })}
    </div>
  )
}

type ObservePortfolioSectionsProps = {
  setActive: React.Dispatch<React.SetStateAction<string>>
  setScrollProgress: React.Dispatch<React.SetStateAction<number>>
  setShowUserDropdown: React.Dispatch<React.SetStateAction<boolean>>
}

function observePortfolioSections({
  setActive,
  setScrollProgress,
  setShowUserDropdown,
}: ObservePortfolioSectionsProps) {
  const handleScroll = () => {
    let found = ''
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
    const progress =
      docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
    setScrollProgress(progress)

    if (scrollTop > 100) {
      setShowUserDropdown(false)
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  return () => window.removeEventListener('scroll', handleScroll)
}

type RenderPortfolioAccountMenuProps = {
  showUserDropdown: boolean
  user: import('../../../hooks/useAuth').AuthUser | null
  setShowUserDropdown: React.Dispatch<React.SetStateAction<boolean>>
  lang: Lang
  navigate: import('react-router-dom').NavigateFunction
  logout: () => void
}

function renderPortfolioAccountMenu({
  showUserDropdown,
  user,
  setShowUserDropdown,
  lang,
  navigate,
  logout,
}: RenderPortfolioAccountMenuProps) {
  return (
    showUserDropdown && (
      <div className={styles.userDropdown}>
        <div className={styles.dropdownHeader}>
          <div className={styles.dropdownUserInfo}>
            <div className={styles.dropdownDetails}>
              <span className={styles.dropdownName}>
                {user?.firstName} {user?.lastName}
              </span>
              <span className={styles.dropdownEmail}>{user?.email}</span>
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
            {lang === 'pt' ? 'Meu Perfil' : 'My Profile'}
          </button>

          <button
            className={styles.dropdownItem}
            onClick={() => {
              setShowUserDropdown(false)
            }}
          >
            <span className={styles.dropdownIcon}>⚙️</span>
            {lang === 'pt' ? 'Configurações' : 'Settings'}
          </button>

          {user?.isChatOwner === true && (
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setShowUserDropdown(false)
                void navigate('/admin/chat')
              }}
            >
              <span className={styles.dropdownIcon}>💬</span>
              {lang === 'pt' ? 'Caixa de entrada' : 'Inbox'}
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
            {lang === 'pt' ? 'Sair' : 'Sign out'}
          </button>
        </div>
      </div>
    )
  )
}

type RenderPortfolioMobileMenuProps = {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  active: string
  scrollToSection: (id: string) => void
  t: PortfolioI18n
  setLang: (lang: Lang) => void
  lang: Lang
}

function renderPortfolioMobileMenu({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  active,
  scrollToSection,
  t,
  setLang,
  lang,
}: RenderPortfolioMobileMenuProps) {
  return (
    isMobileMenuOpen && (
      <div
        className={styles.mobileMenuOverlay}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          id="portfolio-mobile-menu"
          className={styles.mobileMenu}
          onClick={(e) => e.stopPropagation()}
        >
          <ul className={styles.mobileNavList}>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`${styles.mobileNavLink} ${active === item.id ? styles.active : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>
                    {t[item.labelKey] || item.id}
                  </span>
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
    )
  )
}

const navItems: Array<{ id: string; labelKey: NavLabelKey; icon: string }> = [
  { id: 'experiencia', labelKey: 'experienceTitle', icon: '💼' },
  { id: 'projetos', labelKey: 'projectsTitle', icon: '↗' },
  { id: 'sobre', labelKey: 'aboutTitle', icon: '👤' },
  { id: 'educacao', labelKey: 'educationTitle', icon: '🎓' },
  { id: 'contato', labelKey: 'contactTitle', icon: '📧' },
]

const PortfolioNav: React.FC<PortfolioNavProps> = ({ t, lang, setLang }) => {
  const navigate = useNavigate()
  const [active, setActive] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const { user, login, logout, isAuthenticated } = useAuth()
  const { isFeatureEnabled, config } = useAppConfig()

  useEffect(
    () =>
      observePortfolioSections({
        setActive,
        setScrollProgress,
        setShowUserDropdown,
      }),
    []
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        !target.closest(`.${styles.userDropdown}`) &&
        !target.closest(`.${styles.userInfo}`)
      ) {
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
      <nav className={styles.portfolioNav} aria-label={t.portfolioTitle}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className={styles.navContent}>
          <Link
            to="/"
            className={styles.brandLink}
            aria-label={t.recruiter.exploreStudies}
          >
            BK<span>/ LAB</span>
          </Link>
          <ul className={styles.portfolioNavList}>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`${styles.portfolioNavLink} ${active === item.id ? styles.active : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>
                    {t[item.labelKey] || item.id}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.portfolioNavActions}>
            {!isAuthenticated &&
              isFeatureEnabled('authentication') &&
              config.ui.showAuthButton && (
                <button
                  className={styles.loginBtn}
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  {lang === 'pt' ? 'Entrar' : 'Sign in'}
                </button>
              )}
            {isAuthenticated &&
              renderPortfolioAccountTrigger({
                setShowUserDropdown,
                showUserDropdown,
                lang,
                user,
                navigate,
                logout,
              })}
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
          aria-label={lang === 'pt' ? 'Alternar menu' : 'Toggle menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="portfolio-mobile-menu"
        >
          <span
            className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}
          >
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </nav>

      {renderPortfolioMobileMenu({
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        active,
        scrollToSection,
        t,
        setLang,
        lang,
      })}

      <SimpleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => {
          login(userData)
          setIsAuthModalOpen(false)
        }}
      />

      <FloatingChatButton />
    </>
  )
}

export default PortfolioNav
