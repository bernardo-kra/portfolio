import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  cooldownRemaining?: number;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Digite sua mensagem...",
  maxLength = 500,
  cooldownRemaining = 0
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && cooldownRemaining === 0) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      setIsTyping(value.trim().length > 0);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const charactersLeft = maxLength - message.length;
  const isNearLimit = charactersLeft < 50;

  return (
    <form onSubmit={handleSubmit} className={styles.messageInputContainer}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={cooldownRemaining > 0 ? `Aguarde ${cooldownRemaining}s...` : placeholder}
          disabled={disabled || cooldownRemaining > 0}
          className={styles.messageTextarea}
          rows={1}
        />
        
        <button
          type="submit"
          disabled={!message.trim() || disabled || cooldownRemaining > 0}
          className={styles.sendButton}
          title={cooldownRemaining > 0 ? `Aguarde ${cooldownRemaining} segundos` : 'Enviar mensagem (Enter)'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
              fill="currentColor"
            />
          </svg>
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
  );
};

export default MessageInput;
