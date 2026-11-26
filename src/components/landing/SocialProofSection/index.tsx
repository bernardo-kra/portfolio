import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { profile } from '@src/config/profile'
import shared from '../shared.module.css'
import Reveal from '../Reveal'
import styles from './styles.module.css'

interface WorkRowProps {
  index: number
  title: string
  text: string
  cta: string
  children: (content: ReactNode, className: string) => ReactNode
  external?: boolean
}

const WorkRow = ({
  index,
  title,
  text,
  cta,
  children,
  external,
}: WorkRowProps) => {
  const Icon = external ? ArrowUpRight : ArrowRight
  const content = (
    <>
      <span className={styles.work__index} aria-hidden="true">
        0{index}
      </span>
      <span className={styles.work__title}>{title}</span>
      <span className={styles.work__text}>{text}</span>
      <span className={styles.work__cta}>
        {cta}
        <Icon size={20} aria-hidden="true" />
      </span>
    </>
  )
  return (
    <li>
      <Reveal>
        {children(content, `${styles.work__link} ${shared.focusRing}`)}
      </Reveal>
    </li>
  )
}

const SocialProofSection = () => (
  <section className={shared.section} aria-labelledby="work-title">
    <div className={shared.inner}>
      <header className={shared.head}>
        <p className={shared.eyebrow} data-index="(04)">
          Evidências
        </p>
        <div className={styles.work__intro}>
          <h2 id="work-title" className={shared.title}>
            Conheça o trabalho por trás da{' '}
            <span className={shared.serif}>interface</span>.
          </h2>
          <p className={shared.lede}>
            Trajetória, experimentos e código que você pode explorar.
          </p>
        </div>
      </header>

      <ul className={styles.work__list}>
        <WorkRow
          index={1}
          title="Experiência profissional"
          text="Desenvolvimento frontend, e-commerce e qualidade de software. Conheça os contextos em que trabalhei."
          cta="Ver trajetória"
        >
          {(content, className) => (
            <Link to="/portfolio#experiencia" className={className}>
              {content}
            </Link>
          )}
        </WorkRow>
        <WorkRow
          index={2}
          title="Aprendizado em prática"
          text="Timer, canvas generativo e interfaces experimentais. Abra os estudos e teste as interações."
          cta="Explorar estudos"
        >
          {(content, className) => (
            <Link to="/#estudos" className={className}>
              {content}
            </Link>
          )}
        </WorkRow>
        <WorkRow
          index={3}
          title="Implementação aberta"
          text="Veja os componentes, a organização do projeto e as decisões de implementação no repositório."
          cta="Consultar código"
          external
        >
          {(content, className) => (
            <a
              href={profile.github + '/portfolio'}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {content}
            </a>
          )}
        </WorkRow>
      </ul>
    </div>
  </section>
)

export default SocialProofSection
