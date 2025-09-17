import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useAppConfig } from '@context';
import styles from './styles.module.css';

interface Message {
  id: string;
  message: string;
  senderEmail: string;
  senderName: string;
  isAdmin: boolean;
  timestamp: any;
  read: boolean;
}

interface IndividualChatProps {
  targetUserEmail?: string;
  isAdminView?: boolean;
}

const IndividualChat: React.FC<IndividualChatProps> = ({ 
  targetUserEmail, 
  isAdminView = false 
}) => {
  const { user } = useAuth();
  const { config } = useAppConfig();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetUser, setTargetUser] = useState<{ name: string; email: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      if (isAdminView && targetUserEmail) {
        loadAdminMessages(targetUserEmail);
        setTargetUser({ name: 'Usuário', email: targetUserEmail });
      } else {
        loadUserMessages();
      }
    }
  }, [user, targetUserEmail, isAdminView]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUserMessages = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await fetch(`${config.backend.baseUrl}/api/chat/user/${user.email}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-email': user.email,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data || []);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadAdminMessages = async (userEmail: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`${config.backend.baseUrl}/api/chat/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-user-email': user.email,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        const userMessages = data.data.messages.filter((msg: any) => 
          msg.senderEmail === userEmail || 
          (msg.isAdmin && msg.replyTo === userEmail)
        );
        setMessages(userMessages);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await fetch(`${config.backend.baseUrl}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-email': user.email,
        },
        body: JSON.stringify({
          message: newMessage,
          recipientEmail: isAdminView ? targetUserEmail : undefined,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setNewMessage('');
        if (isAdminView && targetUserEmail) {
          loadAdminMessages(targetUserEmail);
        } else {
          loadUserMessages();
        }
      } else {
      }
    } catch (error) {
    }
  };

  const replyToMessage = async (originalMessageId: string, reply: string) => {
    if (!user || user.role !== 'admin') return;

    try {
      const response = await fetch(`${config.backend.baseUrl}/api/chat/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-user-email': user.email,
        },
        body: JSON.stringify({
          originalMessageId,
          reply,
          adminEmail: user.email,
          adminName: `${user.firstName} ${user.lastName}`,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (isAdminView && targetUserEmail) {
          loadAdminMessages(targetUserEmail);
        } else {
          loadUserMessages();
        }
      }
    } catch (error) {
    }
  };

  const formatTime = (timestamp: any) => {
    try {
      let date;
      
      if (timestamp && typeof timestamp === 'object') {
        if (timestamp.toDate && typeof timestamp.toDate === 'function') {
          date = timestamp.toDate();
        } else if (timestamp.seconds) {
          date = new Date(timestamp.seconds * 1000);
        } else if (timestamp._seconds) {
          date = new Date(timestamp._seconds * 1000);
        } else {
          date = new Date(timestamp);
        }
      } else {
        date = new Date(timestamp);
      }
      
      if (isNaN(date.getTime())) {
        return '--:--';
      }
      
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return '--:--';
    }
  };

  if (!user) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.loginRequired}>
          <p>Faça login para acessar o chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.chatUserInfo}>
          <div className={styles.avatar}>
            <div className={styles.avatarCircle}>
              {isAdminView && targetUser ? targetUser.name.charAt(0) : user.firstName.charAt(0)}
            </div>
          </div>
          <div className={styles.userDetails}>
            <h3>{isAdminView && targetUser ? targetUser.name : 'Chat Pessoal'}</h3>
            <span className={styles.userStatus}>
              {isAdminView ? 'Conversando com usuário' : 'Conversando com admin'}
            </span>
          </div>
        </div>
        {user.role === 'admin' && (
          <div className={styles.adminBadge}>Admin</div>
        )}
      </div>

      <div className={styles.messagesContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Carregando mensagens...</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.senderEmail === user.email ? styles.ownMessage : styles.otherMessage
                }`}
              >
                <div className={styles.messageBubble}>
                  <div className={styles.messageHeader}>
                    <span className={styles.senderName}>
                      {message.senderName}
                      {message.isAdmin && <span className={styles.adminTag}>Admin</span>}
                    </span>
                    <span className={styles.timestamp}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className={styles.messageContent}>
                    {message.message}
                  </div>
                  {message.senderEmail === user.email && (
                    <div className={`${styles.messageStatus} ${message.read ? styles.read : styles.unread}`}>
                      {message.read ? '✓✓' : '✓'}
                    </div>
                  )}
                </div>
                {user.role === 'admin' && !message.isAdmin && !message.replied && (
                  <button
                    className={styles.replyButton}
                    onClick={() => {
                      const reply = prompt('Digite sua resposta:');
                      if (reply) {
                        replyToMessage(message.id, reply);
                      }
                    }}
                  >
                    Responder
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={sendMessage} className={styles.messageForm}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className={styles.messageInput}
          />
          <button type="submit" className={styles.sendButton}>
            <span className={styles.sendIcon}>▶</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default IndividualChat;

