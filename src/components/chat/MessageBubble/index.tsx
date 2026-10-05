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
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showSenderName = false,
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
      className={`${styles.messageContainer} ${isOwnMessage ? styles.ownMessage : styles.otherMessage}`}
    >
      {showSenderName && !isOwnMessage && (
        <div className={styles.senderName}>{message.senderName}</div>
      )}

      <div
        className={`${styles.messageBubble} ${isOwnMessage ? styles.ownBubble : styles.otherBubble}`}
      >
        <div className={styles.messageText}>{message.message}</div>
        <div className={styles.messageTime}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
