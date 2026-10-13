import { ArrowDown, ArrowUpRight, Check, Code2, Sparkles } from 'lucide-react'
import type { LearningCopy } from './content'
import styles from './introduction.module.css'
import shared from './styles.module.css'

export function LearningHero({ copy }: { copy: LearningCopy }) {
  return (
    <section className={styles.hero} aria-labelledby="learning-title">
      <div className={shared.container}>
        <p className={styles.breadcrumb}>{copy.breadcrumb}</p>
        <span className={shared.tag}>{copy.heroTag}</span>
        <h1 id="learning-title" className={styles.heroTitle}>
          {copy.heroTitle[0]}
          <br />
          {copy.heroTitle[1]}
        </h1>
        <p className={styles.heroText}>{copy.heroText}</p>
        <a className={shared.button} href="#experimentos">
          {copy.heroAction}
          <ArrowDown size={19} aria-hidden="true" />
        </a>
        <span className={styles.heroSpark} aria-hidden="true">
          ✳
        </span>
        <span className={styles.heroOrbit} aria-hidden="true" />
      </div>
    </section>
  )
}

export function LearningAbout({ copy }: { copy: LearningCopy }) {
  return (
    <section
      id="proposta"
      className={`${shared.container} ${styles.about}`}
      aria-labelledby="about-title"
    >
      <div>
        <span className={shared.tag}>{copy.aboutTag}</span>
        <h2 id="about-title">{copy.aboutTitle}</h2>
        <p>{copy.aboutText}</p>
        <p>{copy.aboutSecond}</p>
        <ul className={styles.benefits}>
          {copy.benefits.map((benefit) => (
            <li key={benefit}>
              <Check size={16} aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.aboutAside}>
        <div className={styles.projectPreview}>
          <span className={styles.previewLabel}>
            <Code2 size={17} aria-hidden="true" />
            {copy.preview}
          </span>
          <div className={styles.blocks} aria-hidden="true">
            {copy.previewCode.map((line, index) => (
              <span key={line} data-index={index}>
                {line}
              </span>
            ))}
          </div>
          <p className={styles.previewTitle}>{copy.previewTitle}</p>
          <Sparkles
            className={styles.previewSpark}
            size={40}
            aria-hidden="true"
          />
        </div>
        <a className={styles.aboutNote} href="#oficina">
          <div>
            <h3>{copy.noteTitle}</h3>
            <p>{copy.noteText}</p>
          </div>
          <ArrowUpRight size={24} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
