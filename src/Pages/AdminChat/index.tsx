import themeStyles from '@components/chat/chatTheme.module.css'
import workspaceStyles from '@components/chat/workspaceTheme.module.css'
import { useAuth } from '@hooks/useAuth'
import { useAppConfig } from '@context'
import { ModernChat } from '@components/chat'
import { Link } from 'react-router-dom'
import { useI18n } from '@src/i18n'
import { Inbox, ArrowLeft, ShieldCheck } from 'lucide-react'
import ThemeToggleButton from '@components/theme/ThemeToggleButton'
import { NotificationCenter } from '@components/notifications'
import styles from './styles.module.css'
export default function AdminChat() {
  const { user, isAuthenticated } = useAuth()
  const { isFeatureEnabled, isBackendEnabled } = useAppConfig()
  const { lang, setLang } = useI18n()
  const pt = lang === 'pt'
  const allowed = isAuthenticated && user?.isChatOwner === true
  const available = isBackendEnabled && isFeatureEnabled('chat')
  return (
    <main
      className={`${styles.container} ${themeStyles.chatTheme} ${workspaceStyles.workspaceTheme}`}
    >
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <span className={styles.eyebrow}>BERNARDO / MESSAGES</span>
            <h1>
              <Inbox size={26} aria-hidden="true" />{' '}
              {pt ? 'Caixa de entrada' : 'Inbox'}
            </h1>
            <p>
              {pt
                ? 'Conversas privadas. Selecione uma pessoa para responder.'
                : 'Private conversations. Select a person to reply.'}
            </p>
          </div>
          <div className={styles.headerActions}>
            <NotificationCenter />
            <button
              className={styles.languageButton}
              onClick={() => setLang(pt ? 'en' : 'pt')}
              aria-label={pt ? 'Mudar para inglês' : 'Switch to Portuguese'}
            >
              {pt ? 'EN' : 'PT'}
            </button>
            <ThemeToggleButton />
            <Link to="/portfolio" className={styles.backButton}>
              <ArrowLeft size={18} />
              {pt ? 'Voltar ao portfólio' : 'Back to portfolio'}
            </Link>
          </div>
        </div>
      </header>
      {!allowed ? (
        <div className={styles.accessDenied}>
          <h2>{pt ? 'Acesso restrito' : 'Restricted access'}</h2>
          <p>
            {pt
              ? 'Entre com a conta Google do proprietário para acessar as conversas.'
              : 'Sign in with the owner’s Google account to access conversations.'}
          </p>
        </div>
      ) : !available ? (
        <div className={styles.serviceUnavailable}>
          <h2>{pt ? 'Chat indisponível' : 'Chat unavailable'}</h2>
          <p>
            {pt ? 'Tente novamente mais tarde.' : 'Please try again later.'}
          </p>
        </div>
      ) : (
        <div className={styles.adminPanel}>
          <div className={styles.accountBar}>
            <span>
              <ShieldCheck size={15} />
              {pt ? 'Espaço do proprietário' : 'Owner workspace'}
            </span>
            <span>{user.email}</span>
          </div>
          <div className={styles.chatContainer}>
            <ModernChat workspace />
          </div>
        </div>
      )}
    </main>
  )
}
