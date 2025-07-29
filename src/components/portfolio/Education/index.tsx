import React from 'react'
import { Typography, Section, Card } from '@components/common'
import { useI18n } from '@src/i18n'
import styles from './styles.module.css'

interface Course {
  title: string
  platform: string
  duration: string
  lessons: string
  description: string
}

const courses: Course[] = [
  {
    title: 'React + Redux: Fundamentos e 2 Apps do Zero',
    platform: 'Cod3r',
    duration: '54,5h',
    lessons: '447 aulas',
    description: 'React e Redux com desenvolvimento de aplicações práticas.'
  },
  {
    title: 'Next.js e React Completo + TailwindCSS + Firebase',
    platform: 'Cod3r',
    duration: '28,5h',
    lessons: '230 aulas',
    description: 'Next.js, React, TailwindCSS e Firebase.'
  },
  {
    title: 'React 19 e Next.js 15 (App Router, Server Actions, Tailwind)',
    platform: 'Luiz Otávio Miranda',
    duration: '83,5h',
    lessons: '386 aulas',
    description: 'React 19 e Next.js 15 com App Router e Server Actions.'
  },
  {
    title: 'JavaScript: ES6+, OOP, Promises, Async/Await, Axios',
    platform: 'Geek University',
    duration: '27h',
    lessons: '110 aulas',
    description: 'JavaScript ES6+, OOP e requisições assíncronas.'
  },
  {
    title: 'Stack Completa JS: React, Next, Node, Vue, jQuery, Webpack, MySQL',
    platform: 'Cod3r',
    duration: '89h',
    lessons: '641 aulas',
    description: 'Stack completa JavaScript: frontend, backend e banco de dados.'
  },
  {
    title: 'Java Completo: Spring Boot, MongoDB, Hibernate, JPA, JavaFX',
    platform: 'Cod3r',
    duration: 'Em andamento',
    lessons: 'Curso completo',
    description: 'Java, Spring Boot e tecnologias relacionadas.'
  }
]

const Education: React.FC = () => {
  const { t } = useI18n()

  return (
    <Section id="educacao" spacing="xl">
      <Typography variant="h2" className={styles.educationTitle}>
        Formação <Typography as="span" color="brand" className={styles.highlight}>Acadêmica</Typography>
      </Typography>
      
      <div className={styles.educationContainer}>
        <div className={styles.academicSection}>
          <Typography variant="h4" weight="semibold" className={styles.sectionTitle}>
            Graduação
          </Typography>
          <Card className={styles.academicCard}>
            <Typography variant="h5" weight="semibold" className={styles.degreeTitle}>
              Análise e Desenvolvimento de Sistemas
            </Typography>
            <Typography variant="body2" color="muted" className={styles.institution}>
              Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Sul
            </Typography>
            <Typography variant="caption" color="muted" className={styles.period}>
              Campus Bento Gonçalves • 2019 - 2024
            </Typography>
          </Card>
        </div>

        <div className={styles.coursesSection}>
          <Typography variant="h4" weight="semibold" className={styles.sectionTitle}>
            Cursos Complementares
          </Typography>
          <div className={styles.coursesGrid}>
            {courses.map((course, index) => (
              <Card key={index} className={styles.courseCard}>
                <div className={styles.courseHeader}>
                  <Typography variant="h6" weight="semibold" className={styles.courseTitle}>
                    {course.title}
                  </Typography>
                  <div className={styles.courseMeta}>
                    <Typography variant="caption" color="brand" className={styles.platform}>
                      {course.platform}
                    </Typography>
                    <Typography variant="caption" color="muted" className={styles.duration}>
                      {course.duration} • {course.lessons}
                    </Typography>
                  </div>
                </div>
                <Typography variant="body2" color="muted" className={styles.courseDescription}>
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