import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import LogoLoop, {
  type LogoItem,
} from '@components/reactbits/LogoLoop/LogoLoop'
import type { IconType } from 'react-icons'
import {
  SiCss,
  SiCypress,
  SiGit,
  SiJavascript,
  SiJest,
  SiNextdotjs,
  SiNodedotjs,
  SiPostman,
  SiReact,
  SiRedux,
  SiTypescript,
  SiVite,
} from 'react-icons/si'
import { useI18n } from '@src/i18n'
import styles from './styles.module.css'

const STACK: { name: string; Icon: IconType; color: string }[] = [
  { name: 'React', Icon: SiReact, color: '#61dafb' },
  { name: 'TypeScript', Icon: SiTypescript, color: '#3178c6' },
  { name: 'JavaScript', Icon: SiJavascript, color: '#f7df1e' },
  { name: 'Next.js', Icon: SiNextdotjs, color: 'currentColor' },
  { name: 'Node.js', Icon: SiNodedotjs, color: '#5fa04e' },
  { name: 'Redux', Icon: SiRedux, color: '#764abc' },
  { name: 'CSS', Icon: SiCss, color: '#663399' },
  { name: 'Vite', Icon: SiVite, color: '#a78bfa' },
  { name: 'Jest', Icon: SiJest, color: '#c21325' },
  { name: 'Cypress', Icon: SiCypress, color: 'currentColor' },
  { name: 'Git', Icon: SiGit, color: '#f05032' },
  { name: 'Postman', Icon: SiPostman, color: '#ff6c37' },
]

const items: LogoItem[] = STACK.map(({ name, Icon, color }) => ({
  node: (
    <span className={styles.item}>
      <Icon aria-hidden="true" style={{ color }} />
      {name}
    </span>
  ),
  title: name,
}))

/** Tech stack band built on React Bits' LogoLoop. */
const TechLoop = () => {
  const { lang } = useI18n()
  const [paused, setPaused] = useState(false)
  const pt = lang === 'pt'
  return (
    <section
      className={styles.band}
      aria-label={pt ? 'Tecnologias' : 'Technologies'}
    >
      <LogoLoop
        logos={items}
        speed={paused ? 0 : 48}
        gap={44}
        logoHeight={26}
        scaleOnHover
        pauseOnHover
        fadeOut
        fadeOutColor="var(--techloop-bg)"
        ariaLabel={pt ? 'Tecnologias' : 'Technologies'}
      />
      <button
        type="button"
        className={styles.control}
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
        aria-label={
          paused
            ? pt
              ? 'Continuar faixa animada'
              : 'Resume animated band'
            : pt
              ? 'Pausar faixa animada'
              : 'Pause animated band'
        }
      >
        {paused ? (
          <Play size={14} aria-hidden="true" />
        ) : (
          <Pause size={14} aria-hidden="true" />
        )}
      </button>
    </section>
  )
}

export default TechLoop
