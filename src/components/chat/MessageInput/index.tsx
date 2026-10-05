import React, { useState, useRef, useEffect } from 'react'
import { useI18n } from '@src/i18n'
import { Send } from 'lucide-react'
import styles from './styles.module.css'

// Drafts stay in memory and never enter persistent browser storage.
const drafts = new Map<string, string>()
window.addEventListener('portfolio:auth', () => drafts.clear())

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<boolean>
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  cooldownRemaining?: number
  draftKey: string
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Digite sua mensagem...',
  maxLength = 500,
  cooldownRemaining = 0,
  draftKey,
}) => {
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const [message, setMessage] = useState(() => drafts.get(draftKey) || '')
  useEffect(() => {
    drafts.set(draftKey, message)
  }, [draftKey, message])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled && cooldownRemaining === 0) {
      const sent = await onSendMessage(message.trim())
      if (sent) setMessage('')
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
      setMessage(value)
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
    <form onSubmit={handleSubmit} className={styles.messageInputContainer}>
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
          disabled={disabled || cooldownRemaining > 0}
          className={styles.messageTextarea}
          rows={1}
        />

        <button
          type="submit"
          aria-label={pt ? 'Enviar mensagem' : 'Send message'}
          disabled={!message.trim() || disabled || cooldownRemaining > 0}
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
