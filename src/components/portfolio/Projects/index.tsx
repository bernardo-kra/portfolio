import React from 'react'
import { Typography, Button, Card, Section, Tag, Image } from '@components/common'
import { useI18n } from '@src/i18n'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import { 
  SiReact, 
  SiJavascript, 
  SiHtml5, 
  SiCss3, 
  SiSass, 
  SiTypescript, 
  SiNodedotjs, 
  SiVite, 
  SiGit, 
  SiBitbucket, 
  SiJira, 
  SiPostman, 
  SiFigma, 
  SiJest,
  SiNextdotjs,
  SiCssmodules,
  SiInsomnia,
  SiOracle,
  SiTailwindcss,
  SiFirebase,
  SiMongodb,
  SiSpringboot,
  SiJenkins,
  SiSqlite
} from 'react-icons/si'

interface Project {
  title: string
  description: string
  link: string
  img: string
  tech: string[]
  category: string
  date: string
}

const projects: Project[] = [
  {
    title: 'Generative Pattern Studio',
    description: 'Aplicação de arte generativa com algoritmos procedurais para criar padrões geométricos, fractais e simulações em tempo real.',
    link: '/portfolio/generative',
    img: '/programming.png',
    tech: ['React', 'TypeScript', 'Canvas API', 'Algoritmos Procedurais'],
    category: 'Arte Generativa',
    date: '2024'
  },
  {
    title: 'E-commerce OCC',
    description: 'Desenvolvimento de componentes React para Oracle Commerce Cloud com foco em performance e usabilidade.',
    link: 'https://github.com/bernardo-kra',
    img: '/programming.png',
    tech: ['React', 'Oracle Commerce Cloud', 'JavaScript', 'CSS3'],
    category: 'E-commerce',
    date: '2021 - Atual'
  },
  {
    title: 'Soluções de Pagamento',
    description: 'Integração de múltiplos métodos de pagamento para plataformas de e-commerce internacionais.',
    link: 'https://github.com/bernardo-kra',
    img: '/my.png',
    tech: ['React', 'REST APIs', 'Mercado Pago', 'OCC'],
    category: 'Integração',
    date: '2022 - 2023'
  },
  {
    title: 'Portfólio React',
    description: 'Portfólio profissional desenvolvido com React, TypeScript e Vite, com tema escuro/claro.',
    link: 'https://github.com/bernardo-kra/portfolio',
    img: '/manProgramming.png',
    tech: ['React', 'TypeScript', 'Vite', 'CSS Modules'],
    category: 'Frontend',
    date: '2024'
  }
]

const skills = [
  { name: 'React', icon: <SiReact className="icon-react" /> },
  { name: 'JavaScript', icon: <SiJavascript className="icon-javascript" /> },
  { name: 'HTML5', icon: <SiHtml5 className="icon-html5" /> },
  { name: 'CSS3', icon: <SiCss3 className="icon-css3" /> },
  { name: 'SASS', icon: <SiSass className="icon-sass" /> },
  { name: 'TypeScript', icon: <SiTypescript className="icon-typescript" /> },
  { name: 'Node.js', icon: <SiNodedotjs className="icon-nodejs" /> },
  { name: 'Next.js', icon: <SiNextdotjs className="icon-nextjs" /> },
  { name: 'Vite', icon: <SiVite className="icon-vite" /> },
  { name: 'CSS Modules', icon: <SiCssmodules className="icon-cssmodules" /> },
  { name: 'TailwindCSS', icon: <SiTailwindcss className="icon-tailwindcss" /> },
  { name: 'REST APIs', icon: <SiInsomnia className="icon-insomnia" /> },
  { name: 'OCC', icon: <SiOracle className="icon-oracle" /> },
  { name: 'Firebase', icon: <SiFirebase className="icon-firebase" /> },
  { name: 'MongoDB', icon: <SiMongodb className="icon-mongodb" /> },
  { name: 'Spring Boot', icon: <SiSpringboot className="icon-springboot" /> },
  { name: 'Jenkins', icon: <SiJenkins className="icon-jenkins" /> },
  { name: 'SQL', icon: <SiSqlite className="icon-sqlite" /> },
  { name: 'Git', icon: <SiGit className="icon-git" /> },
  { name: 'Bitbucket', icon: <SiBitbucket className="icon-bitbucket" /> },
  { name: 'Jira', icon: <SiJira className="icon-jira" /> },
  { name: 'Postman', icon: <SiPostman className="icon-postman" /> },
  { name: 'Figma', icon: <SiFigma className="icon-figma" /> },
  { name: 'Jest', icon: <SiJest className="icon-jest" /> },
]

const Projects: React.FC = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  
  const handleProjectClick = (link: string) => {
    if (link.startsWith('/')) {
      navigate(link)
    } else {
      window.open(link, '_blank')
    }
  }
  
  const handleButtonClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation()
    if (link.startsWith('/')) {
      navigate(link)
    } else {
      window.open(link, '_blank')
    }
  }
  
  return (
    <Section id="projetos" spacing="xl">
      <Typography variant="h2" align="center" className={styles.projectsTitle}>
        Projetos <Typography as="span" color="brand">Recentes</Typography>
      </Typography>
      
      <div className={styles.projectsContainer}>
        {projects.map((project, idx) => (
          <div key={idx} className={styles.projectCard}>
            <div className={styles.projectImageContainer}>
              <Image 
                src={project.img} 
                alt={`Screenshot do projeto ${project.title}`} 
                className={styles.projectImage}
              />
              <div className={styles.projectOverlay}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={styles.projectButton}
                  onClick={(e) => handleButtonClick(e, project.link)}
                >
                  →
                </Button>
              </div>
            </div>
            
            <div className={styles.projectContent}>
              <div className={styles.projectMeta}>
                <Tag variant="default" size="sm" className={styles.projectCategory}>
                  {project.category}
                </Tag>
                <Typography variant="caption" color="muted" className={styles.projectDate}>
                  Bernardo Kraczkowski • {project.date}
                </Typography>
              </div>
              
              <Typography variant="h4" weight="semibold" className={styles.projectTitle}>
                {project.title}
              </Typography>
              
              <Typography variant="body2" color="muted" className={styles.projectDescription}>
                {project.description}
              </Typography>
              
                             <div className={styles.projectTech}>
                 {project.tech.map((tech: string) => (
                   <Tag key={tech} variant="default" size="sm" className={styles.techTag}>
                     {tech}
                   </Tag>
                 ))}
               </div>
            </div>
          </div>
        ))}
        
        <Section spacing="lg" className={styles.skillsSection}>
          <Typography variant="h2" align="center" className={styles.skillsTitle}>
            Habilidades Técnicas
          </Typography>
          <div className={styles.skillsList}>
            {skills.map((skill) => (
              <Tag key={skill.name} variant="default" icon={skill.icon} size="md">
                {skill.name}
              </Tag>
            ))}
          </div>
        </Section>
      </div>
    </Section>
  )
}

export default Projects