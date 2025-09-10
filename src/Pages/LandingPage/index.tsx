import React, { useState, useEffect } from 'react'
import { HomeButton, FadeInOnScroll } from '@components/common'
import styles from './styles.module.css'
import { useScrollToTop } from '@hooks/useScrollToTop'

// Landing Page Components
import HeroSection from '@components/landing/HeroSection'
import BenefitsSection from '@components/landing/BenefitsSection'
import SocialProofSection from '@components/landing/SocialProofSection'
import FAQSection from '@components/landing/FAQSection'
import ContactForm from '@components/landing/ContactForm'
import Footer from '@components/landing/Footer'

const LandingPage: React.FC = () => {
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

      <Footer />
    </div>
  )
}

export default LandingPage
