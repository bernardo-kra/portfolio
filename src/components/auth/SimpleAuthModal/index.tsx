import { readAuthResponse } from '@src/services/authResponse'
import { setAuthSession } from '@src/services/authSession'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { appConfig } from '@src/config/app.config'
import { useI18n } from '@src/i18n'
import { useScrollLock } from '@hooks/useScrollLock'
import type { AuthUser } from '@hooks/useAuth'
import GoogleLogin from './GoogleLogin'
import styles from './styles.module.css'

interface SimpleAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: AuthUser) => void
}
type RenderPasswordFormProps = {
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  pt: boolean
  error: boolean
  loading: boolean
}

function renderPasswordForm({
  submit,
  pt,
  error,
  loading,
}: RenderPasswordFormProps) {
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        void submit(event)
      }}
    >
      <label>
        Email
        <input
          className={styles.input}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
        />
      </label>
      <label>
        {pt ? 'Senha' : 'Password'}
        <input
          className={styles.input}
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={72}
          required
        />
      </label>

      {error && (
        <p role="alert" className={styles.error}>
          {pt
            ? 'Não foi possível entrar. Confira suas credenciais e a conexão.'
            : 'Could not sign in. Check your credentials and connection.'}
        </p>
      )}
      <button className={styles.submitButton} disabled={loading}>
        {loading
          ? pt
            ? 'Aguarde…'
            : 'Please wait…'
          : pt
            ? 'Entrar'
            : 'Sign in'}
      </button>
    </form>
  )
}

export const SimpleAuthModal = ({
  isOpen,
  onClose,
  onSuccess,
}: SimpleAuthModalProps) => {
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const request = useRef<AbortController | null>(null)
  useScrollLock(isOpen)
  useEffect(() => {
    if (isOpen) dialog.current?.showModal()
    else {
      dialog.current?.close()
      request.current?.abort()
    }
    return () => {
      request.current?.abort()
    }
  }, [isOpen])
  const success = (user: AuthUser) => {
    onSuccess(user)
    onClose()
  }
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(false)
    setLoading(true)
    const form = new FormData(event.currentTarget)
    const body = Object.fromEntries(form.entries())
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    try {
      const response = await fetch(
        `${appConfig.backend.baseUrl}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(15000),
          ]),
        }
      )
      const data = await readAuthResponse(response)
      if (!response.ok || !data.success) throw new Error('AUTH_FAILED')
      if (controller.signal.aborted) return
      setAuthSession(data.data.token, data.data.user)
      success(data.data.user)
    } catch {
      if (!controller.signal.aborted) setError(true)
    } finally {
      if (request.current === controller) setLoading(false)
    }
  }
  return (
    <dialog
      ref={dialog}
      className={styles.overlay}
      aria-labelledby="auth-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose()
      }}
    >
      {isOpen && (
        <div className={styles.modal}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={pt ? 'Fechar login' : 'Close sign-in'}
          >
            ×
          </button>
          <div className={styles.header}>
            <h2 id="auth-title">
              {pt ? 'Converse com Bernardo' : 'Talk to Bernardo'}
            </h2>
          </div>
          <p className={styles.privacyNote}>
            {pt
              ? 'A conta permite conversar pelo chat. Os estudos continuam acessíveis sem login.'
              : 'An account lets you use the chat. The studies remain available without signing in.'}{' '}
            <Link to="/privacy" onClick={onClose}>
              {pt ? 'Como usamos seus dados' : 'How we use your data'}
            </Link>
          </p>
          <GoogleLogin onSuccess={success} />
          <p className={styles.divider}>
            {pt
              ? 'Já tem uma conta por senha? Entre abaixo.'
              : 'Already have a password account? Sign in below.'}
          </p>
          {renderPasswordForm({ submit, pt, error, loading })}

          <p className={styles.privacyNote}>
            {pt
              ? 'No Google, a conta é criada automaticamente no primeiro acesso. Por segurança, recarregar a página encerra esta sessão.'
              : 'Google creates your account automatically on first sign-in. For security, refreshing the page ends this session.'}
          </p>
        </div>
      )}
    </dialog>
  )
}
