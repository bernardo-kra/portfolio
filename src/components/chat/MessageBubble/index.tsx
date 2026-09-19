import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './styles.module.css';
import type { ChatMessage, ChatTimestamp } from '../../../services/chatService';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showSenderName?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwnMessage, 
  showSenderName = false 
}) => {
  const formatTime = (timestamp: ChatTimestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp instanceof Date
        ? timestamp
        : typeof timestamp === 'object'
          ? timestamp.toDate?.() ?? new Date((timestamp.seconds ?? 0) * 1000)
          : new Date(timestamp);
      return format(date, 'HH:mm', { locale: ptBR });
    } catch {
      return '';
    }
  };

  return (
    <div className={`${styles.messageContainer} ${isOwnMessage ? styles.ownMessage : styles.otherMessage}`}>
      {showSenderName && !isOwnMessage && (
        <div className={styles.senderName}>{message.senderName}</div>
      )}
      
      <div className={`${styles.messageBubble} ${isOwnMessage ? styles.ownBubble : styles.otherBubble}`}>
        <div className={styles.messageText}>{message.message}</div>
        <div className={styles.messageTime}>{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
