import LogoLoop, { type LogoItem } from '@components/reactbits/LogoLoop/LogoLoop'
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
  return (
    <section
      className={styles.band}
      aria-label={lang === 'pt' ? 'Tecnologias' : 'Technologies'}
    >
      <LogoLoop
        logos={items}
        speed={48}
        gap={28}
        logoHeight={15}
        pauseOnHover
        fadeOut
        fadeOutColor="var(--techloop-bg)"
        ariaLabel={lang === 'pt' ? 'Tecnologias' : 'Technologies'}
      />
    </section>
  )
}

export default TechLoop
