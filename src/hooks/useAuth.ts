import { useState, useEffect } from 'react';
import { useAppConfig } from '@context';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

export const useAuth = () => {
  const { isBackendEnabled, isFeatureEnabled } = useAppConfig();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFeatureEnabled('authentication')) {
      setLoading(false);
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
    setLoading(false);
  }, [isFeatureEnabled]);

  const login = (userData: User) => {
    if (!isFeatureEnabled('authentication')) {
      return;
    }
    setUser(userData);
  };

  const logout = () => {
    if (!isFeatureEnabled('authentication')) {
      return;
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = isFeatureEnabled('authentication') && !!user;

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };
};

