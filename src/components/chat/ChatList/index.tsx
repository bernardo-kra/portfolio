import React, { useState, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useAppConfig } from '@context';
import styles from './styles.module.css';

interface Conversation {
  userEmail: string;
  userName: string;
  lastMessage: string;
  timestamp: any;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatListProps {
  onSelectConversation: (userEmail: string) => void;
  selectedConversation: string | null;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectConversation, selectedConversation }) => {
  const { user } = useAuth();
  const { config } = useAppConfig();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.backend.baseUrl}/api/chat/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-user-email': user?.email,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        const messagesByUser: { [key: string]: any[] } = {};
        
        data.data.messages.forEach((msg: any) => {
          if (!msg.isAdmin) {
            if (!messagesByUser[msg.senderEmail]) {
              messagesByUser[msg.senderEmail] = [];
            }
            messagesByUser[msg.senderEmail].push(msg);
          }
        });

        const conversationList = Object.entries(messagesByUser).map(([email, messages]) => {
          const sortedMessages = messages.sort((a, b) => 
            new Date(b.timestamp.toDate ? b.timestamp.toDate() : b.timestamp).getTime() - 
            new Date(a.timestamp.toDate ? a.timestamp.toDate() : a.timestamp).getTime()
          );
          
          const lastMessage = sortedMessages[0];
          const unreadCount = messages.filter((msg: any) => !msg.read).length;
          
          return {
            userEmail: email,
            userName: lastMessage.senderName,
            lastMessage: lastMessage.message,
            timestamp: lastMessage.timestamp,
            unreadCount,
            isOnline: Math.random() > 0.5,
          };
        });

        setConversations(conversationList.sort((a, b) => 
          new Date(b.timestamp.toDate ? b.timestamp.toDate() : b.timestamp).getTime() - 
          new Date(a.timestamp.toDate ? a.timestamp.toDate() : a.timestamp).getTime()
        ));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: any) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  if (loading) {
    return (
      <div className={styles.chatList}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatList}>
      <div className={styles.chatListHeader}>
        <h3>Conversas</h3>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Buscar conversas..."
            className={styles.searchInput}
          />
        </div>
      </div>
      
      <div className={styles.conversationsList}>
        {conversations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhuma conversa encontrada</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.userEmail}
              className={`${styles.conversationItem} ${
                selectedConversation === conversation.userEmail ? styles.selected : ''
              }`}
              onClick={() => onSelectConversation(conversation.userEmail)}
            >
              <div className={styles.avatar}>
                <div className={styles.avatarCircle}>
                  {conversation.userName.charAt(0).toUpperCase()}
                </div>
                {conversation.isOnline && <div className={styles.onlineIndicator}></div>}
              </div>
              
              <div className={styles.conversationInfo}>
                <div className={styles.conversationHeader}>
                  <h4 className={styles.userName}>{conversation.userName}</h4>
                  <span className={styles.timestamp}>
                    {formatTime(conversation.timestamp)}
                  </span>
                </div>
                
                <div className={styles.conversationPreview}>
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

export default ChatList;

