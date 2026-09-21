import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '@src/i18n'
import { profile } from '@src/config/profile'
import styles from './styles.module.css'

const guides = {
  pomodoro: {
    pt: [
      'Seu próximo bloco de foco',
      'Escolha uma tarefa, inicie o timer e faça uma pausa ao terminar. Ajuste a duração nos controles quando precisar.',
      'Explorar o laboratório visual',
    ],
    en: [
      'Your next focus session',
      'Pick a task, start the timer and take a break when it ends. Adjust the duration in the controls when needed.',
      'Explore the visual lab',
    ],
    next: '/generative',
  },
  landing: {
    pt: [
      'Do estudo à experiência profissional',
      'Esta página é um estudo de comunicação e interface. Conheça também minha trajetória e as tecnologias com que trabalho.',
      'Conhecer meu perfil',
    ],
    en: [
      'From study to professional experience',
      'This page explores communication and interface design. Discover my background and the technologies I work with.',
      'View my profile',
    ],
    next: '/portfolio',
  },
  dock: {
    pt: [
      'Explore o painel, observe a resposta',
      'Abra o portal, ajuste a energia e altere os sinais. Cada controle muda uma parte da cena.',
      'Experimentar o Pomodoro',
    ],
    en: [
      'Explore the controls, see the response',
      'Open the portal, adjust the energy and change the signals. Each control changes part of the scene.',
      'Try the Pomodoro',
    ],
    next: '/pomodoro',
  },
}
const StudyGuide = ({ study }: { study: keyof typeof guides }) => {
  const { lang } = useI18n()
  const guide = guides[study]
  const [title, description, nextLabel] = guide[lang]
  return (
    <aside className={styles.guide} aria-label={title}>
      <div>
        <p className={styles.eyebrow}>
          {lang === 'pt' ? 'Feito para experimentar' : 'Made to explore'}
        </p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.links}>
        <Link to={guide.next}>
          {nextLabel}
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <Link to="/">{lang === 'pt' ? 'Todos os estudos' : 'All studies'}</Link>
        <a
          href={profile.github + '/portfolio'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {lang === 'pt' ? 'Código no GitHub' : 'Code on GitHub'}
        </a>
      </div>
    </aside>
  )
}
export default StudyGuide
