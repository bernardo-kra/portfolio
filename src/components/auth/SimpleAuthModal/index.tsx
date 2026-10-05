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

export const SimpleAuthModal = ({
  isOpen,
  onClose,
  onSuccess,
}: SimpleAuthModalProps) => {
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const [isLogin, setIsLogin] = useState(true)
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
        `${appConfig.backend.baseUrl}/api/auth/${isLogin ? 'login' : 'register'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        }
      )
      const data = await response.json()
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
              {isLogin
                ? pt
                  ? 'Bem-vindo de volta'
                  : 'Welcome back'
                : pt
                  ? 'Crie sua conta'
                  : 'Create your account'}
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
            {pt ? 'ou use seu email' : 'or use your email'}
          </p>
          {isLogin && (
            <form
              key={isLogin ? 'login' : 'register'}
              className={styles.form}
              onSubmit={submit}
            >
              {!isLogin && (
                <div className={styles.row}>
                  <label>
                    {pt ? 'Nome' : 'First name'}
                    <input
                      className={styles.input}
                      name="firstName"
                      autoComplete="given-name"
                      maxLength={100}
                      required
                    />
                  </label>
                  <label>
                    {pt ? 'Sobrenome' : 'Last name'}
                    <input
                      className={styles.input}
                      name="lastName"
                      autoComplete="family-name"
                      maxLength={100}
                      required
                    />
                  </label>
                </div>
              )}
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
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  minLength={isLogin ? undefined : 8}
                  maxLength={72}
                  required
                />
              </label>
              {!isLogin && (
                <>
                  <label>
                    {pt ? 'Confirmar senha' : 'Confirm password'}
                    <input
                      className={styles.input}
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={72}
                      required
                      onInput={(event) => {
                        const field = event.currentTarget
                        const password = (
                          field.form?.elements.namedItem(
                            'password'
                          ) as HTMLInputElement
                        )?.value
                        field.setCustomValidity(
                          field.value !== password
                            ? pt
                              ? 'As senhas devem ser iguais.'
                              : 'Passwords must match.'
                            : ''
                        )
                      }}
                    />
                  </label>
                  <p className={styles.privacyNote}>
                    {pt
                      ? 'Mínimo de 8 caracteres. Não solicitamos telefone para criar sua conta.'
                      : 'At least 8 characters. A phone number is not required to create your account.'}
                  </p>
                </>
              )}
              {error && (
                <p role="alert" className={styles.error}>
                  {isLogin
                    ? pt
                      ? 'Não foi possível entrar. Confira suas credenciais e a conexão.'
                      : 'Could not sign in. Check your credentials and connection.'
                    : pt
                      ? 'Não foi possível criar a conta. Confira os campos; se já tiver uma conta, entre com sua senha.'
                      : 'Could not create an account. Check the fields; if you already have an account, sign in with your password.'}
                </p>
              )}
              <button className={styles.submitButton} disabled={loading}>
                {loading
                  ? pt
                    ? 'Aguarde…'
                    : 'Please wait…'
                  : isLogin
                    ? pt
                      ? 'Entrar'
                      : 'Sign in'
                    : pt
                      ? 'Criar conta'
                      : 'Create account'}
              </button>
            </form>
          )}
          {!isLogin && (
            <p className={styles.privacyNote}>
              {pt
                ? 'Crie sua conta usando o Google acima. O cadastro por senha está temporariamente indisponível.'
                : 'Create your account with Google above. Password registration is temporarily unavailable.'}
            </p>
          )}
          <button
            className={styles.switchButton}
            disabled={loading}
            onClick={() => {
              setIsLogin(!isLogin)
              setError(false)
            }}
          >
            {isLogin
              ? pt
                ? 'Ainda não tem conta? Cadastre-se'
                : 'Need an account? Sign up'
              : pt
                ? 'Já tem conta? Entre'
                : 'Already have an account? Sign in'}
          </button>
        </div>
      )}
    </dialog>
  )
}
