import React, { useState, useEffect } from 'react';
import { chatService } from '../../../services/chatService';
import type { ChatConversation } from '../../../services/chatService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './styles.module.css';

interface ConversationListProps {
  onSelectConversation: (userId: string) => void;
  selectedUserId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedUserId
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
    
    const interval = setInterval(loadConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await chatService.getAllConversations();
      setConversations(data);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return format(date, 'HH:mm', { locale: ptBR });
      } else if (diffInHours < 168) {
        return format(date, 'EEE', { locale: ptBR });
      } else {
        return format(date, 'dd/MM', { locale: ptBR });
      }
    } catch {
      return '';
    }
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className={styles.conversationList}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.conversationList}>
      <div className={styles.header}>
        <h3>Conversas</h3>
        <button 
          onClick={loadConversations}
          className={styles.refreshButton}
          title="Atualizar conversas"
        >
          🔄
        </button>
      </div>
      
      <div className={styles.conversationsContainer}>
        {conversations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <h4>Nenhuma conversa</h4>
            <p>Ainda não há conversas iniciadas</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.userId}
              className={`${styles.conversationItem} ${
                selectedUserId === conversation.userId ? styles.selected : ''
              }`}
              onClick={() => onSelectConversation(conversation.userId)}
            >
              <div className={styles.conversationAvatar}>
                <span>{conversation.userName.charAt(0).toUpperCase()}</span>
                {conversation.isOnline && <div className={styles.onlineIndicator}></div>}
              </div>
              
              <div className={styles.conversationContent}>
                <div className={styles.conversationHeader}>
                  <h4 className={styles.conversationName}>
                    {conversation.userName}
                  </h4>
                  <span className={styles.conversationTime}>
                    {formatLastMessageTime(conversation.lastMessageTime)}
                  </span>
                </div>
                
                <div className={styles.conversationFooter}>
                  <p className={styles.lastMessage}>
                    {truncateMessage(conversation.lastMessage)}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <div className={styles.unreadBadge}>
                      {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
