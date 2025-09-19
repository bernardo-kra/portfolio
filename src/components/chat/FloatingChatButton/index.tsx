import React, { useState, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useAppConfig } from '@context';
import { useScrollLock } from '@hooks/useScrollLock';
import { ModernChat } from '@components/chat';
import styles from './styles.module.css';

const FloatingChatButton: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isFeatureEnabled, config } = useAppConfig();
  const [showChat, setShowChat] = useState(false);

  useScrollLock(showChat);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showChat) {
        setShowChat(false);
      }
    };

    if (showChat) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showChat]);

  if (!isAuthenticated || !isFeatureEnabled('chat') || !config.ui.showChatButton) {
    return null;
  }

  return (
    <>
      <button
        className={styles.floatingButton}
        onClick={() => setShowChat(!showChat)}
        title="Fale comigo por chat"
      >
        <div className={styles.chatIcon}>💬</div>
        <div className={styles.chatText}>Fale comigo por chat</div>
      </button>

      {showChat && (
        <div 
          className={styles.chatOverlay}
          onClick={() => setShowChat(false)}
        >
          <div 
            className={styles.chatModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.chatHeader}>
              <h3>Chat</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowChat(false)}
              >
                ✕
              </button>
            </div>
            <ModernChat />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;

