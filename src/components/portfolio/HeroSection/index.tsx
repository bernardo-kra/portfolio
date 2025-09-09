import React from 'react'
import { Typography } from '@components/common'
import AdvancedProfilePhoto from '../AdvancedProfilePhoto'
import CodeBackground from '../CodeBackground'
import styles from './styles.module.css'
import Container from '@components/common/Container'
import bernardoPhoto from '/bernardo-kra.jpg'

interface HeroSectionProps {
  t: {
    heroTitle?: string
    name?: string
    heroSubtitle?: string
    role?: string
  }
}

const HeroSection: React.FC<HeroSectionProps> = ({ t }) => {
  return (
    <Container className={styles.heroContainer}>
      <section className={styles.heroSection}>
        <CodeBackground className={styles.codeBackground} />
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <AdvancedProfilePhoto 
              src={bernardoPhoto} 
              alt="Bernardo Kraczkowski - Desenvolvedor Frontend" 
            />
          </div>
          <div className={styles.heroRight}>
            <Typography variant="h1" className={styles.heroTitle}>
              {t.heroTitle || t.name}
            </Typography>
            <Typography variant="body1" color="muted" className={styles.heroSubtitle}>
              {t.heroSubtitle || t.role}
            </Typography>
          </div>
        </div>
      </section>
    </Container>
  )
}

export default HeroSection