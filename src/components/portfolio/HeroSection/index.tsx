import React from 'react'
import { Typography, Image } from '@components/common'
import styles from './styles.module.css'
import Container from '@components/common/Container'

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
        <div className={styles.heroContent}>
          <div className={styles.heroAvatarWrapper}>
            <Image 
              src="/my.png" 
              alt="Avatar" 
              variant="avatar"
              size="xl"
              className={styles.heroAvatarImg}
            />
          </div>
          <Typography variant="h1" className={styles.heroTitle}>
            {t.heroTitle || t.name}
          </Typography>
          <Typography variant="body1" color="muted" className={styles.heroSubtitle}>
            {t.heroSubtitle || t.role}
          </Typography>
        </div>
      </section>
    </Container>
  )
}

export default HeroSection