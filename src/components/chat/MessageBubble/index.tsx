import React from 'react'
import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'
import { chatDate } from '../../../services/chatTimestamp'
import { useI18n } from '@src/i18n'
import styles from './styles.module.css'
import type { ChatMessage, ChatTimestamp } from '../../../services/chatService'

interface MessageBubbleProps {
  message: ChatMessage
  isOwnMessage: boolean
  showSenderName?: boolean
  workspace?: boolean
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showSenderName = false,
  workspace = false,
}) => {
  const { lang } = useI18n()
  const formatTime = (timestamp: ChatTimestamp) => {
    if (!timestamp) return ''

    try {
      const date = chatDate(timestamp)
      if (!date.getTime()) return ''
      return format(date, 'HH:mm', { locale: lang === 'pt' ? ptBR : enUS })
    } catch {
      return ''
    }
  }

  return (
    <div
      data-chat-message={message.id}
      className={`${styles.messageContainer} ${isOwnMessage ? styles.ownMessage : styles.otherMessage} ${workspace ? styles.workspace : ''}`}
    >
      {workspace && (
        <div className={styles.avatar} aria-hidden="true">
          {message.senderName
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase() || '?'}
        </div>
      )}
      {workspace && (
        <div className={styles.messageMeta}>
          <strong>
            {isOwnMessage
              ? lang === 'pt'
                ? 'Você'
                : 'You'
              : message.senderName}
          </strong>
          <span>{formatTime(message.timestamp)}</span>
          {message.isAdmin && (
            <span className={styles.authorLabel}>
              {lang === 'pt' ? 'PROPRIETÁRIO' : 'OWNER'}
            </span>
          )}
        </div>
      )}
      {showSenderName && !isOwnMessage && !workspace && (
        <div className={styles.senderName}>{message.senderName}</div>
      )}

      <div
        className={`${styles.messageBubble} ${isOwnMessage ? styles.ownBubble : styles.otherBubble}`}
      >
        <div className={styles.messageText} data-chat-message-text>
          {message.message}
        </div>
        <div className={styles.messageTime}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
