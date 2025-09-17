import React, { useState, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useAppConfig } from '@context';
import { ChatInterface } from '@components/chat';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const AdminChat: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { isFeatureEnabled, isBackendEnabled } = useAppConfig();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.loginRequired}>
          <h2>🔒 Acesso Restrito</h2>
          <p>Você precisa fazer login para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <h2>🚫 Acesso Negado</h2>
          <p>Esta página é restrita apenas para administradores.</p>
          <p>Seu perfil: <strong>{user?.role || 'user'}</strong></p>
        </div>
      </div>
    );
  }

  if (!isBackendEnabled || !isFeatureEnabled('chat')) {
    return (
      <div className={styles.container}>
        <div className={styles.serviceUnavailable}>
          <h2>⚠️ Serviço Indisponível</h2>
          <p>O sistema de chat está temporariamente indisponível.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1>💬 Painel de Administração - Chat</h1>
            <p>Gerencie todas as conversas e mensagens dos usuários</p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/portfolio" className={styles.backButton}>
              ← Voltar ao Portfolio
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.adminPanel}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>👤 Usuário Logado</h3>
            <p>{user?.firstName} {user?.lastName}</p>
            <span className={styles.role}>Admin</span>
          </div>
          <div className={styles.statCard}>
            <h3>📧 Email</h3>
            <p>{user?.email}</p>
          </div>
          <div className={styles.statCard}>
            <h3>🔐 Permissões</h3>
            <p>Visualizar todas as mensagens</p>
            <p>Responder usuários</p>
          </div>
        </div>

        <div className={styles.chatContainer}>
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
