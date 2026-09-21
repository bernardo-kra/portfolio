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

const Portfolio = () => {
  const { t, lang, setLang } = useI18n()
  const studies = [
    {
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
      route: '/pomodoro',
      title: t.pomodoroTitle,
      text: t.recruiter.timerStudy,
      tag: 'STATE / REACT',
      visual: '25:00',
      kind: 'timer',
    },
    {
      route: '/generative',
      title: t.generativeTitle,
      text: t.recruiter.artStudy,
      tag: 'CANVAS / ALGORITHMS',
      visual: '✳',
      kind: 'art',
    },
    {
      route: '/experimental3d',
      title: 'Dock 07',
      text: t.recruiter.dockStudy,
      tag: 'CSS / INTERACTION',
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
              ))}
            </div>
            <p className={styles.studyNote}>{t.recruiter.studyNote}</p>
          </section>
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
