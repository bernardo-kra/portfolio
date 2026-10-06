import React, { useState } from 'react'
import { Typography, Card } from '@components/common'
import { useI18n } from '@src/i18n'
import { profile } from '@src/config/profile'
import { Code, Award, Users, Calendar, MapPin, Briefcase } from 'lucide-react'
import styles from './styles.module.css'
type RenderAboutDetailsProps = {
  t: import('../../../i18n/index').PortfolioI18n
  showAll: boolean
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>
  lang: import('../../../i18n/index').Lang
  specializations: { name: string; color: string }[]
  achievements: {
    title: string
    description: string
    icon: React.ForwardRefExoticComponent<
      Omit<import('lucide-react').LucideProps, 'ref'> &
        React.RefAttributes<SVGSVGElement>
    >
  }[]
}

function renderAboutDetails({
  t,
  showAll,
  setShowAll,
  lang,
  specializations,
  achievements,
}: RenderAboutDetailsProps) {
  return (
    <div className={styles.aboutmeContent}>
      <div className={styles.specializationsColumn}>
        <Typography variant="h4" className={styles.columnTitle}>
          {t.aboutMeSpecializations.title}
        </Typography>
        <button
          className={styles.expandButton}
          aria-expanded={showAll}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll
            ? lang === 'pt'
              ? 'Mostrar menos'
              : 'Show less'
            : lang === 'pt'
              ? 'Ver todas as tecnologias'
              : 'View all technologies'}
        </button>
        <div className={styles.specializationsList}>
          {specializations
            .slice(0, showAll ? undefined : 6)
            .map((spec, index) => (
              <div key={index} className={styles.specializationTag}>
                <div
                  className={styles.specializationColor}
                  style={{ backgroundColor: spec.color }}
                />
                <Typography
                  variant="body2"
                  className={styles.specializationName}
                >
                  {spec.name}
                </Typography>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.achievementsColumn}>
        <Typography variant="h4" className={styles.columnTitle}>
          {t.aboutMeAchievements.title}
        </Typography>
        <div className={styles.achievementsList}>
          {achievements.map((achievement, index) => (
            <Card key={index} className={styles.achievementCard}>
              <div className={styles.achievementIcon}>
                <achievement.icon size={20} />
              </div>
              <div className={styles.achievementContent}>
                <Typography variant="body2" className={styles.achievementTitle}>
                  {achievement.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="muted"
                  className={styles.achievementDescription}
                >
                  {achievement.description}
                </Typography>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const AboutMe: React.FC = () => {
  const [showAll, setShowAll] = useState(false)
  const { t, lang } = useI18n()

  const metrics = [
    {
      icon: Calendar,
      value: '5+',
      label: t.aboutMeMetrics.experience,
      description: t.aboutMeMetrics.experienceDesc,
    },
    {
      icon: Code,
      value: 'React / TS',
      label: lang === 'pt' ? 'Stack principal' : 'Core stack',
      description:
        lang === 'pt'
          ? 'Interfaces e integração de APIs'
          : 'Interfaces and API integration',
    },
    {
      icon: Briefcase,
      value: 'E-commerce',
      label:
        lang === 'pt' ? 'Experiência profissional' : 'Professional experience',
      description:
        lang === 'pt'
          ? 'React e Oracle Commerce Cloud'
          : 'React and Oracle Commerce Cloud',
    },
    {
      icon: Users,
      value: '3+',
      label: t.aboutMeMetrics.qa,
      description: t.aboutMeMetrics.qaDesc,
    },
  ]

  const specializations = [
    { name: 'React', color: '#61dafb' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'JavaScript', color: '#f7df1e' },
    { name: 'CSS Modules', color: '#1572b6' },
    { name: 'Next', color: '#646cff' },
    { name: 'Git', color: '#f05032' },
    { name: 'Express', color: '#000000' },
    { name: 'Jest', color: '#99425b' },
    { name: 'Cypress', color: '#17202c' },
    { name: 'CI/CD', color: '#00c7b7' },
    { name: 'Storybook', color: '#ff4785' },
    { name: 'Oracle Commerce Cloud', color: '#ff6b35' },
    { name: 'SQL', color: '#336791' },
  ]

  const achievements = [
    {
      title: t.aboutMeAchievements.frontend,
      description: t.aboutMeAchievements.frontendDesc,
      icon: Code,
    },
    {
      title: t.aboutMeAchievements.architecture,
      description: t.aboutMeAchievements.architectureDesc,
      icon: Award,
    },
    {
      title: t.aboutMeAchievements.apis,
      description: t.aboutMeAchievements.apisDesc,
      icon: Users,
    },
    {
      title: t.aboutMeAchievements.testing,
      description: t.aboutMeAchievements.testingDesc,
      icon: Award,
    },
    {
      title: t.aboutMeAchievements.documentation,
      description: t.aboutMeAchievements.documentationDesc,
      icon: Code,
    },
  ]

  return (
    <div className={styles.aboutmeSection}>
      <div className={styles.aboutmeHeader}>
        <Typography variant="h2" className={styles.aboutmeTitle}>
          {t.aboutTitle}
        </Typography>
        <Typography
          variant="body1"
          color="muted"
          className={styles.aboutmeSubtitle}
        >
          {t.aboutDescription}
        </Typography>
        <div className={styles.aboutmeLocation}>
          <MapPin size={16} />
          <span>
            {profile.location} - {lang === 'pt' ? 'Brasil' : 'Brazil'}
          </span>
        </div>
      </div>

      <div className={styles.aboutmeMetrics}>
        {metrics.map((metric, index) => (
          <Card key={index} className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <metric.icon size={24} />
            </div>
            <div className={styles.metricContent}>
              <Typography variant="h3" className={styles.metricValue}>
                {metric.value}
              </Typography>
              <Typography variant="body2" className={styles.metricLabel}>
                {metric.label}
              </Typography>
              <Typography
                variant="caption"
                color="muted"
                className={styles.metricDescription}
              >
                {metric.description}
              </Typography>
            </div>
          </Card>
        ))}
      </div>

      {renderAboutDetails({
        t,
        showAll,
        setShowAll,
        lang,
        specializations,
        achievements,
      })}
    </div>
  )
}

export default AboutMe
