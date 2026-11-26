import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '@src/i18n'
import { profile } from '@src/config/profile'
import { privacySections } from './content'
import styles from './styles.module.css'

function renderRights(pt: boolean, index: number) {
  return (
    <section id={`privacy-${index}`} data-privacy-section data-index={index}>
      <h2>
        <span>{String(index + 1).padStart(2, '0')}</span>
        {pt ? 'Exercer seus direitos' : 'Exercise your rights'}
      </h2>
      <a
        className={styles.email}
        href={`mailto:${profile.email}?subject=${encodeURIComponent(pt ? 'Solicitação de privacidade — portfólio' : 'Portfolio privacy request')}`}
      >
        {profile.email}
      </a>
      <p>
        {pt
          ? 'Descreva sua solicitação. Não envie senhas ou documentos sensíveis no primeiro contato.'
          : 'Describe your request. Do not send passwords or sensitive documents in your first message.'}
      </p>
      <a
        href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares"
        target="_blank"
        rel="noreferrer"
      >
        {pt
          ? 'Conheça seus direitos na ANPD'
          : 'Learn about your rights at ANPD'}{' '}
        ↗
      </a>
    </section>
  )
}

export default function Privacy() {
  const { lang, setLang } = useI18n()
  const pt = lang === 'pt'
  const sections = privacySections(pt)
  const allSections: [string, string][] = [
    ...sections,
    [pt ? 'Exercer seus direitos' : 'Exercise your rights', ''],
  ]
  const [active, setActive] = useState(0)

  // Highlights the section being read in the index.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible[0])
          setActive(Number(visible[0].target.getAttribute('data-index')))
      },
      { rootMargin: '-20% 0px -65% 0px' }
    )
    document
      .querySelectorAll('[data-privacy-section]')
      .forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [lang])

  return (
    <main className={styles.page}>
      <nav className={styles.topbar}>
        <Link to="/portfolio">← {pt ? 'Portfólio' : 'Portfolio'}</Link>
        <button onClick={() => setLang(pt ? 'en' : 'pt')}>
          {pt ? 'English' : 'Português'}
        </button>
      </nav>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{pt ? 'Documento' : 'Document'} / LGPD</p>
        <h1>{pt ? 'Privacidade e seus dados' : 'Privacy and your data'}</h1>
        <p className={styles.lead}>
          {pt
            ? 'Você pode explorar os estudos sem criar uma conta e sem aceitar análise.'
            : 'You can explore the studies without an account or analytics consent.'}
        </p>
      </header>
      <div className={styles.layout}>
        <nav
          className={styles.toc}
          aria-label={pt ? 'Nesta página' : 'On this page'}
        >
          <ol>
            {allSections.map(([title], index) => (
              <li key={title}>
                <a
                  href={`#privacy-${index}`}
                  aria-current={active === index ? 'true' : undefined}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.content}>
          {sections.map(([title, text], index) => (
            <section
              key={title}
              id={`privacy-${index}`}
              data-privacy-section
              data-index={index}
            >
              <h2>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {title}
              </h2>
              <p>{text}</p>
            </section>
          ))}
          {renderRights(pt, sections.length)}
        </div>
      </div>
    </main>
  )
}
