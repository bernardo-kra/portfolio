import React, { useState, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useAppConfig } from '@context';
import { useNotifications } from '@hooks/useNotifications';
import ChatList from '../ChatList';
import IndividualChat from '../IndividualChat';
import styles from './styles.module.css';

const ChatInterface: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { isFeatureEnabled, isBackendEnabled, config } = useAppConfig();
  const { addNotification } = useNotifications();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      setIsAdminView(true);
    }
  }, [user]);

  // Simular notificações de mensagens (em produção, isso viria de WebSocket ou polling)
  useEffect(() => {
    if (!isAuthenticated || !isBackendEnabled || !isFeatureEnabled('chat')) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${config.backend.baseUrl}/api/chat/user/${user?.email}`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          const latestMessage = data.data[data.data.length - 1];
          const messageTime = new Date(latestMessage.timestamp?.toDate ? latestMessage.timestamp.toDate() : latestMessage.timestamp);
          const now = new Date();
          
          // Se a mensagem é de menos de 30 segundos e não é do usuário atual
          if (now.getTime() - messageTime.getTime() < 30000 && latestMessage.senderEmail !== user?.email) {
            addNotification({
              message: `Nova mensagem de ${latestMessage.senderName}: ${latestMessage.message.substring(0, 50)}...`,
              read: false,
              type: 'message',
            });
          }
        }
      } catch (error) {
      }
    }, 10000); // Verificar a cada 10 segundos

    return () => clearInterval(interval);
  }, [isAuthenticated, user, addNotification, isBackendEnabled, isFeatureEnabled]);

  if (!isAuthenticated) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.loginRequired}>
          <p>Faça login para acessar o chat</p>
        </div>
      </div>
    );
  }

  if (!isBackendEnabled || !isFeatureEnabled('chat')) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.loginRequired}>
          <p>Chat temporariamente indisponível.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      {isAdminView ? (
        <div className={styles.adminLayout}>
          <ChatList
            onSelectConversation={setSelectedConversation}
            selectedConversation={selectedConversation}
          />
          <IndividualChat
            targetUserEmail={selectedConversation || undefined}
            isAdminView={true}
          />
        </div>
      ) : (
        <IndividualChat isAdminView={false} />
      )}
    </div>
  );
};

export default ChatInterface;