import React, { useState } from 'react';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { appConfig } from '../../../config/app.config';
import styles from './styles.module.css';

interface RegisterFormProps {
  onSuccess: (user: any) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
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

    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${appConfig.backend.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
        localStorage.setItem('token', data.data.customToken);
        onSuccess(data.data);
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <Input
            type="text"
            name="firstName"
            label="Nome"
            placeholder="Nome"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="lastName"
            label="Sobrenome"
            placeholder="Sobrenome"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          label="Senha"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          label="Confirmar Senha"
          placeholder="Confirmar Senha"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Input
          type="tel"
          name="phone"
          label="Telefone (opcional)"
          placeholder="Telefone (opcional)"
          value={formData.phone}
          onChange={handleChange}
        />
        {error && <div className={styles.error}>{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </Button>
      </form>
      <p className={styles.switch}>
        Já tem conta?{' '}
        <button type="button" onClick={onSwitchToLogin} className={styles.link}>
          Faça login
        </button>
      </p>
    </div>
  );
};

