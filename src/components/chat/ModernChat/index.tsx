import React, { useState } from 'react';
import { useChatPermissions } from '../../../hooks/useChatPermissions';
import ConversationList from '../ConversationList';
import WhatsAppChat from '../WhatsAppChat';
import styles from './styles.module.css';

const ModernChat: React.FC = () => {
  const { canAccessChat, canViewAllChats, isAdmin } = useChatPermissions();
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [showConversationList, setShowConversationList] = useState(false);

  if (!canAccessChat) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.accessDenied}>
          <div className={styles.accessDeniedIcon}>🔒</div>
          <h3>Acesso Negado</h3>
          <p>Você precisa estar logado para acessar o chat</p>
        </div>
      </div>
    );
  }

  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId);
    setShowConversationList(false);
  };

  const handleBackToList = () => {
    setShowConversationList(true);
    setSelectedUserId(undefined);
  };

  const handleBackToChat = () => {
    setShowConversationList(false);
  };

  return (
    <div className={styles.chatContainer}>
      {isAdmin && canViewAllChats ? (
        <div className={styles.adminLayout}>
          {showConversationList || !selectedUserId ? (
            <ConversationList
              onSelectConversation={handleSelectConversation}
              selectedUserId={selectedUserId}
            />
          ) : (
            <WhatsAppChat
              selectedUserId={selectedUserId}
              onBack={handleBackToList}
            />
          )}
        </div>
      ) : (
        <div className={styles.userLayout}>
          <WhatsAppChat />
        </div>
      )}
    </div>
  );
};

export default ModernChat;
