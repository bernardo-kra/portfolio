import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import LogoLoop, {
  type LogoItem,
} from '@components/reactbits/LogoLoop/LogoLoop'
import { useI18n } from '@src/i18n'
import styles from './styles.module.css'

const STACK = [
  'React',
  'TypeScript',
  'JavaScript',
  'Next.js',
  'Node.js',
  'Redux',
  'Oracle Commerce Cloud',
  'Jest',
  'Cypress',
  'REST APIs',
]

const items: LogoItem[] = STACK.map((name) => ({
  node: (
    <span className={styles.item}>
      {name}
      <i aria-hidden="true">✦</i>
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
        gap={28}
        logoHeight={15}
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
