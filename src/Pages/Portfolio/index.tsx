import { Link } from 'react-router-dom'
import { ArrowUpRight, Github } from 'lucide-react'
import { useI18n } from '@src/i18n'
import { profile } from '@src/config/profile'
import AboutMe from '@components/portfolio/AboutMe'
import Contact from '@components/portfolio/Contact'
import InteractiveHeroSection from '@components/portfolio/InteractiveHeroSection'
import PortfolioNav from '@components/portfolio/PortfolioNav'
import WorkExperienceTimeline from '@components/portfolio/WorkExperienceTimeline'
import Education from '@components/portfolio/Education'
import Footer from '@components/portfolio/Footer'
import styles from './styles.module.css'
import Ribbon from '@components/common/Ribbon'
type RenderPortfolioStudiesProps = {
  t: import('../../i18n/index').PortfolioI18n
  studies: {
    context: string
    route: string
    title: string
    text: string
    tag: string
    visual: string
    kind: string
  }[]
  lang: import('../../i18n/index').Lang
}

function renderPortfolioStudies({
  t,
  studies,
  lang,
}: RenderPortfolioStudiesProps) {
  return (
    <section
      id="projetos"
      className={styles.studies}
      aria-labelledby="studies-title"
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>02 / {t.recruiter.learning}</p>
          <h2 id="studies-title">{t.myProjects}</h2>
          <p>{t.projectsSubtitle}</p>
        </div>
        <a
          href={profile.github + '/portfolio'}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.sourceLink}
        >
          <Github size={18} aria-hidden="true" />
          {t.recruiter.viewCode}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <div className={styles.studyGrid}>
        {studies.map((study, index) => (
          <article key={study.route} className={styles.studyEntry}>
            <Link
              to={study.route}
              className={styles.studyCard}
              key={study.route}
            >
              <div
                className={styles.studyVisual}
                data-kind={study.kind}
                aria-hidden="true"
              >
                <span className={styles.studyIndex}>0{index + 1}</span>
                <span className={styles.studyMark}>{study.visual}</span>
                <span className={styles.studyTag}>{study.tag}</span>
              </div>
              <div className={styles.studyBody}>
                <h3>
                  {study.title}
                  <ArrowUpRight size={20} aria-hidden="true" />
                </h3>
                <p>{study.text}</p>
                <span className={styles.studyAction}>
                  {t.recruiter.openStudy} →
                </span>
              </div>
            </Link>
            <details className={styles.studyDetails}>
              <summary>
                {lang === 'pt' ? 'Como foi construído' : 'How it was built'}
              </summary>
              <p>{study.context}</p>
            </details>
          </article>
        ))}
      </div>
      <p className={styles.studyNote}>{t.recruiter.studyNote}</p>
    </section>
  )
}

const Portfolio = () => {
  const { t, lang, setLang } = useI18n()
  const studies = [
    {
      context:
        lang === 'pt'
          ? 'Desafio: transformar uma referência visual em uma página utilizável. Decisão: separar galeria e filtros. Resultado: composição responsiva com navegação entre categorias.'
          : 'Challenge: turn a visual reference into a usable page. Decision: separate the gallery and filters. Result: a responsive composition with category navigation.',
      route: '/agency',
      title: 'Forma — Creative Studio',
      text:
        lang === 'pt'
          ? 'Uma referência visual transformada em interface: composição editorial, galeria filtrável e layout responsivo.'
          : 'A visual reference turned into an interface: editorial composition, a filterable gallery and responsive layout.',
      tag: 'DESIGN / RESPONSIVE',
      visual: 'f.',
      kind: 'agency',
    },
    {
      context:
        lang === 'pt'
          ? 'Desafio: organizar ciclos de foco e tarefas. Decisão: modelar os estados do temporizador. Resultado: uma experiência de foco com controle de tarefas.'
          : 'Challenge: organize focus cycles and tasks. Decision: model the timer states. Result: a focus experience with task management.',
      route: '/pomodoro',
      title: t.pomodoroTitle,
      text: t.recruiter.timerStudy,
      tag: 'STATE / REACT',
      visual: '25:00',
      kind: 'timer',
    },
    {
      context:
        lang === 'pt'
          ? 'Desafio: transformar algoritmos em composição visual. Decisão: desenhar em Canvas. Resultado: exploração interativa de padrões.'
          : 'Challenge: turn algorithms into visual compositions. Decision: render with Canvas. Result: interactive pattern exploration.',
      route: '/generative',
      title: t.generativeTitle,
      text: t.recruiter.artStudy,
      tag: 'CANVAS / ALGORITHMS',
      visual: '✳',
      kind: 'art',
    },
    {
      context:
        lang === 'pt'
          ? 'Desafio: conectar exploração, sintonia e abertura de portões. Decisão: representar a missão em estados explícitos e usar SVG. Resultado: uma sequência interativa que pode ser reiniciada.'
          : 'Challenge: connect exploration, signal tuning and gate controls. Decision: use explicit mission states and SVG. Result: a replayable interactive sequence.',
      route: '/experimental3d',
      title: 'Neon Bay',
      text: t.recruiter.dockStudy,
      tag: 'SVG / INTERACTION',
      visual: '07',
      kind: 'dock',
    },
  ]

  return (
    <div className={styles.portfolio}>
      <a className={styles.skipLink} href="#conteudo">
        {t.recruiter.skipContent}
      </a>
      <PortfolioNav t={t} lang={lang} setLang={setLang} />
      <main id="conteudo">
        <InteractiveHeroSection t={t} />
        <Ribbon
          items={
            lang === 'pt'
              ? [
                  'Frontend com React',
                  'TypeScript na prática',
                  'E-commerce & OCC',
                  'Experiência em QA',
                  'Código disponível no GitHub',
                ]
              : [
                  'React frontend',
                  'TypeScript in practice',
                  'E-commerce & OCC',
                  'QA experience',
                  'Code available on GitHub',
                ]
          }
          tone="mint"
        />
        <div className={styles.content}>
          <WorkExperienceTimeline />
          {renderPortfolioStudies({ t, studies, lang })}
          <section id="sobre" className={styles.about}>
            <AboutMe />
          </section>
          <Education />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Portfolio
