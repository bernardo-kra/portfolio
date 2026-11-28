import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUp,
  Briefcase,
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
 * Hidden on small screens, where the pages already have their own menus.
 */
export default function SiteDock({ variant }: { variant: Variant }) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const visible = usePastFold()
  const active = useActiveSection(variant === 'portfolio')

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

  return (
    <nav
      className={styles.wrap}
      data-visible={visible}
      aria-label={pt ? 'Atalhos' : 'Shortcuts'}
      aria-hidden={!visible || undefined}
      inert={!visible || undefined}
    >
      <Dock
        items={items}
        theme={theme === 'dark' ? 'dark' : 'light'}
        baseItemSize={40}
        magnification={58}
        distance={150}
        panelHeight={56}
        gap={8}
        accentColor="#ff9900"
        showBadges={false}
      />
    </nav>
  )
}
