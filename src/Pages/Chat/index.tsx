import { useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  LockKeyhole,
  LogIn,
  LogOut,
  MessageCircle,
} from 'lucide-react'
import { useAuth } from '@hooks/useAuth'
import { useAppConfig } from '@context'
import { useI18n } from '@src/i18n'
import { WhatsAppChat } from '@components/chat'
import { SimpleAuthModal } from '@components/auth/SimpleAuthModal'
import ThemeToggleButton from '@components/theme/ThemeToggleButton'
import { NotificationCenter } from '@components/notifications'
import themeStyles from '@components/chat/chatTheme.module.css'
import workspaceStyles from '@components/chat/workspaceTheme.module.css'
import shellStyles from '../AdminChat/styles.module.css'
import styles from './styles.module.css'
type RenderChatSignInWelcomeProps = {
  pt: boolean
  trigger: import('react').RefObject<HTMLButtonElement | null>
  setSignInOpen: import('react').Dispatch<
    import('react').SetStateAction<boolean>
  >
}

function renderChatSignInWelcome({
  pt,
  trigger,
  setSignInOpen,
}: RenderChatSignInWelcomeProps) {
  return (
    <div className={styles.welcome}>
      <div className={styles.welcomeIcon}>
        <MessageCircle size={38} strokeWidth={1.4} />
      </div>
      <span className={styles.kicker}>
        {pt ? 'VAMOS CONVERSAR?' : 'LET’S TALK?'}
      </span>
      <h2>
        {pt
          ? 'Uma boa ideia começa com um olá.'
          : 'A good idea starts with hello.'}
      </h2>
      <p>
        {pt
          ? 'Entre para enviar sua mensagem e acompanhar a resposta de Bernardo neste espaço.'
          : 'Sign in to send your message and follow Bernardo’s reply here.'}
      </p>
      <button
        ref={trigger}
        className={styles.signIn}
        onClick={() => setSignInOpen(true)}
      >
        <LogIn size={17} />
        {pt ? 'Entrar para conversar' : 'Sign in to chat'}
      </button>
      <span className={styles.signInNote}>
        {pt
          ? 'Google ou sua conta existente'
          : 'Google or your existing account'}
      </span>
    </div>
  )
}

type RenderChatPageHeaderProps = {
  pt: boolean
  setLang: (lang: import('../../i18n/index').Lang) => void
}

function renderChatPageHeader({ pt, setLang }: RenderChatPageHeaderProps) {
  return (
    <header className={shellStyles.header}>
      <div className={shellStyles.headerContent}>
        <div className={shellStyles.headerText}>
          <span className={shellStyles.eyebrow}>BERNARDO / MESSAGES</span>
          <h1>
            <MessageCircle size={26} aria-hidden="true" />
            {pt ? 'Sua conversa' : 'Your conversation'}
          </h1>
          <p>
            {pt
              ? 'Um espaço para trocar ideias, falar de projetos e criar conexões.'
              : 'A space to share ideas, discuss projects and make connections.'}
          </p>
        </div>
        <div className={shellStyles.headerActions}>
          <NotificationCenter />
          <button
            className={shellStyles.languageButton}
            onClick={() => setLang(pt ? 'en' : 'pt')}
            aria-label={pt ? 'Mudar para inglês' : 'Switch to Portuguese'}
          >
            {pt ? 'EN' : 'PT'}
          </button>
          <ThemeToggleButton />
          <Link
            to="/"
            className={shellStyles.backButton}
            aria-label={pt ? 'Voltar aos estudos' : 'Back to studies'}
          >
            <ArrowLeft size={18} />
            {pt ? 'Voltar aos estudos' : 'Back to studies'}
          </Link>
        </div>
      </div>
    </header>
  )
}

type RenderChatContactProps = {
  pt: boolean
  isAuthenticated: boolean
  logout: () => void
}

function renderChatContact({
  pt,
  isAuthenticated,
  logout,
}: RenderChatContactProps) {
  return (
    <aside
      className={styles.contact}
      aria-label={pt ? 'Sobre esta conversa' : 'About this conversation'}
    >
      <span className={styles.kicker}>
        {pt ? 'CONVERSA DIRETA' : 'DIRECT CONVERSATION'}
      </span>
      <img
        className={styles.portrait}
        src="/bernardo-kra.jpg"
        alt="Bernardo Kraczkowski"
      />
      <h2>
        Bernardo
        <br />
        Kraczkowski<span>.</span>
      </h2>
      <p className={styles.role}>Frontend · React · TypeScript</p>
      <div className={styles.contactNote}>
        <MessageCircle size={20} />
        <p>
          {pt
            ? 'Tem uma oportunidade, um projeto ou uma ideia? Me conta por aqui.'
            : 'Have an opportunity, a project or an idea? Tell me about it here.'}
        </p>
      </div>
      <Link to="/portfolio" className={styles.profileLink}>
        {pt ? 'Conhecer meu trabalho' : 'Explore my work'}
        <ArrowUpRight size={16} />
      </Link>
      <div className={styles.accountFooter}>
        <LockKeyhole size={16} />
        <p>
          {pt
            ? 'Seu histórico fica nesta conversa. Outros visitantes não têm acesso.'
            : 'Your history stays in this conversation. Other visitors cannot access it.'}
        </p>
        <Link to="/privacy">
          {pt ? 'Privacidade e seus dados' : 'Privacy and your data'}
        </Link>
        {isAuthenticated && (
          <button onClick={logout}>
            <LogOut size={15} />
            {pt ? 'Sair da conta' : 'Sign out'}
          </button>
        )}
      </div>
    </aside>
  )
}

type RenderChatThreadProps = {
  pt: boolean
  available: boolean
  loading: boolean
  isAuthenticated: boolean
  user: import('../../hooks/useAuth').AuthUser | null
  trigger: import('react').RefObject<HTMLButtonElement | null>
  setSignInOpen: import('react').Dispatch<
    import('react').SetStateAction<boolean>
  >
}

function renderChatThread({
  pt,
  available,
  loading,
  isAuthenticated,
  user,
  trigger,
  setSignInOpen,
}: RenderChatThreadProps) {
  return (
    <section
      className={styles.thread}
      aria-label={pt ? 'Conversa com Bernardo' : 'Conversation with Bernardo'}
    >
      {!available ? (
        <div className={styles.welcome}>
          <MessageCircle size={36} />
          <h2>{pt ? 'Chat indisponível' : 'Chat unavailable'}</h2>
          <p>
            {pt
              ? 'Tente novamente mais tarde ou veja as opções de contato no portfólio.'
              : 'Please try again later or see the contact options in the portfolio.'}
          </p>
          <Link to="/portfolio#contato">
            {pt ? 'Ver contatos' : 'View contact options'}
          </Link>
        </div>
      ) : loading ? (
        <div className={styles.welcome}>
          <p>
            {pt ? 'Preparando sua conversa…' : 'Preparing your conversation…'}
          </p>
        </div>
      ) : isAuthenticated ? (
        <WhatsAppChat key={user?.email} workspace />
      ) : (
        renderChatSignInWelcome({ pt, trigger, setSignInOpen })
      )}
    </section>
  )
}

export default function Chat() {
  const { user, loading, isAuthenticated, login, logout } = useAuth()
  const { isFeatureEnabled, isBackendEnabled } = useAppConfig()
  const { lang, setLang } = useI18n()
  const pt = lang === 'pt'
  const [signInOpen, setSignInOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const available =
    isBackendEnabled &&
    isFeatureEnabled('chat') &&
    isFeatureEnabled('authentication')

  if (isAuthenticated && user?.isChatOwner)
    return <Navigate to="/admin/chat" replace />

  return (
    <main
      className={`${shellStyles.container} ${themeStyles.chatTheme} ${workspaceStyles.workspaceTheme}`}
    >
      {renderChatPageHeader({ pt, setLang })}
      <div className={shellStyles.adminPanel}>
        <div className={shellStyles.accountBar}>
          <span>
            <LockKeyhole size={14} />
            {pt ? 'Só você e Bernardo' : 'Just you and Bernardo'}
          </span>
          {isAuthenticated && <span>{user?.email}</span>}
        </div>
        <div className={`${shellStyles.chatContainer} ${styles.layout}`}>
          {renderChatContact({ pt, isAuthenticated, logout })}
          {renderChatThread({
            pt,
            available,
            loading,
            isAuthenticated,
            user,
            trigger,
            setSignInOpen,
          })}
        </div>
        {isAuthenticated && (
          <button className={styles.mobileLogout} onClick={logout}>
            <LogOut size={14} />
            {pt ? 'Sair da conta' : 'Sign out'}
          </button>
        )}
      </div>
      {signInOpen && (
        <SimpleAuthModal
          isOpen
          onSuccess={login}
          onClose={() => {
            setSignInOpen(false)
            trigger.current?.focus()
          }}
        />
      )}
    </main>
  )
}
