import { Link } from 'react-router-dom'
import { useI18n } from '@src/i18n'
import FuzzyText from '@components/reactbits/FuzzyText/FuzzyText'
import styles from './styles.module.css'

const NotFound = () => {
  const { lang } = useI18n()
  return (
    <main className={styles.page}>
      <div className={styles.fuzzy} aria-hidden="true">
        <FuzzyText
          fontSize="clamp(7rem, 26vw, 15rem)"
          fontWeight={700}
          fontFamily="inherit"
          color="currentColor"
          baseIntensity={0.1}
          hoverIntensity={0.45}
          fuzzRange={24}
          letterSpacing={-8}
        >
          404
        </FuzzyText>
      </div>
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
        <Link to="/" className={styles.primary}>
          {lang === 'pt' ? 'Explorar estudos' : 'Explore studies'} →
        </Link>
        <Link to="/portfolio" className={styles.secondary}>
          {lang === 'pt' ? 'Conhecer o portfólio' : 'View portfolio'} →
        </Link>
      </nav>
    </main>
  )
}

export default NotFound
