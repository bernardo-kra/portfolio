import React, { useState } from 'react';
import { appConfig } from '../../../config/app.config';
import styles from './styles.module.css';

interface SimpleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const SimpleAuthModal: React.FC<SimpleAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isLogin 
        ? `${appConfig.backend.baseUrl}/api/auth/login`
        : `${appConfig.backend.baseUrl}/api/auth/register`;

      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.data.user || data.data;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.data.customToken || '');
        onSuccess(userData);
        onClose();
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        <div className={styles.header}>
          <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
          <button 
            className={styles.switchButton}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
              });
            }}
          >
            {isLogin ? 'Criar conta' : 'Já tenho conta'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.row}>
              <input
                type="text"
                name="firstName"
                placeholder="Nome"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Sobrenome"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.input}
          />

          {!isLogin && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar Senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Telefone (opcional)"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>
      </div>
    </div>
  );
};
