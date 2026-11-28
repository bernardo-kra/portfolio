import { useEffect, useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUp,
  Briefcase,
  ChevronDown,
  Dock as DockIcon,
  Copy,
  FileDown,
  FlaskConical,
  FolderOpen,
  Github,
  GraduationCap,
  House,
  LayoutTemplate,
  Linkedin,
  Mail,
  PenTool,
  Sparkles,
  Terminal,
  Send,
  Timer,
  User,
} from 'lucide-react'
import Dock, {
  type DockItemData,
  type DockMenuItem,
} from '@components/reactbits/Dock/Dock'
import { useTheme } from '@components/theme'
import { useI18n } from '@src/i18n'
import { profile } from '@src/config/profile'
import styles from './styles.module.css'

type Variant = 'home' | 'portfolio'

const STORAGE_KEY = 'site-dock:open'
const MOBILE = '(max-width: 860px)'

const subscribeMobile = (onChange: () => void) => {
  const media = window.matchMedia(MOBILE)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const useMobile = () =>
  useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE).matches,
    () => false
  )

/** Desktop visitors choose whether the dock stays open; the choice is remembered. */
function useDockOpen() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })
  const update = (next: boolean) => {
    setOpen(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
    } catch {
      /* storage unavailable: keep the choice for this visit only */
    }
  }
  return [open, update] as const
}

const ICON = 20
const SECTIONS = [
  { id: 'experiencia', pt: 'Experiência', en: 'Experience', Icon: Briefcase },
  { id: 'projetos', pt: 'Projetos', en: 'Projects', Icon: FolderOpen },
  { id: 'sobre', pt: 'Sobre mim', en: 'About me', Icon: User },
  { id: 'educacao', pt: 'Educação', en: 'Education', Icon: GraduationCap },
  { id: 'contato', pt: 'Contato', en: 'Contact', Icon: Send },
] as const

const STUDIES = [
  { route: '/portfolio', label: 'Portfolio', Icon: Briefcase },
  { route: '/learning', label: 'Lab', Icon: FlaskConical },
  { route: '/agency', label: 'Forma', Icon: PenTool },
  { route: '/pomodoro', label: 'Pomodoro', Icon: Timer },
  { route: '/generative', label: 'Generative Art', Icon: Sparkles },
  { route: '/landing', label: 'Landing', Icon: LayoutTemplate },
  { route: '/experimental3d', label: 'Neon Bay', Icon: Terminal },
] as const

const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')

const download = () => {
  const link = document.createElement('a')
  link.href = profile.resumeUrl
  link.download = profile.resumeFilename
  link.click()
}

/** Shows the dock once the visitor has scrolled past the first screen. */
function usePastFold() {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const update = () => setPast(window.scrollY > window.innerHeight * 0.6)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return past
}

/** Tracks which portfolio section is in the middle of the viewport. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState('')
  useEffect(() => {
    if (!enabled) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    for (const { id } of SECTIONS) {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    }
    return () => observer.disconnect()
  }, [enabled])
  return active
}

function contactMenu(pt: boolean): DockMenuItem[] {
  return [
    {
      label: 'LinkedIn',
      icon: <Linkedin size={14} />,
      onClick: () => open(profile.linkedin),
    },
    {
      label: 'GitHub',
      icon: <Github size={14} />,
      onClick: () => open(profile.github),
    },
    { separator: true },
    {
      label: pt ? 'Enviar e-mail' : 'Send e-mail',
      icon: <Mail size={14} />,
      onClick: () => (window.location.href = `mailto:${profile.email}`),
    },
    {
      label: pt ? 'Copiar e-mail' : 'Copy e-mail',
      icon: <Copy size={14} />,
      onClick: () => void navigator.clipboard?.writeText(profile.email),
    },
  ]
}

/**
 * A macOS-style dock (React Bits Dock) shared by the lab's hub pages. On the
 * home it launches every study; on the portfolio it jumps between sections.
 * On phones it is always shown (compact, no magnification); on desktop it
 * starts minimised behind a small button and the visitor decides.
 */
export default function SiteDock({ variant }: { variant: Variant }) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const visible = usePastFold()
  const active = useActiveSection(variant === 'portfolio')
  const mobile = useMobile()
  const [open, setOpen] = useDockOpen()
  const expanded = mobile || open

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const shared: DockItemData[] = [
    { separator: true },
    {
      label: pt ? 'Redes e e-mail' : 'Links & e-mail',
      icon: <Mail size={ICON} />,
      menu: contactMenu(pt),
    },
    {
      label: pt ? 'Baixar CV' : 'Download CV',
      icon: <FileDown size={ICON} />,
      onClick: download,
    },
  ]

  const items: DockItemData[] =
    variant === 'home'
      ? [
          {
            label: pt ? 'Início' : 'Home',
            icon: <House size={ICON} />,
            active: true,
            onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
          },
          { separator: true },
          ...STUDIES.map(({ route, label, Icon }) => ({
            label,
            icon: <Icon size={ICON} />,
            onClick: () => navigate(route),
          })),
          ...shared,
        ]
      : [
          {
            label: pt ? 'Topo' : 'Top',
            icon: <ArrowUp size={ICON} />,
            onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
          },
          { separator: true },
          ...SECTIONS.map(({ id, pt: ptLabel, en, Icon }) => ({
            label: pt ? ptLabel : en,
            icon: <Icon size={ICON} />,
            active: active === id,
            onClick: () => scrollTo(id),
          })),
          ...shared,
          {
            label: pt ? 'Laboratório' : 'Lab',
            icon: <House size={ICON} />,
            onClick: () => navigate('/'),
          },
        ]

  // On phones the dock has to fit beside the privacy and chat buttons, so it
  // keeps only the destinations: no separators, no "top"/"home" shortcuts.
  const mobileItems = items.filter(
    (item, index) =>
      !item.separator &&
      !(variant === 'home' && (index === 0 || item.onClick === download)) &&
      !(variant === 'portfolio' && (index === 0 || index === items.length - 1))
  )

  if (!mobile)
    items.push({
      label: pt ? 'Minimizar' : 'Minimise',
      icon: <ChevronDown size={ICON} />,
      onClick: () => setOpen(false),
    })

  const size = mobile
    ? { baseItemSize: 32, magnification: 32, panelHeight: 44, gap: 5 }
    : { baseItemSize: 40, magnification: 58, panelHeight: 56, gap: 8 }

  return (
    <nav
      className={styles.wrap}
      data-visible={visible}
      data-mobile={mobile}
      data-theme={theme === 'dark' ? 'dark' : 'light'}
      aria-label={pt ? 'Atalhos' : 'Shortcuts'}
      aria-hidden={!visible || undefined}
      inert={!visible || undefined}
    >
      {expanded ? (
        <Dock
          key={mobile ? 'mobile' : 'desktop'}
          items={mobile ? mobileItems : items}
          theme={theme === 'dark' ? 'dark' : 'light'}
          {...size}
          distance={150}
          accentColor="#ff9900"
          showBadges={false}
        />
      ) : (
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen(true)}
          aria-label={pt ? 'Abrir atalhos' : 'Open shortcuts'}
        >
          <DockIcon size={16} aria-hidden />
          <span>{pt ? 'Atalhos' : 'Shortcuts'}</span>
        </button>
      )}
    </nav>
  )
}
