import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'message' | 'system';
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Mostrar notificação do navegador se permitido
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nova mensagem', {
        body: notification.message,
        icon: '/favicon.ico',
      });
    }
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // Verificar permissões de notificação ao carregar
  useEffect(() => {
    if (isAuthenticated) {
      requestNotificationPermission();
    }
  }, [isAuthenticated, requestNotificationPermission]);

  // Limpar notificações antigas (mais de 7 dias)
  useEffect(() => {
    const cleanup = setInterval(() => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      setNotifications(prev =>
        prev.filter(notif => notif.timestamp > sevenDaysAgo)
      );
    }, 24 * 60 * 60 * 1000); // Verificar a cada 24 horas

    return () => clearInterval(cleanup);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    requestNotificationPermission,
  };
};




