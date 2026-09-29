import React from 'react'
import { useI18n } from '@src/i18n'
import { Typography, Section, Card } from '@components/common'
import styles from './styles.module.css'

const Education: React.FC = () => {
  const { t } = useI18n()
  const education = t.education
  return (
    <Section id="educacao" spacing="lg">
      <Typography variant="h2" className={styles.educationTitle}>
        {education.title}{' '}
        <Typography as="span" color="brand" className={styles.highlight}>
          {education.highlight}
        </Typography>
      </Typography>

      <div className={styles.educationContainer}>
        <div className={styles.academicSection}>
          <Typography
            variant="h4"
            weight="semibold"
            className={styles.sectionTitle}
          >
            {education.degreeLabel}
          </Typography>
          <Card className={styles.academicCard}>
            <Typography
              variant="h5"
              weight="semibold"
              className={styles.degreeTitle}
            >
              {education.degree}
            </Typography>
            <Typography
              variant="body2"
              color="muted"
              className={styles.institution}
            >
              {education.institution}
            </Typography>
            <Typography
              variant="caption"
              color="muted"
              className={styles.period}
            >
              {education.campus} • 2019 - 2024
            </Typography>
          </Card>
        </div>

        <div className={styles.coursesSection}>
          <Typography
            variant="h4"
            weight="semibold"
            className={styles.sectionTitle}
          >
            {education.coursesLabel}
          </Typography>
          <div className={styles.coursesGrid}>
            {education.courses.map((course, index) => (
              <Card key={index} className={styles.courseCard}>
                <div className={styles.courseHeader}>
                  <Typography
                    variant="h6"
                    weight="semibold"
                    className={styles.courseTitle}
                  >
                    {course.title}
                  </Typography>
                  <div className={styles.courseMeta}>
                    <Typography
                      variant="caption"
                      color="brand"
                      className={styles.platform}
                    >
                      {course.platform}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="muted"
                      className={styles.duration}
                    >
                      {course.duration} • {course.lessons}
                    </Typography>
                  </div>
                </div>
                <Typography
                  variant="body2"
                  color="muted"
                  className={styles.courseDescription}
                >
                  {course.description}
                </Typography>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Education
