import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '@src/i18n'
import styles from './styles.module.css'

const RouteLoading = () => {
  const { lang } = useI18n()
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setSlow(true), 8000)
    return () => clearTimeout(timeout)
  }, [])
  return (
    <main className={styles.loading}>
      <div className={styles.content}>
        <span className={styles.brand} aria-hidden="true">
          BK / LAB
        </span>
        <div className={styles.placeholder} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <h1 role="status" aria-atomic="true">
          {lang === 'pt' ? 'Carregando página…' : 'Loading page…'}
        </h1>
        {slow && (
          <p role="status">
            {lang === 'pt'
              ? 'Está demorando um pouco mais. Você pode aguardar ou voltar ao laboratório.'
              : 'This is taking a little longer. You can wait or return to the lab.'}
          </p>
        )}
        <Link to="/">
          {lang === 'pt' ? 'Voltar ao laboratório' : 'Back to the lab'} →
        </Link>
      </div>
    </main>
  )
}
export default RouteLoading
