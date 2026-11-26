import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Plus } from 'lucide-react'
import { useI18n } from '@src/i18n'
import { learningCopy } from './content'
import LearningHeader from './LearningHeader'
import { LearningHero, LearningAbout } from './Introduction'
import LearningPaths from './LearningPaths'
import InterfaceWorkbench from './InterfaceWorkbench'
import Experiments from './experiments/Experiments'
import type { LabArtwork } from './experiments/artwork'
import styles from './styles.module.css'
import layout from './layout.module.css'

export default function LearningLab() {
  const { lang } = useI18n()
  const copy = learningCopy[lang]
  const [artwork, setArtwork] = useState<LabArtwork>({
    icon: null,
    background: null,
  })
  return (
    <div className={styles.page}>
      <a href="#learning-content" className={styles.skip}>
        {copy.skip}
      </a>
      <LearningHeader copy={copy} />
      <main id="learning-content">
        <LearningHero copy={copy} />
        <LearningAbout copy={copy} />
        <Experiments
          artwork={artwork}
          onUseIcon={(icon) =>
            setArtwork((previous) => ({ ...previous, icon }))
          }
          onUseBackground={(background) =>
            setArtwork((previous) => ({ ...previous, background }))
          }
          onResetArtwork={() => setArtwork({ icon: null, background: null })}
        />
        <LearningPaths copy={copy} />
        <section
          className={`${styles.container} ${layout.cta}`}
          aria-labelledby="create-title"
        >
          <span className={`${styles.tag} ${styles.white}`}>{copy.ctaTag}</span>
          <h2 id="create-title">{copy.ctaTitle}</h2>
          <p>{copy.ctaText}</p>
          <a className={`${styles.button} ${styles.red}`} href="#oficina">
            {copy.try}
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <span className={layout.ctaStar} aria-hidden="true">
            ✦
          </span>
        </section>
        <InterfaceWorkbench
          customIcon={artwork.icon}
          customBackground={artwork.background}
          onClearArtwork={() => setArtwork({ icon: null, background: null })}
        />
        <section
          id="duvidas"
          className={`${styles.container} ${layout.faq}`}
          aria-labelledby="faq-title"
        >
          <div className={styles.sectionHeading}>
            <span className={styles.tag}>{copy.faqTag}</span>
            <h2 id="faq-title">{copy.faqTitle}</h2>
          </div>
          <div className={layout.questions}>
            {copy.questions.map((question) => (
              <details key={question.title}>
                <summary>
                  {question.title}
                  <Plus size={21} aria-hidden="true" />
                </summary>
                <p>{question.text}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className={layout.footer}>
        <div className={styles.container}>
          <p className={layout.footerTitle}>{copy.footerTitle}</p>
          <div>
            <p>{copy.footerText}</p>
            <Link to="/">
              <ArrowLeft size={17} aria-hidden="true" />
              {copy.back}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
