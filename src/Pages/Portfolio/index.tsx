import React from 'react'
import { Typography, Section } from '@components/common'
import styles from './styles.module.css'
import AboutMe from '@components/portfolio/AboutMe'
import Contact from '@components/portfolio/Contact'
import { useI18n } from '@src/i18n'
import ThemeToggleButton from '@theme/ThemeToggleButton'
import HeroSection from '@components/portfolio/HeroSection'
import PortfolioNav from '@components/portfolio/PortfolioNav'
import type { Lang } from '@src/i18n'
import WorkExperienceTimeline from '@components/portfolio/WorkExperienceTimeline'
import Education from '@components/portfolio/Education'
import Footer from '@components/portfolio/Footer'

const Portfolio: React.FC = () => {
  const { t, lang, setLang } = useI18n()
  const handleSetLang = (l: Lang) => setLang(l)

  return (
    <div className={styles.portfolio__wrapper}>
      <PortfolioNav t={t} lang={lang} setLang={handleSetLang} />
      <HeroSection t={t} />
      <main className={styles.portfolio__main}>
        <AboutMe />
        <WorkExperienceTimeline />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default Portfolio