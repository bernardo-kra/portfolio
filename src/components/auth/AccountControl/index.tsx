import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  Inbox,
  LogIn,
  LogOut,
  UserRound,
  MessageCircle,
} from 'lucide-react'
import { useAuth } from '@hooks/useAuth'
import { useAppConfig } from '@context'
import { useI18n } from '@src/i18n'
import { SimpleAuthModal } from '../SimpleAuthModal'
import styles from './styles.module.css'

export default function AccountControl() {
  const { user, isAuthenticated, login, logout } = useAuth()
  const { isFeatureEnabled, config } = useAppConfig()
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const [signInOpen, setSignInOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!accountOpen) return
    const dismiss = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node))
        setAccountOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [accountOpen])

  if (!isFeatureEnabled('authentication') || !config.ui.showAuthButton)
    return null

  return (
    <div
      className={styles.account}
      ref={container}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setAccountOpen(false)
      }}
    >
      {isAuthenticated ? (
        <>
          <button
            ref={trigger}
            className={styles.trigger}
            aria-expanded={accountOpen}
            aria-controls={panelId}
            aria-label={pt ? 'Abrir opções da conta' : 'Open account options'}
            onClick={() => setAccountOpen(!accountOpen)}
          >
            <UserRound size={16} aria-hidden="true" />
            <span className={styles.name}>
              {user?.firstName || (pt ? 'Minha conta' : 'My account')}
            </span>
            <ChevronDown size={13} aria-hidden="true" />
          </button>
          {accountOpen && (
            <div className={styles.panel} id={panelId}>
              <div className={styles.identity}>
                <strong>
                  {user?.firstName} {user?.lastName}
                </strong>
                <span>{user?.email}</span>
              </div>
              {user?.isChatOwner && (
                <Link to="/admin/chat" onClick={() => setAccountOpen(false)}>
                  <Inbox size={16} />
                  {pt ? 'Caixa de entrada' : 'Inbox'}
                </Link>
              )}
              {!user?.isChatOwner && isFeatureEnabled('chat') && (
                <Link to="/chat" onClick={() => setAccountOpen(false)}>
                  <MessageCircle size={16} />
                  {pt ? 'Minha conversa' : 'My conversation'}
                </Link>
              )}
              <button
                onClick={() => {
                  setAccountOpen(false)
                  logout()
                }}
              >
                <LogOut size={16} />
                {pt ? 'Sair' : 'Sign out'}
              </button>
            </div>
          )}
        </>
      ) : (
        <button
          ref={trigger}
          className={styles.trigger}
          onClick={() => setSignInOpen(true)}
        >
          <LogIn size={16} aria-hidden="true" />
          {pt ? 'Entrar' : 'Sign in'}
        </button>
      )}
      {signInOpen && (
        <SimpleAuthModal
          isOpen
          onClose={() => {
            setSignInOpen(false)
            trigger.current?.focus()
          }}
          onSuccess={login}
        />
      )}
    </div>
  )
}
