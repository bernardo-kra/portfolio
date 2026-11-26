import { Fragment, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight } from 'lucide-react'
import shared from '../shared.module.css'
import styles from './styles.module.css'

const headline = [
  { text: 'Uma' },
  { text: 'boa' },
  { text: 'interface' },
  { text: 'transforma' },
  { text: 'interesse', accent: true },
  { text: 'em' },
  { text: 'conversa.' },
]

const facts = ['React + TypeScript', 'Layout responsivo', 'Contato direto']

/** Intervalos que encolhem: a frase chega como uma onda, não como fila. */
const wordDelay = (index: number) => Math.round(110 * Math.pow(index, 0.8))

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

const HeroSection = () => (
  <section className={styles.hero} aria-labelledby="landing-title">
    <div className={styles.hero__glow} aria-hidden="true" />
    <div className={`${shared.inner} ${styles.hero__inner}`}>
      <p
        className={`${shared.eyebrow} ${styles.hero__eyebrow}`}
        data-index="(01)"
      >
        Lab / Estudo de landing page
      </p>

      <h1 id="landing-title" className={styles.hero__title}>
        {headline.map((word, index) => (
          <Fragment key={word.text}>
            <span className={styles.hero__mask}>
              <span
                className={`${styles.hero__word} ${word.accent ? `${shared.serif} ${styles.hero__accent}` : ''}`}
                style={delay(wordDelay(index))}
              >
                {word.text}
              </span>
            </span>{' '}
          </Fragment>
        ))}
      </h1>

      <div className={styles.hero__footer}>
        <p className={`${shared.lede} ${styles.hero__lede}`} style={delay(420)}>
          Clareza na mensagem, cuidado na interação e um próximo passo fácil de
          encontrar. Um estudo de design e desenvolvimento por Bernardo
          Kraczkowski.
        </p>

        <div className={styles.hero__actions} style={delay(520)}>
          <a
            href="#contact-form"
            className={`${styles.hero__primary} ${shared.focusRing}`}
          >
            Conversar sobre uma oportunidade
            <ArrowDownRight size={18} aria-hidden="true" />
          </a>
          <Link
            to="/portfolio"
            className={`${styles.hero__secondary} ${shared.focusRing}`}
          >
            Conhecer minha experiência
          </Link>
        </div>
      </div>

      <ul className={styles.hero__facts} aria-label="Neste estudo">
        {facts.map((fact, index) => (
          <li key={fact}>
            <span aria-hidden="true">0{index + 1}</span>
            {fact}
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default HeroSection
