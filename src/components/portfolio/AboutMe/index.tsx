import React from 'react'
import { Typography, Card } from '@components/common'
import { useI18n } from '@src/i18n'
import { Code, Award, Users, Calendar, MapPin, Briefcase } from 'lucide-react'
import styles from './styles.module.css'

const AboutMe: React.FC = () => {
  const { t } = useI18n()

  const metrics = [
    {
      icon: Calendar,
      value: '4+',
      label: t.aboutMeMetrics.experience,
      description: t.aboutMeMetrics.experienceDesc
    },
    {
      icon: Code,
      value: '15+',
      label: t.aboutMeMetrics.technologies,
      description: t.aboutMeMetrics.technologiesDesc
    },
    {
      icon: Briefcase,
      value: '20+',
      label: t.aboutMeMetrics.projects,
      description: t.aboutMeMetrics.projectsDesc
    },
    {
      icon: Users,
      value: '3+',
      label: t.aboutMeMetrics.qa,
      description: t.aboutMeMetrics.qaDesc
    }
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
    { name: 'SQL', color: '#336791' }
  ]

  const achievements = [
    {
      title: t.aboutMeAchievements.frontend,
      description: t.aboutMeAchievements.frontendDesc,
      icon: Code
    },
    {
      title: t.aboutMeAchievements.architecture,
      description: t.aboutMeAchievements.architectureDesc,
      icon: Award
    },
    {
      title: t.aboutMeAchievements.apis,
      description: t.aboutMeAchievements.apisDesc,
      icon: Users
    },
    {
      title: t.aboutMeAchievements.testing,
      description: t.aboutMeAchievements.testingDesc,
      icon: Award
    },
    {
      title: t.aboutMeAchievements.documentation,
      description: t.aboutMeAchievements.documentationDesc,
      icon: Code
    }
  ]

  return (
    <div className={styles.aboutmeSection}>
      <div className={styles.aboutmeHeader}>
        <Typography variant="h2" className={styles.aboutmeTitle}>
          {t.aboutTitle}
        </Typography>
        <Typography variant="body1" color="muted" className={styles.aboutmeSubtitle}>
          {t.aboutDescription}
        </Typography>
        <div className={styles.aboutmeLocation}>
          <MapPin size={16} />
          <span>Bento Gonçalves, RS - Brasil</span>
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
              <Typography variant="caption" color="muted" className={styles.metricDescription}>
                {metric.description}
              </Typography>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.aboutmeContent}>
        <div className={styles.specializationsColumn}>
          <Typography variant="h4" className={styles.columnTitle}>
            {t.aboutMeSpecializations.title}
          </Typography>
          <div className={styles.specializationsList}>
            {specializations.map((spec, index) => (
              <div key={index} className={styles.specializationTag}>
                <div 
                  className={styles.specializationColor}
                  style={{ backgroundColor: spec.color }}
                />
                <Typography variant="body2" className={styles.specializationName}>
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
                  <Typography variant="caption" color="muted" className={styles.achievementDescription}>
                    {achievement.description}
                  </Typography>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutMe