import React, { useState, useEffect } from 'react'
import { HomeButton, FadeInOnScroll } from '@components/common'
import styles from './styles.module.css'

import HeroSection from '@components/landing/HeroSection'
import BenefitsSection from '@components/landing/BenefitsSection'
import SocialProofSection from '@components/landing/SocialProofSection'
import FAQSection from '@components/landing/FAQSection'
import ContactForm from '@components/landing/ContactForm'
import Footer from '@components/landing/Footer'
import Ribbon from '@components/common/Ribbon'
import StudyGuide from '@components/common/StudyGuide'

const LandingPage: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', updateScrollProgress)
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <div className={styles.landing__wrapper}>
      <div
        className={styles.landing__scrollIndicator}
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      <HomeButton />

      <main className={styles.landing__main}>
        <FadeInOnScroll delay={100}>
          <HeroSection />
        </FadeInOnScroll>

        <Ribbon
          items={[
            'Mensagem clara',
            'Experiência verificável',
            'Design responsivo',
            'Contato direto',
            'Estudo em React',
          ]}
          tone="violet"
        />
        <FadeInOnScroll delay={200}>
          <BenefitsSection />
        </FadeInOnScroll>

        <FadeInOnScroll delay={300}>
          <SocialProofSection />
        </FadeInOnScroll>

        <FadeInOnScroll delay={400}>
          <FAQSection />
        </FadeInOnScroll>

        <FadeInOnScroll delay={500}>
          <ContactForm />
        </FadeInOnScroll>
      </main>

      <StudyGuide study="landing" />
      <Footer />
    </div>
  )
}

export default LandingPage
