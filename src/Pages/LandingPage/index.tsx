import React from 'react'
import { HomeButton } from '@components/common'
import StudyGuide from '@components/common/StudyGuide'
import HeroSection from '@components/landing/HeroSection'
import MethodSection from '@components/landing/MethodSection'
import BenefitsSection from '@components/landing/BenefitsSection'
import SocialProofSection from '@components/landing/SocialProofSection'
import FAQSection from '@components/landing/FAQSection'
import ContactForm from '@components/landing/ContactForm'
import Footer from '@components/landing/Footer'
import styles from './styles.module.css'

const LandingPage: React.FC = () => (
  <div className={styles.landing}>
    <div className={styles.landing__progress} aria-hidden="true" />
    <HomeButton />

    <main className={styles.landing__main}>
      <HeroSection />
      <MethodSection />
      <BenefitsSection />
      <SocialProofSection />
      <FAQSection />
      <ContactForm />
    </main>

    <div className={styles.landing__guide}>
      <StudyGuide study="landing" />
    </div>
    <Footer />
  </div>
)

export default LandingPage
