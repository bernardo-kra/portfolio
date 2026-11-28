import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Typography, Container, FadeInOnScroll } from '@components/common'
import { FloatingChatButton } from '@components/chat'
import ThemeToggleButton from '@components/theme/ThemeToggleButton'
import { useI18n } from '@src/i18n'
import styles from './styles.module.css'

// Loaded on demand so `motion` stays out of the home's initial bundle.
const DecryptedText = lazy(
  () => import('@components/reactbits/DecryptedText/DecryptedText')
)
import { profile } from '@src/config/profile'
import { ArrowUpRight, Download, MessageCircle } from 'lucide-react'
import { useAppConfig } from '@context'
import Ribbon from '@components/common/Ribbon'
import AccountControl from '@components/auth/AccountControl'
import { NotificationCenter } from '@components/notifications'

type Project = {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  route: string
  features: string[]
  previewImage?: string
  isFeatured?: boolean
  featuredLabel?: string
}

type HomeProjectsProps = {
  lang: import('../../../i18n/index').Lang
  t: import('../../../i18n/index').PortfolioI18n
}

function learningProject(lang: HomeProjectsProps['lang']): Project {
  return {
    id: 'learning',
    title:
      lang === 'pt' ? 'Bastidores de uma interface' : 'Behind the interface',
    subtitle: lang === 'pt' ? 'Design em construção' : 'Design in progress',
    description:
      lang === 'pt'
        ? 'Seis estúdios conectados: pixel art, fundos generativos, animações, camadas em 3D e sua própria página para baixar.'
        : 'Six connected studios: pixel art, generative backgrounds, motion, 3D layers and your own downloadable page.',
    icon: 'UI',
    color: '#e5b500',
    route: '/learning',
    features: ['Pixel art', 'Motion', 'React', 'UX'],
    previewImage: '/previews/learning.webp',
  }
}

function homeProjects({ lang, t }: HomeProjectsProps): Project[] {
  return [
    {
      id: 'portfolio',
      title: t.portfolioTitle,
      subtitle: t.portfolioSubtitle,
      description: t.portfolioDescription,
      icon: 'DEV',
      color: 'var(--brand-orange)',
      route: '/portfolio',
      features:
        lang === 'pt'
          ? ['Projetos', 'Experiência', 'Habilidades', 'Contato']
          : ['Projects', 'Experience', 'Skills', 'Contact'],
      previewImage: '/previews/portfolio.webp',
      isFeatured: true,
      featuredLabel: lang === 'pt' ? 'Destaque' : 'Featured',
    },
    learningProject(lang),
    {
      id: 'agency',
      title: 'Forma — Creative Studio',
      subtitle: lang === 'pt' ? 'Estudo de agência' : 'Agency study',
      description:
        lang === 'pt'
          ? 'Design editorial, formas orgânicas e uma galeria interativa. Um estúdio criativo do conceito ao código.'
          : 'Editorial design, organic shapes and an interactive gallery. A creative studio from concept to code.',
      icon: 'f.',
      color: '#267b48',
      route: '/agency',
      features: [
        'Design',
        'CSS Grid',
        lang === 'pt' ? 'Responsivo' : 'Responsive',
        'UX',
      ],
      previewImage: '/previews/agency.webp',
    },
    {
      id: 'pomodoro',
      title: t.pomodoroTitle,
      subtitle: t.pomodoroSubtitle,
      description: t.pomodoroDescription,
      icon: 'TIME',
      color: '#10b981',
      route: '/pomodoro',
      features:
        lang === 'pt'
          ? ['Timer', 'Tarefas', 'Estatísticas', 'Música']
          : ['Timer', 'Tasks', 'Statistics', 'Music'],
      previewImage: '/previews/pomodoro.webp',
    },
    {
      id: 'generative',
      title: t.generativeTitle,
      subtitle: t.generativeSubtitle,
      description: t.generativeDescription,
      icon: 'ART',
      color: '#8b5cf6',
      route: '/generative',
      features:
        lang === 'pt'
          ? ['Algoritmos', 'Padrões', 'Interatividade', 'Canvas']
          : ['Algorithms', 'Patterns', 'Interactivity', 'Canvas'],
      previewImage: '/previews/generative.webp',
    },
    {
      id: 'landing',
      title: t.landingTitle,
      subtitle: t.landingSubtitle,
      description: t.landingDescription,
      icon: 'LAUNCH',
      color: '#f59e0b',
      route: '/landing',
      features: ['Design', 'Performance', 'SEO', 'Analytics'],
      previewImage: '/previews/landing.webp',
    },
    {
      id: 'experimental3d',
      title: 'Neon Bay',
      subtitle: lang === 'pt' ? 'Ficção interativa' : 'Interactive fiction',
      description:
        lang === 'pt'
          ? 'Uma missão cinematográfica: explore um servidor, intercepte sinais e abra os portões da baía.'
          : 'A cinematic mission: explore a server, intercept signals and open the gates of the bay.',
      icon: 'NEON',
      color: '#f97316',
      route: '/experimental3d',
      features: ['SVG', 'React', 'TypeScript', 'UX'],
      previewImage: '/previews/experimental3d.webp',
    },
  ]
}

type RenderHomeHeroProps = {
  t: import('../../../i18n/index').PortfolioI18n
  showConversation: boolean
  lang: import('../../../i18n/index').Lang
  projectsRef: React.RefObject<HTMLElement | null>
  setLightEnabled: React.Dispatch<React.SetStateAction<boolean>>
  setLightBlown: React.Dispatch<React.SetStateAction<boolean>>
}

function renderHomeHero({
  t,
  showConversation,
  lang,
  projectsRef,
  setLightEnabled,
  setLightBlown,
}: RenderHomeHeroProps) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBackground} aria-hidden="true" />
      <Container className={styles.heroContainer}>
        <div>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.greeting}>
                <span className={styles.greetingLine} />
                <span className={styles.greetingText}>{t.greeting}</span>
              </div>

              <Typography variant="h1" className={styles.heroTitle}>
                {t.heroTitle}
              </Typography>

              <Typography variant="h2" className={styles.heroSubtitle}>
                <Suspense fallback={t.heroSubtitle}>
                  <DecryptedText
                    key={t.heroSubtitle}
                    text={t.heroSubtitle}
                    animateOn="view"
                    revealDirection="start"
                    sequential
                    speed={18}
                    characters="abcdefghijklmnopqrstuvwxyz<>/{}"
                    scrambleColor="#8f93a8"
                  />
                </Suspense>
              </Typography>

              <Typography variant="body1" className={styles.heroDescription}>
                {t.heroDescription}
              </Typography>

              <div className={styles.heroPrompt}>
                {showConversation && (
                  <Link to="/chat" className={styles.conversationLink}>
                    <MessageCircle size={17} aria-hidden="true" />
                    {lang === 'pt'
                      ? 'Conversar com Bernardo'
                      : 'Talk to Bernardo'}
                  </Link>
                )}
                <button
                  className={styles.heroExplore}
                  onClick={() =>
                    projectsRef.current?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }
                >
                  {t.recruiter.exploreStudies}
                </button>
                <Link to="/portfolio" className={styles.profileLink}>
                  {t.recruiter.professionalProfile} →
                </Link>
                <a
                  href={profile.resumeUrl}
                  download={profile.resumeFilename}
                  className={styles.resumeLink}
                  title={t.recruiter.pdfLanguage}
                >
                  <Download size={16} aria-hidden="true" />
                  {t.downloadCV}
                  <small>PDF</small>
                </a>
                <span
                  className={styles.heroHint}
                  onMouseEnter={() => {
                    setLightEnabled(true)
                    setLightBlown(false)
                  }}
                >
                  {lang === 'pt'
                    ? 'Passe o mouse para ativar a luz (movimento rápido apaga)'
                    : 'Hover to turn on the light (fast movement turns it off)'}
                </span>
              </div>
            </div>

            <div className={styles.heroImage} aria-hidden="true"></div>
          </div>
        </div>
      </Container>
    </section>
  )
}

type RenderHomeStudiesProps = {
  lang: import('../../../i18n/index').Lang
  projectsRef: React.RefObject<HTMLElement | null>
  t: import('../../../i18n/index').PortfolioI18n
  projects: Project[]
}

function renderHomeStudies({
  lang,
  projectsRef,
  t,
  projects,
}: RenderHomeStudiesProps) {
  return (
    <section id="estudos" className={styles.projectsSection} ref={projectsRef}>
      <Container className={styles.projectsContainer}>
        <FadeInOnScroll>
          <div className={styles.sectionHeader}>
            <Typography variant="h2" className={styles.sectionTitle}>
              {t.myProjects}
            </Typography>
            <Typography
              variant="body1"
              color="muted"
              className={styles.sectionSubtitle}
            >
              {t.projectsSubtitle}
            </Typography>
            <div className={styles.sectionHint}>
              {lang === 'pt' ? 'Índice' : 'Index'} /{' '}
              {String(projects.length).padStart(2, '0')}
            </div>
          </div>
        </FadeInOnScroll>

        <StudiesIndex projects={projects} />
      </Container>
    </section>
  )
}

type RenderHomeContactProps = {
  t: import('../../../i18n/index').PortfolioI18n
  navigate: import('react-router-dom').NavigateFunction
}

function renderHomeContact({ t, navigate }: RenderHomeContactProps) {
  return (
    <section className={styles.ctaSection}>
      <Container className={styles.ctaContainer}>
        <FadeInOnScroll>
          <div className={styles.ctaCard}>
            <div className={styles.ctaGlow} aria-hidden="true" />
            <div className={styles.ctaContent}>
              <Typography variant="h2" className={styles.ctaTitle}>
                {t.recruiter.homeCta}
              </Typography>
              <Typography variant="body1" className={styles.ctaText}>
                {t.recruiter.homeCopy}
              </Typography>
              <div className={styles.ctaActions}>
                <button
                  className={styles.ctaPrimary}
                  onClick={() => {
                    void navigate('/portfolio')
                  }}
                >
                  {t.explorePortfolio}
                </button>
                <a
                  className={styles.ctaSecondary}
                  href={profile.resumeUrl}
                  download={profile.resumeFilename}
                  title={t.recruiter.pdfLanguage}
                >
                  {t.downloadCV} ↓
                </a>
              </div>
            </div>
            <div className={styles.ctaStats}>
              <div>
                <span className={styles.ctaStatNumber}>React</span>
                <span className={styles.ctaStatLabel}>Frontend</span>
              </div>
              <div>
                <span className={styles.ctaStatNumber}>TypeScript</span>
                <span className={styles.ctaStatLabel}>JavaScript</span>
              </div>
              <div>
                <span className={styles.ctaStatNumber}>QA</span>
                <span className={styles.ctaStatLabel}>
                  {t.recruiter.learning}
                </span>
              </div>
            </div>
          </div>
        </FadeInOnScroll>
      </Container>
    </section>
  )
}

function StudiesIndex({ projects }: { projects: Project[] }) {
  const { lang } = useI18n()
  const [active, setActive] = useState(0)
  const current = projects[active] ?? projects[0]

  return (
    <div
      className={styles.studyIndex}
      style={{ '--project-color': current?.color } as React.CSSProperties}
    >
      <ol className={styles.studyList}>
        {projects.map((project, index) => (
          <li key={project.id} className={styles.studyItem}>
            <Link
              to={project.route}
              className={styles.studyRow}
              data-active={index === active}
              style={
                { '--project-color': project.color } as React.CSSProperties
              }
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <span className={styles.studyNumber}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={styles.studyMain}>
                <span className={styles.studyMeta}>{project.subtitle}</span>
                <span className={styles.studyTitle}>
                  {project.title}
                  {project.isFeatured && (
                    <span className={styles.studyFeatured}>
                      {project.featuredLabel ??
                        (lang === 'pt' ? 'Destaque' : 'Featured')}
                    </span>
                  )}
                </span>
                <span className={styles.studyDescription}>
                  {project.description}
                </span>
              </span>
              <ArrowUpRight
                className={styles.studyArrow}
                size={22}
                aria-hidden="true"
              />
              {project.previewImage && (
                <span className={styles.studyThumb} aria-hidden="true">
                  <img src={project.previewImage} alt="" loading="lazy" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>
      <div className={styles.studyPreview} aria-hidden="true">
        <div className={styles.studyPreviewFrame}>
          {projects.map((project, index) => (
            <figure
              key={project.id}
              className={styles.studyPreviewFigure}
              data-active={index === active}
              style={
                { '--project-color': project.color } as React.CSSProperties
              }
            >
              {project.previewImage && (
                <img src={project.previewImage} alt="" loading="lazy" />
              )}
            </figure>
          ))}
        </div>
        <p className={styles.studyPreviewCaption}>
          <span>{current?.icon}</span>
          {current?.features.join(' · ')}
        </p>
      </div>
    </div>
  )
}

const ModernHomePage: React.FC = () => {
  const navigate = useNavigate()
  const { lang, setLang, t } = useI18n()
  const { isFeatureEnabled, config } = useAppConfig()
  const showConversation = isFeatureEnabled('chat') && config.ui.showChatButton
  const homeRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const [lightEnabled, setLightEnabled] = useState(false)
  const [lightBlown, setLightBlown] = useState(false)
  const lastPointerRef = useRef<{ x: number; y: number; t: number } | null>(
    null
  )
  const targetRef = useRef({ x: 0.5, y: 0.5 })
  const currentRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const home = homeRef.current
    if (!home || !lightEnabled) return

    const updateVars = () => {
      if (!home) return
      const current = currentRef.current
      const target = targetRef.current
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08
      home.style.setProperty('--hx', `${current.x}`)
      home.style.setProperty('--hy', `${current.y}`)
      rafRef.current = window.requestAnimationFrame(updateVars)
    }

    rafRef.current = window.requestAnimationFrame(updateVars)

    const handleMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth
      const y = event.clientY / window.innerHeight
      const now = performance.now()
      const last = lastPointerRef.current
      if (lightEnabled && last) {
        const dx = x - last.x
        const dy = y - last.y
        const dt = Math.max(now - last.t, 1)
        const speed = Math.hypot(dx, dy) / dt
        if (speed > 0.006) {
          setLightEnabled(false)
          setLightBlown(true)
          lastPointerRef.current = null
          return
        }
      }

      targetRef.current = { x, y }
      lastPointerRef.current = { x, y, t: now }
    }

    const handleLeave = () => {
      targetRef.current = { x: 0.5, y: 0.5 }
      lastPointerRef.current = null
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    }
  }, [lightEnabled])

  const projects: Project[] = homeProjects({ lang, t })

  return (
    <div
      className={[
        styles.homePage,
        lightEnabled ? styles.lightEnabled : styles.lightDisabled,
        lightBlown ? styles.lightBlown : '',
      ].join(' ')}
      ref={homeRef}
    >
      <div className={styles.ambientBackdrop} aria-hidden="true" />
      <div className={styles.cursorLight} aria-hidden="true" />
      <div className={styles.themeControls}>
        <AccountControl />
        <NotificationCenter />
        <ThemeToggleButton />
        <button
          className={styles.languageToggle}
          onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          aria-label={
            lang === 'pt' ? 'Mudar para inglês' : 'Switch to Portuguese'
          }
        >
          {lang === 'pt' ? 'EN' : 'PT'}
        </button>
      </div>
      {renderHomeHero({
        t,
        showConversation,
        lang,
        projectsRef,
        setLightEnabled,
        setLightBlown,
      })}
      <Ribbon
        items={
          lang === 'pt'
            ? [
                'Interfaces com propósito',
                'React & TypeScript',
                'Experiência em e-commerce',
                'Qualidade de software',
                'Aprender construindo',
              ]
            : [
                'Purposeful interfaces',
                'React & TypeScript',
                'E-commerce experience',
                'Software quality',
                'Learning by building',
              ]
        }
      />
      {renderHomeStudies({ lang, projectsRef, t, projects })}

      {renderHomeContact({ t, navigate })}

      <section className={styles.statsSection}>
        <Container className={styles.statsContainer}>
          <FadeInOnScroll>
            <div className={styles.techChips}>
              <span className={styles.featureTag}>React</span>
              <span className={styles.featureTag}>Vite</span>
              <span className={styles.featureTag}>TypeScript</span>
              <span className={styles.featureTag}>Firebase</span>
              <span className={styles.featureTag}>Tailwind/CSS Modules</span>
              <span className={styles.featureTag}>CI/CD</span>
            </div>
          </FadeInOnScroll>
        </Container>
      </section>

      <div className={styles.footer}>
        <Typography
          variant="caption"
          color="muted"
          className={styles.copyright}
        >
          © {new Date().getFullYear()} Bernardo Kraczkowski.{' '}
          {lang === 'pt'
            ? 'Todos os direitos reservados.'
            : 'All rights reserved.'}
        </Typography>
      </div>

      <FloatingChatButton />
    </div>
  )
}

export default ModernHomePage
