import { Link } from 'react-router-dom'
import { useI18n } from '@src/i18n'
import styles from './styles.module.css'

const NotFound = () => {
  const { lang } = useI18n()
  return (
    <main className={styles.page}>
      <p className={styles.code}>404 / LAB</p>
      <h1>
        {lang === 'pt'
          ? 'Este caminho ainda não existe.'
          : 'This path does not exist.'}
      </h1>
      <p>
        {lang === 'pt'
          ? 'Você pode continuar pelos estudos ou conhecer minha trajetória profissional.'
          : 'Continue exploring the studies or get to know my professional background.'}
      </p>
      <nav
        aria-label={lang === 'pt' ? 'Continuar navegando' : 'Continue browsing'}
      >
        <Link to="/">
          {lang === 'pt' ? 'Explorar estudos' : 'Explore studies'} →
        </Link>
        <Link to="/portfolio">
          {lang === 'pt' ? 'Conhecer o portfólio' : 'View portfolio'} →
        </Link>
      </nav>
    </main>
  )
}

export default NotFound
