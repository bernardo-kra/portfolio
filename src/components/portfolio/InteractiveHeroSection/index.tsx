import {
  ArrowDown,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from 'lucide-react'
import { useAppConfig } from '@context/AppConfigContext'
import { profile } from '@src/config/profile'
import type { PortfolioI18n } from '@src/i18n'
import TiltedCard from '@components/reactbits/TiltedCard/TiltedCard'
import ShinyText from '@components/reactbits/ShinyText/ShinyText'
import Magnet from '@components/reactbits/Magnet/Magnet'
import { useTheme } from '@components/theme'
import DotGrid from '@components/reactbits/DotGrid/DotGrid'
import { useCoarsePointer } from '@hooks/useCoarsePointer'
import styles from './styles.module.css'

interface InteractiveHeroSectionProps {
  t: PortfolioI18n
}

const InteractiveHeroSection = ({ t }: InteractiveHeroSectionProps) => {
  const { config } = useAppConfig()
  // ShinyText parses concrete colors, so it gets the accent per theme.
  const { theme } = useTheme()
  const touch = useCoarsePointer()

  return (
    <div className={styles.hero}>
      <div className={styles.dots} aria-hidden="true">
        <DotGrid
          dotSize={3.5}
          gap={22}
          baseColor={theme === 'dark' ? '#3a4458' : '#cfc6b8'}
          activeColor={theme === 'dark' ? '#ffb45c' : '#c46a1c'}
          proximity={150}
          shockRadius={260}
          shockStrength={4}
          glow={0.6}
        />
      </div>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>
          <span />{' '}
          <ShinyText
            text={t.recruiter.eyebrow}
            color={theme === 'dark' ? '#ffb45c' : '#975019'}
            shineColor={theme === 'dark' ? '#fff1dc' : '#e08a2e'}
            speed={2.4}
            delay={1.2}
          />
        </p>
        <h1 className={styles.title}>
          Bernardo
          <span>
            Kraczkowski<span className={styles.dot}>.</span>
          </span>
        </h1>
        <p className={styles.role}>{t.heroSubtitle}</p>
        <p className={styles.description}>{t.recruiter.summary}</p>
        <div className={styles.actions}>
          <Magnet padding={40} magnetStrength={4} maxOffset={10}>
            <a href="#projetos" className={styles.primaryButton}>
              {t.heroCTA}
              <ArrowDown size={18} aria-hidden="true" />
            </a>
          </Magnet>
          <a
            href={profile.resumeUrl}
            download={profile.resumeFilename}
            className={styles.secondaryButton}
          >
            <Download size={18} aria-hidden="true" />
            {t.downloadCV}
            <span className={styles.fileType}>PDF</span>
          </a>
        </div>
        {config.ui.showContactMethods && (
          <div className={styles.socials}>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={17} aria-hidden="true" />
              LinkedIn
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              <Github size={17} aria-hidden="true" />
              GitHub
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a href={`mailto:${profile.email}`}>
              <Mail size={17} aria-hidden="true" />
              {t.contactTitle}
            </a>
          </div>
        )}
        <div className={styles.specialties}>
          <span>React & TypeScript</span>
          <span>E-commerce</span>
          <span>QA & APIs</span>
        </div>
      </div>
      <figure className={styles.portrait}>
        <div className={styles.portraitHeader}>
          <span>BK / FRONTEND</span>
          <span>01</span>
        </div>
        <div className={styles.tilt}>
          <TiltedCard
            containerWidth="100%"
            containerHeight="100%"
            imageWidth="100%"
            imageHeight="100%"
            radius={10}
            rotateAmplitude={8}
            scaleOnHover={1.02}
            glare={0.22}
            shadow={0.35}
            gyroscope={false}
            floating={touch}
            intro={false}
            showTooltip={false}
          >
            <img
              src="/bernardo-kra.jpg"
              alt={t.name}
              width="480"
              height="560"
              fetchPriority="high"
            />
          </TiltedCard>
        </div>
        <figcaption>
          <span className={styles.location}>
            <MapPin size={15} aria-hidden="true" />
            {profile.location}
          </span>
          <strong>{t.recruiter.portraitNote}</strong>
        </figcaption>
        <span className={styles.sideNote} aria-hidden="true">
          BUILD. LEARN. REFINE.
        </span>
      </figure>
      <a href="#experiencia" className={styles.chapterLink}>
        <span>01 — {t.experienceTitle}</span>
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </div>
  )
}

export default InteractiveHeroSection
