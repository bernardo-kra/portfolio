import themeStyles from '../chatTheme.module.css'
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useAppConfig } from '@context'
import { useScrollLock } from '@hooks/useScrollLock'
import { ModernChat } from '@components/chat'
import { useI18n } from '@src/i18n'
import { SimpleAuthModal } from '@components/auth/SimpleAuthModal'
import { MessageCircle, X } from 'lucide-react'
import styles from './styles.module.css'

const FloatingChatButton: React.FC = () => {
  const { isAuthenticated, user, login } = useAuth()
  const { isFeatureEnabled, config } = useAppConfig()
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const [showLogin, setShowLogin] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const [showChat, setShowChat] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)

  useScrollLock(showChat)
  useEffect(() => {
    if (!isAuthenticated) setShowChat(false)
  }, [isAuthenticated])

  useEffect(() => {
    const triggerElement = trigger.current
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && showChat) {
        const controls = modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href]'
        )
        if (controls?.length) {
          const first = controls[0],
            last = controls[controls.length - 1]
          if (
            e.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === modalRef.current)
          ) {
            e.preventDefault()
            last.focus()
          } else if (
            !e.shiftKey &&
            (document.activeElement === last ||
              document.activeElement === modalRef.current)
          ) {
            e.preventDefault()
            first.focus()
          }
        }
      }
      if (e.key === 'Escape' && showChat) {
        setShowChat(false)
      }
    }

    if (showChat) {
      document.addEventListener('keydown', handleEscape)
      setTimeout(() => {
        if (modalRef.current) modalRef.current.focus()
      }, 0)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (showChat) triggerElement?.focus()
    }
  }, [showChat])

  if (!isFeatureEnabled('chat') || !config.ui.showChatButton) {
    return null
  }

  return (
    <>
      <SimpleAuthModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={(user) => {
          login(user)
          setShowChat(true)
        }}
      />
      <button
        ref={trigger}
        className={styles.floatingButton}
        onClick={() =>
          isAuthenticated ? setShowChat(!showChat) : setShowLogin(true)
        }
        aria-label={
          user?.isChatOwner
            ? pt
              ? 'Abrir caixa de entrada'
              : 'Open inbox'
            : pt
              ? 'Conversar com Bernardo'
              : 'Talk to Bernardo'
        }
        title={pt ? 'Conversar com Bernardo' : 'Talk to Bernardo'}
      >
        <div className={styles.chatIcon}>
          <MessageCircle size={22} />
        </div>
        <div className={styles.chatText}>
          {user?.isChatOwner
            ? pt
              ? 'Caixa de entrada'
              : 'Inbox'
            : pt
              ? 'Conversar com Bernardo'
              : 'Talk to Bernardo'}
        </div>
      </button>

      {showChat && (
        <div className={styles.chatOverlay} onClick={() => setShowChat(false)}>
          <div
            className={`${styles.chatModal} ${themeStyles.chatTheme}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
            ref={modalRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.chatHeader}>
              <h3 id="chat-title">Chat</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowChat(false)}
                aria-label={pt ? 'Fechar chat' : 'Close chat'}
              >
                <X size={20} />
              </button>
            </div>
            <ModernChat />
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingChatButton
