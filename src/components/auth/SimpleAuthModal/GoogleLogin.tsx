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
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle'
  )
  const [error, setError] = useState('')
  const target = useRef<HTMLDivElement>(null)
  const active = useRef(true)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
      window.google?.accounts.id.cancel()
    }
  }, [])
  const start = async () => {
    setState('loading')
    setError('')
    try {
      const response = await fetch(
        `${appConfig.backend.baseUrl}/api/auth/google/challenge`,
        { method: 'POST' }
      )
      const challenge = await response.json()
      if (!response.ok || !challenge.data?.nonce)
        throw new Error('GOOGLE_UNAVAILABLE')
      const google = await loadGoogleSignIn()
      if (!active.current || !target.current) return
      google.initialize({
        client_id: clientId,
        nonce: challenge.data.nonce,
        auto_select: false,
        callback: async ({ credential }) => {
          if (!active.current) return
          setState('loading')
          try {
            const response = await fetch(
              `${appConfig.backend.baseUrl}/api/auth/google`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential }),
              }
            )
            const data = await response.json()
            if (!response.ok || !data.success)
              throw new Error(data.error?.code || 'GOOGLE_INVALID')
            if (!active.current) return
            setAuthSession(data.data.token, data.data.user)
            onSuccess(data.data.user)
          } catch (error) {
            if (active.current) {
              setError(
                error instanceof Error ? error.message : 'GOOGLE_UNAVAILABLE'
              )
              setState('error')
            }
          }
        },
      })
      target.current.replaceChildren()
      google.renderButton(target.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        locale: pt ? 'pt-BR' : 'en',
        width: Math.min(320, target.current.clientWidth || 240),
      })
      setState('ready')
    } catch {
      if (active.current) {
        setError('GOOGLE_UNAVAILABLE')
        setState('error')
      }
    }
  }
  return (
    <section
      className={styles.googleSection}
      aria-label={pt ? 'Login Google' : 'Google sign-in'}
    >
      {state !== 'ready' && (
        <button
          type="button"
          className={styles.googleButton}
          disabled={!clientId || state === 'loading'}
          onClick={() => void start()}
        >
          {state === 'loading'
            ? pt
              ? 'Conectando…'
              : 'Connecting…'
            : pt
              ? 'Continuar com Google'
              : 'Continue with Google'}
        </button>
      )}
      <div ref={target} hidden={state !== 'ready'} />
      {!clientId && (
        <p>
          {pt
            ? 'Login Google indisponível no momento. Use email e senha.'
            : 'Google sign-in is currently unavailable. Use email and password.'}
        </p>
      )}
      <p>
        {pt
          ? 'Ao continuar, você abre o serviço de login do Google. Usamos apenas seu nome, email verificado e identificador para a conta.'
          : 'Continuing opens Google sign-in. We use only your name, verified email and identifier for your account.'}
      </p>
      {error && (
        <p role="alert" className={styles.error}>
          {error === 'GOOGLE_EXISTING_ACCOUNT'
            ? pt
              ? 'Esse email já possui uma conta. Entre com sua senha; contas não são vinculadas automaticamente.'
              : 'This email already has an account. Sign in with your password; accounts are not linked automatically.'
            : pt
              ? 'Não foi possível entrar com Google. Tente novamente ou use email e senha.'
              : 'Could not sign in with Google. Try again or use email and password.'}
        </p>
      )}
    </section>
  )
}
