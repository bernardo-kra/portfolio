import React from 'react'
import { Mail, Linkedin, Github, MessageCircle } from 'lucide-react'
import { Typography, Card, Section } from '@components/common'
import { useI18n } from '@src/i18n'
import { useAppConfig } from '@context/AppConfigContext'
import { trackEvent } from '@hooks/useAnalytics'
import ContactDisabled from '../ContactDisabled'
import styles from './styles.module.css'

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
      icon: Mail
    },
    {
      type: 'whatsapp',
      label: t.whatsappLabel,
      value: '+55 (54) 9 96206-8111',
      href: 'https://wa.me/5549962068111',
      icon: MessageCircle
    },
    {
      type: 'github',
      label: t.githubLabel,
      value: t.github,
      href: `https://${t.github}`,
      icon: Github
    },
    {
      type: 'linkedin',
      label: t.linkedinLabel,
      value: 'Bernardo Chimoka',
      href: `https://linkedin.com${t.linkedin}`,
      icon: Linkedin
    }
  ]

  const handleContactClick = (type: string, href: string) => {
    trackEvent('contact_click', 'engagement', type)
    
    if (type === 'email') {
      window.location.href = href
    } else {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Section id="contato" spacing="lg">
      <div className={styles.contactWrapper}>
        <div className={styles.contactHeader}>
          <Typography variant="h3" align="center" className={styles.contactTitle}>
            {t.contactTitle}
          </Typography>
          <Typography variant="body1" color="muted" align="center" className={styles.contactSubtitle}>
            {t.contactSubtitle}
          </Typography>
        </div>

        <div className={styles.contactGrid}>
          {contactMethods.map((method, index) => (
            <Card
              key={method.type}
              variant="default"
              hover
              clickable
              className={styles.contactCard}
              onClick={() => handleContactClick(method.type, method.href)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.contactCardIcon}>
                <method.icon size={24} />
              </div>
              <div className={styles.contactCardContent}>
                <Typography variant="overline" color="brand" className={styles.contactCardLabel}>
                  {method.label}
                </Typography>
                <Typography variant="body1" weight="semibold" className={styles.contactCardValue}>
                  {method.value}
                </Typography>
              </div>
              <div className={styles.contactCardArrow}>
                <MessageCircle size={16} />
              </div>
            </Card>
          ))}
        </div>

        <div className={styles.contactFooter}>
          <Typography variant="body2" color="muted" align="center" className={styles.contactMessage}>
            {t.contactMessage}
          </Typography>
        </div>
      </div>
    </Section>
  )
}

export default Contact