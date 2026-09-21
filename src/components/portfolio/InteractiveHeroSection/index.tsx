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
import styles from './styles.module.css'

interface InteractiveHeroSectionProps {
  t: PortfolioI18n
}

const InteractiveHeroSection = ({ t }: InteractiveHeroSectionProps) => {
  const { config } = useAppConfig()

  return (
    <div className={styles.hero}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>
          <span /> {t.recruiter.eyebrow}
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
          <a href="#projetos" className={styles.primaryButton}>
            {t.heroCTA}
            <ArrowDown size={18} aria-hidden="true" />
          </a>
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
        <img
          src="/bernardo-kra.jpg"
          alt={t.name}
          width="480"
          height="560"
          fetchPriority="high"
        />
        <figcaption>
          <span className={styles.location}>
            <MapPin size={15} aria-hidden="true" />
            Bento Gonçalves, RS
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
