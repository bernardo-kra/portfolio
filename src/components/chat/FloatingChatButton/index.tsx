import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useAppConfig } from '@context'
import { useI18n } from '@src/i18n'
import { useScrollLock } from '@hooks/useScrollLock'
import { useNotifications } from '@hooks/useNotifications'
import { SimpleAuthModal } from '@components/auth/SimpleAuthModal'
import { MessageCircle, X, ArrowUpRight } from 'lucide-react'
import ModernChat from '../ModernChat'
import themeStyles from '../chatTheme.module.css'
import workspaceStyles from '../workspaceTheme.module.css'
import styles from './styles.module.css'
function chatActionLabel(isChatOwner: boolean | undefined, pt: boolean) {
  return isChatOwner
    ? pt
      ? 'Caixa de entrada'
      : 'Inbox'
    : pt
      ? 'Conversar com Bernardo'
      : 'Talk to Bernardo'
}

type RenderFloatingChatTriggerProps = {
  trigger: import('react').RefObject<HTMLButtonElement | null>
  label:
    | 'Caixa de entrada'
    | 'Inbox'
    | 'Conversar com Bernardo'
    | 'Talk to Bernardo'
  user: import('../../../hooks/useAuth').AuthUser | null
  navigate: import('react-router-dom').NavigateFunction
  isAuthenticated: boolean
  setShowChat: import('react').Dispatch<import('react').SetStateAction<boolean>>
  setShowLogin: import('react').Dispatch<
    import('react').SetStateAction<boolean>
  >
  unreadCount: number
  pt: boolean
}

function renderFloatingChatTrigger({
  trigger,
  label,
  user,
  navigate,
  isAuthenticated,
  setShowChat,
  setShowLogin,
  unreadCount,
  pt,
}: RenderFloatingChatTriggerProps) {
  return (
    <button
      ref={trigger}
      className={styles.floatingButton}
      aria-label={label}
      title={label}
      onClick={() => {
        if (user?.isChatOwner) void navigate('/admin/chat')
        else if (isAuthenticated) setShowChat(true)
        else setShowLogin(true)
      }}
    >
      <span className={styles.chatIcon}>
        <MessageCircle size={22} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className={styles.unreadBadge}
            aria-label={
              pt
                ? `${unreadCount} mensagens não lidas`
                : `${unreadCount} unread messages`
            }
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </span>
      <span className={styles.chatText}>{label}</span>
    </button>
  )
}

type RenderChatModalHeaderProps = {
  titleId: string
  pt: boolean
  closeChat: () => void
}

function renderChatModalHeader({
  titleId,
  pt,
  closeChat,
}: RenderChatModalHeaderProps) {
  return (
    <header className={styles.modalHeader}>
      <div>
        <MessageCircle size={18} aria-hidden="true" />
        <h2 id={titleId}>{pt ? 'Sua conversa' : 'Your conversation'}</h2>
      </div>
      <div>
        <Link
          to="/chat"
          onClick={closeChat}
          className={styles.iconButton}
          aria-label={
            pt
              ? 'Abrir conversa em página completa'
              : 'Open conversation in full page'
          }
          title={pt ? 'Abrir em página completa' : 'Open full page'}
        >
          <ArrowUpRight size={18} />
        </Link>
        <button
          className={styles.iconButton}
          onClick={closeChat}
          aria-label={pt ? 'Fechar chat' : 'Close chat'}
        >
          <X size={19} />
        </button>
      </div>
    </header>
  )
}

export default function FloatingChatButton() {
  const { user, isAuthenticated, login } = useAuth()
  const { unreadCount } = useNotifications()
  const { isFeatureEnabled, config } = useAppConfig()
  const { lang } = useI18n()
  const navigate = useNavigate()
  const pt = lang === 'pt'
  const [showLogin, setShowLogin] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const available = isFeatureEnabled('chat') && config.ui.showChatButton
  const chatOpen =
    showChat && isAuthenticated && available && !user?.isChatOwner
  useScrollLock(chatOpen)

  useEffect(() => {
    const element = dialog.current
    if (chatOpen) element?.showModal()
    else element?.close()
    return () => element?.close()
  }, [chatOpen])

  const closeChat = () => {
    dialog.current?.close()
    setShowChat(false)
    trigger.current?.focus()
  }
  if (!available) return null
  const label = chatActionLabel(user?.isChatOwner, pt)
  return (
    <>
      {renderFloatingChatTrigger({
        trigger,
        label,
        user,
        navigate,
        isAuthenticated,
        setShowChat,
        setShowLogin,
        unreadCount,
        pt,
      })}
      <dialog
        ref={dialog}
        className={`${styles.chatDialog} ${themeStyles.chatTheme} ${workspaceStyles.workspaceTheme}`}
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault()
          closeChat()
        }}
        onClick={(event) => {
          if (event.target === dialog.current) closeChat()
        }}
      >
        {chatOpen && (
          <>
            {renderChatModalHeader({ titleId, pt, closeChat })}
            <ModernChat workspace />
          </>
        )}
      </dialog>
      {showLogin && (
        <SimpleAuthModal
          isOpen
          onClose={() => setShowLogin(false)}
          onSuccess={(nextUser) => {
            login(nextUser)
            if (nextUser.isChatOwner) void navigate('/admin/chat')
            else setShowChat(true)
          }}
        />
      )}
    </>
  )
}
