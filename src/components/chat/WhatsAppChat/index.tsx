import React, { useState, useEffect, useRef } from 'react'
import { chatService, type ChatMessage } from '../../../services/chatService'
import { useChatPermissions } from '../../../hooks/useChatPermissions'
import MessageBubble from '../MessageBubble'
import MessageInput from '../MessageInput'
import styles from './styles.module.css'

interface WhatsAppChatProps {
  selectedUserId?: string
  onBack?: () => void
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  selectedUserId,
  onBack,
}) => {
  const { isAdmin, userEmail } = useChatPermissions()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatUserId = selectedUserId || userEmail || ''

  useEffect(() => {
    if (!chatUserId) return

    const unsubscribe = chatService.subscribeToMessages(
      chatUserId,
      (newMessages) => {
        setMessages(newMessages)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [chatUserId, isAdmin, userEmail])

  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownRemaining])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (!chatUserId || sending) return

    setSending(true)

    const result = await chatService.sendMessage(chatUserId, message, isAdmin)

    if (result.success) {
      setCooldownRemaining(3)
    } else {
      console.error('Erro ao enviar mensagem:', result.error)
    }

    setSending(false)
  }

  if (loading) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando conversa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        {onBack && (
          <button onClick={onBack} className={styles.backButton}>
            ←
          </button>
        )}
        <div className={styles.chatInfo}>
          <h3 className={styles.chatTitle}>
            {isAdmin ? 'Chat com Usuário' : 'Suporte'}
          </h3>
          <p className={styles.chatSubtitle}>
            {isAdmin ? selectedUserId : 'Estamos aqui para ajudar'}
          </p>
        </div>
        <div className={styles.chatStatus} />
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <h4>Nenhuma mensagem ainda</h4>
            <p>Inicie uma conversa enviando uma mensagem!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderEmail === userEmail}
              showSenderName={isAdmin && message.senderEmail !== userEmail}
            />
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={sending}
        cooldownRemaining={cooldownRemaining}
        placeholder={
          isAdmin ? 'Responder como admin...' : 'Digite sua mensagem...'
        }
      />
    </div>
  )
}

export default WhatsAppChat
