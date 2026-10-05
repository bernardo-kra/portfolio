import React from 'react'
import {
  Mail,
  Linkedin,
  Github,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react'
import { Typography, Section } from '@components/common'
import { useI18n } from '@src/i18n'
import { useAppConfig } from '@context/AppConfigContext'
import { trackEvent } from '@hooks/useAnalytics'
import ContactDisabled from '../ContactDisabled'
import styles from './styles.module.css'
import { profile } from '@src/config/profile'
import CopyEmailButton from '@components/common/CopyEmailButton'

const Contact: React.FC = () => {
  const { t } = useI18n()
  const { config } = useAppConfig()

  if (!config.ui.showContactMethods) {
    return <ContactDisabled />
  }

  const contactMethods = [
    {
      type: 'email',
      label: t.emailLabel,
      value: t.email,
      href: `mailto:${t.email}`,
      icon: Mail,
    },
    {
      type: 'whatsapp',
      label: t.whatsappLabel,
      value: profile.whatsappLabel,
      href: `https://wa.me/${profile.whatsappNumber}`,
      icon: MessageCircle,
    },
    {
      type: 'github',
      label: t.githubLabel,
      value: t.github,
      href: `https://${t.github}`,
      icon: Github,
    },
    {
      type: 'linkedin',
      label: t.linkedinLabel,
      value: 'Bernardo Chimoka',
      href: `https://linkedin.com${t.linkedin}`,
      icon: Linkedin,
    },
  ]

  const handleContactClick = (type: string) => {
    trackEvent('contact_click', 'engagement', type)
  }

  return (
    <Section id="contato" spacing="lg">
      <div className={styles.contactWrapper}>
        <div className={styles.contactHeader}>
          <Typography
            variant="h3"
            align="center"
            className={styles.contactTitle}
          >
            {t.contactTitle}
          </Typography>
          <Typography
            variant="body1"
            color="muted"
            align="center"
            className={styles.contactSubtitle}
          >
            {t.contactSubtitle}
          </Typography>
        </div>

        <div className={styles.contactGrid}>
          {contactMethods.map((method, index) => (
            <a
              key={method.type}
              href={method.href}
              target={method.type === 'email' ? undefined : '_blank'}
              rel={method.type === 'email' ? undefined : 'noopener noreferrer'}
              className={styles.contactCard}
              onClick={() => handleContactClick(method.type)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.contactCardIcon}>
                <method.icon size={24} />
              </div>
              <div className={styles.contactCardContent}>
                <Typography
                  variant="overline"
                  color="brand"
                  className={styles.contactCardLabel}
                >
                  {method.label}
                </Typography>
                <Typography
                  variant="body1"
                  weight="semibold"
                  className={styles.contactCardValue}
                >
                  {method.value}
                </Typography>
              </div>
              <div className={styles.contactCardArrow}>
                <ArrowUpRight size={16} aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>

        <CopyEmailButton email={t.email} />

        <div className={styles.contactFooter}>
          <a
            href={profile.resumeUrl}
            download={profile.resumeFilename}
            className={styles.resumeLink}
            title={t.recruiter.pdfLanguage}
          >
            {t.downloadCV} · PDF ↓
          </a>
          <Typography
            variant="body2"
            color="muted"
            align="center"
            className={styles.contactMessage}
          >
            {t.contactMessage}
          </Typography>
        </div>
      </div>
    </Section>
  )
}

export default Contact
