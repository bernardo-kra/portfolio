import React, { useState } from 'react';
import { useNotifications } from '@hooks/useNotifications';
import styles from './styles.module.css';

const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) return 'Agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return timestamp.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  return (
    <div className={styles.notificationCenter}>
      <button
        className={styles.notificationButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificações"
      >
        <span className={styles.bellIcon}>🔔</span>
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.notificationDropdown}>
          <div className={styles.notificationHeader}>
            <h3>Notificações</h3>
            {unreadCount > 0 && (
              <button
                className={styles.markAllReadButton}
                onClick={markAllAsRead}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${
                    !notification.read ? styles.unread : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationMessage}>
                      {truncateMessage(notification.message)}
                    </div>
                    <div className={styles.notificationMeta}>
                      <span className={styles.notificationTime}>
                        {formatTime(notification.timestamp)}
                      </span>
                      <span className={styles.notificationType}>
                        {notification.type === 'message' ? '💬' : '🔔'}
                      </span>
                    </div>
                  </div>
                  <button
                    className={styles.clearButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(notification.id);
                    }}
                    aria-label="Remover notificação"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;




