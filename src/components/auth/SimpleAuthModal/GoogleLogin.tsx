import { setAuthSession } from '@src/services/authSession'
import { useEffect, useRef, useState } from 'react'
import { appConfig } from '@src/config/app.config'
import { loadGoogleSignIn } from '@src/services/googleSignIn'
import type { AuthUser } from '@hooks/useAuth'
import { useI18n } from '@src/i18n'
import styles from './styles.module.css'

export default function GoogleLogin({
  onSuccess,
}: {
  onSuccess: (user: AuthUser) => void
}) {
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const [state, setState] = useState<
    'preparing' | 'ready' | 'signing' | 'error'
  >('preparing')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const target = useRef<HTMLDivElement>(null)
  const success = useRef(onSuccess)
  useEffect(() => {
    success.current = onSuccess
  }, [onSuccess])

  useEffect(() => {
    if (!clientId) return
    const controller = new AbortController()
    let expiredTimer: ReturnType<typeof setTimeout> | undefined
    let processing = false
    const live = () => !controller.signal.aborted
    const fail = (code: string) => {
      if (!live()) return
      setError(code)
      setState('error')
    }
    setState('preparing')
    setError('')
    const prepare = async () => {
      // React StrictMode may immediately dispose the first effect in development.
      await Promise.resolve()
      if (!live()) return
      try {
        const response = await fetch(
          `${appConfig.backend.baseUrl}/api/auth/google/challenge`,
          {
            method: 'POST',
            signal: AbortSignal.any([
              controller.signal,
              AbortSignal.timeout(15000),
            ]),
          }
        )
        const challenge = await response.json()
        if (!response.ok || !challenge.data?.nonce)
          throw new Error('GOOGLE_UNAVAILABLE')
        const google = await loadGoogleSignIn()
        if (!live() || !target.current) return
        google.initialize({
          client_id: clientId,
          nonce: challenge.data.nonce,
          auto_select: false,
          callback: async ({ credential }) => {
            if (!live() || processing) return
            processing = true
            clearTimeout(expiredTimer)
            setState('signing')
            try {
              const response = await fetch(
                `${appConfig.backend.baseUrl}/api/auth/google`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ credential }),
                  signal: AbortSignal.any([
                    controller.signal,
                    AbortSignal.timeout(20000),
                  ]),
                }
              )
              const data = await response.json()
              if (!response.ok || !data.success)
                throw new Error(data.error?.code || 'GOOGLE_INVALID')
              if (!live()) return
              setAuthSession(data.data.token, data.data.user)
              success.current(data.data.user)
            } catch (error) {
              fail(
                error instanceof Error ? error.message : 'GOOGLE_UNAVAILABLE'
              )
            }
          },
        })
        target.current.replaceChildren()
        google.renderButton(target.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          locale: pt ? 'pt-BR' : 'en',
          width: Math.min(
            320,
            target.current.parentElement?.clientWidth || 240
          ),
        })
        setState('ready')
        // Expired challenges must be replaced before starting another login.
        expiredTimer = setTimeout(() => fail('GOOGLE_EXPIRED'), 4 * 60 * 1000)
      } catch {
        fail('GOOGLE_UNAVAILABLE')
      }
    }
    void prepare()
    return () => {
      controller.abort()
      clearTimeout(expiredTimer)
      window.google?.accounts.id.cancel()
    }
  }, [clientId, pt, attempt])

  return (
    <section
      className={styles.googleSection}
      aria-label={pt ? 'Login Google' : 'Google sign-in'}
    >
      <div
        className={styles.googleControl}
        aria-busy={!!clientId && (state === 'preparing' || state === 'signing')}
      >
        <div ref={target} hidden={!clientId || state !== 'ready'} />
        {clientId && (state === 'preparing' || state === 'signing') && (
          <p className={styles.googleStatus} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            {state === 'preparing'
              ? pt
                ? 'Preparando login Google…'
                : 'Preparing Google sign-in…'
              : pt
                ? 'Validando sua conta…'
                : 'Verifying your account…'}
          </p>
        )}
        {(!clientId || state === 'error') && (
          <button
            type="button"
            className={styles.googleButton}
            disabled={!clientId}
            onClick={() => setAttempt((value) => value + 1)}
          >
            {clientId
              ? pt
                ? 'Tentar Google novamente'
                : 'Retry Google sign-in'
              : pt
                ? 'Google indisponível'
                : 'Google unavailable'}
          </button>
        )}
      </div>
      <p>
        {pt
          ? 'Usamos o serviço Google neste modal para entrar com seu nome e email verificado. Não acessamos Gmail ou Drive.'
          : 'This dialog uses Google sign-in for your name and verified email. We do not access Gmail or Drive.'}
      </p>
      {error && (
        <p role="alert" className={styles.error}>
          {error === 'GOOGLE_EXISTING_ACCOUNT'
            ? pt
              ? 'Esse email já possui uma conta por senha. Entre pelo formulário abaixo.'
              : 'This email already has a password account. Use the form below.'
            : error === 'GOOGLE_EXPIRED'
              ? pt
                ? 'O login expirou. Prepare o Google novamente para continuar.'
                : 'Sign-in expired. Prepare Google again to continue.'
              : pt
                ? 'Não foi possível conectar ao Google. Tente novamente ou entre com sua senha.'
                : 'Could not connect to Google. Try again or sign in with your password.'}
        </p>
      )}
    </section>
  )
}
