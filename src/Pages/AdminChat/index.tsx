import themeStyles from '@components/chat/chatTheme.module.css'
import { useAuth } from '@hooks/useAuth'
import { useAppConfig } from '@context'
import { ModernChat } from '@components/chat'
import { Link } from 'react-router-dom'
import { useI18n } from '@src/i18n'
import { Inbox, ArrowLeft } from 'lucide-react'
import styles from './styles.module.css'
export default function AdminChat() {
  const { user, isAuthenticated } = useAuth()
  const { isFeatureEnabled, isBackendEnabled } = useAppConfig()
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const allowed = isAuthenticated && user?.isChatOwner === true
  const available = isBackendEnabled && isFeatureEnabled('chat')
  return (
    <main className={styles.container + ' ' + themeStyles.chatTheme}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
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
          <Link to="/portfolio" className={styles.backButton}>
            <ArrowLeft size={18} />
            {pt ? 'Voltar ao portfólio' : 'Back to portfolio'}
          </Link>
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
          <p>{user.email}</p>
          <div className={styles.chatContainer}>
            <ModernChat />
          </div>
        </div>
      )}
    </main>
  )
}
