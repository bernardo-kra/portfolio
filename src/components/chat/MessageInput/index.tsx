import React, { useRef, useEffect, useSyncExternalStore } from 'react'
import {
  getChatDraft,
  subscribeChatDraft,
  editChatDraft,
  beginChatSend,
  finishChatSend,
} from '@src/services/chatDrafts'
import { useI18n } from '@src/i18n'
import { Send } from 'lucide-react'
import styles from './styles.module.css'

interface MessageInputProps {
  onSendMessage: (message: string, clientMessageId: string) => Promise<boolean>
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  cooldownRemaining?: number
  draftKey: string
  workspace?: boolean
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Digite sua mensagem...',
  maxLength = 500,
  cooldownRemaining = 0,
  draftKey,
  workspace = false,
}) => {
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const draft = useSyncExternalStore(
    (callback) => subscribeChatDraft(draftKey, callback),
    () => getChatDraft(draftKey)
  )
  const message = draft.text
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled && cooldownRemaining === 0) {
      const attempt = beginChatSend(draftKey)
      if (!attempt) return
      let sent = false
      try {
        sent = await onSendMessage(attempt.text.trim(), attempt.id)
      } finally {
        finishChatSend(draftKey, attempt.id, sent)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= maxLength) {
      editChatDraft(draftKey, value)
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  const charactersLeft = maxLength - message.length
  const isNearLimit = charactersLeft < 50

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.messageInputContainer} ${workspace ? styles.workspace : ''}`}
    >
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          aria-label={pt ? 'Sua mensagem' : 'Your message'}
          maxLength={maxLength}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            cooldownRemaining > 0
              ? `${pt ? 'Aguarde' : 'Wait'} ${cooldownRemaining}s...`
              : placeholder
          }
          disabled={disabled || draft.pending || cooldownRemaining > 0}
          className={styles.messageTextarea}
          rows={1}
        />

        <button
          type="submit"
          aria-label={pt ? 'Enviar mensagem' : 'Send message'}
          disabled={
            !message.trim() ||
            disabled ||
            draft.pending ||
            cooldownRemaining > 0
          }
          className={styles.sendButton}
          title={
            cooldownRemaining > 0
              ? `${pt ? 'Aguarde' : 'Wait'} ${cooldownRemaining}s`
              : pt
                ? 'Enviar mensagem (Enter)'
                : 'Send message (Enter)'
          }
        >
          <Send size={20} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.inputFooter}>
        {workspace && (
          <span className={styles.shortcut}>
            {pt
              ? 'Enter para enviar · Shift + Enter para nova linha'
              : 'Enter to send · Shift + Enter for a new line'}
          </span>
        )}
        <div className={styles.characterCount}>
          <span className={isNearLimit ? styles.nearLimit : ''}>
            {charactersLeft}
          </span>
          <span className={styles.separator}>/</span>
          <span>{maxLength}</span>
        </div>

        {cooldownRemaining > 0 && (
          <div className={styles.cooldownIndicator}>
            ⏱️ {cooldownRemaining}s
          </div>
        )}
      </div>
    </form>
  )
}

export default MessageInput
