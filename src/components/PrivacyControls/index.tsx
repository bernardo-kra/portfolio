import { useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '@src/i18n'
import {
  clearAnalyticsCookies,
  readConsent,
  saveConsent,
  subscribeConsent,
} from '@src/privacy/consent'
import styles from './styles.module.css'

export default function PrivacyControls() {
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const consent = useSyncExternalStore(
    subscribeConsent,
    readConsent,
    () => 'unset'
  )
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)
  const choose = (analytics: boolean) => {
    const wasAccepted = consent === 'accepted'
    if (!saveConsent(analytics)) {
      setError(true)
      return
    }
    setError(false)
    setOpen(false)
    if (!analytics) {
      clearAnalyticsCookies()
      // Reload unloads the already-authorized third-party code when consent is revoked.
      if (wasAccepted) window.location.reload()
    }
  }
  return (
    <>
      {consent === 'unset' || open ? (
        <aside
          className={styles.banner}
          aria-label={
            pt ? 'Preferências de privacidade' : 'Privacy preferences'
          }
        >
          <div>
            <h2>
              {pt
                ? 'Sua privacidade, sua escolha.'
                : 'Your privacy, your choice.'}
            </h2>
            <p>
              {pt
                ? 'O site funciona sem cookies de análise. Você pode permitir o Google Analytics para ajudar a entender as visitas. Sua escolha pode ser alterada a qualquer momento.'
                : 'This site works without analytics cookies. You may allow Google Analytics to help understand visits. You can change your choice at any time.'}
            </p>
            <Link to="/privacy">
              {pt ? 'Política de privacidade' : 'Privacy policy'}
            </Link>
            {consent === 'accepted' && (
              <p>
                {pt
                  ? 'Ao revogar, a página será recarregada para interromper a análise.'
                  : 'Revoking consent reloads the page to stop analytics.'}
              </p>
            )}
          </div>
          <div className={styles.actions}>
            <button onClick={() => choose(false)}>
              {pt ? 'Somente necessários' : 'Necessary only'}
            </button>
            <button onClick={() => choose(true)}>
              {pt ? 'Permitir análise' : 'Allow analytics'}
            </button>
            {consent !== 'unset' && (
              <button onClick={() => setOpen(false)}>
                {pt ? 'Fechar' : 'Close'}
              </button>
            )}
          </div>
          {error && (
            <p role="alert">
              {pt
                ? 'Não foi possível salvar a preferência. A análise permanece bloqueada sem autorização salva.'
                : 'Could not save the preference. Analytics remains blocked without saved permission.'}
            </p>
          )}
        </aside>
      ) : (
        <button className={styles.reopen} onClick={() => setOpen(true)}>
          {pt ? 'Privacidade e cookies' : 'Privacy & cookies'}
        </button>
      )}
    </>
  )
}
