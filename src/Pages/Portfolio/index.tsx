import React, { useState, useEffect } from 'react'
import { HomeButton, FadeInOnScroll } from '@components/common'
import styles from './styles.module.css'
import AboutMe from '@components/portfolio/AboutMe'
import Contact from '@components/portfolio/Contact'
import { useI18n } from '@src/i18n'
import InteractiveHeroSection from '@components/portfolio/InteractiveHeroSection'
import PortfolioNav from '@components/portfolio/PortfolioNav'
import type { Lang } from '@src/i18n'
import WorkExperienceTimeline from '@components/portfolio/WorkExperienceTimeline'
import Education from '@components/portfolio/Education'
import Footer from '@components/portfolio/Footer'
import QuickNavigation from '@components/portfolio/QuickNavigation'
import FloatingCTA from '@components/portfolio/FloatingCTA'
import { useScrollToTop } from '@hooks/useScrollToTop'

const Portfolio: React.FC = () => {
  const { t, lang, setLang } = useI18n()
  const handleSetLang = (l: Lang) => setLang(l)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  useScrollToTop()

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / docHeight, 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', updateScrollProgress)
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <div className={styles.portfolio__wrapper}>
      <div 
        className={styles.portfolio__scrollIndicator}
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
      <HomeButton />
      <PortfolioNav t={t} lang={lang} setLang={handleSetLang} />
      <section className={`${styles.portfolio__section} ${styles['portfolio__section--hero']}`}>
        <InteractiveHeroSection t={t} />
      </section>
      <main className={styles.portfolio__main}>
        <section className={`${styles.portfolio__section} ${styles['portfolio__section--about']}`}>
          <FadeInOnScroll delay={100}>
            <AboutMe />
          </FadeInOnScroll>
        </section>
        <section className={`${styles.portfolio__section} ${styles['portfolio__section--projects']}`}>
          <FadeInOnScroll delay={200}>
            <WorkExperienceTimeline />
          </FadeInOnScroll>
        </section>
        <section className={`${styles.portfolio__section} ${styles['portfolio__section--projects']}`}>
          <FadeInOnScroll delay={300}>
            <Education />
          </FadeInOnScroll>
        </section>
        <section className={`${styles.portfolio__section} ${styles['portfolio__section--contact']}`}>
          <FadeInOnScroll delay={400}>
            <Contact />
          </FadeInOnScroll>
        </section>
      </main>
      <Footer />
      <QuickNavigation />
      <FloatingCTA />
    </div>
  )
}

export default Portfolio