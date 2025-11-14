export interface AppConfig {
  backend: {
    enabled: boolean;
    baseUrl: string;
  };
  features: {
    authentication: boolean;
    chat: boolean;
    analytics: boolean;
    portfolio: boolean;
  };
  ui: {
    showChatButton: boolean;
    showAuthButton: boolean;
    showContactMethods: boolean;
  };
}

const defaultConfig: AppConfig = {
  backend: {
    enabled: import.meta.env.VITE_BACKEND_ENABLED !== 'false',
    baseUrl: import.meta.env.VITE_BACKEND_URL || 
      (import.meta.env.DEV ? 'http://localhost:3001' : 'https://portfolio-08my.onrender.com')
  },
  features: {
    authentication: import.meta.env.VITE_AUTH_ENABLED !== 'false',
    chat: import.meta.env.VITE_CHAT_ENABLED !== 'false',
    analytics: import.meta.env.VITE_ANALYTICS_ENABLED !== 'false',
    portfolio: import.meta.env.VITE_PORTFOLIO_ENABLED !== 'false'
  },
  ui: {
    showChatButton: import.meta.env.VITE_SHOW_CHAT_BUTTON !== 'false',
    showAuthButton: import.meta.env.VITE_SHOW_AUTH_BUTTON !== 'false',
    showContactMethods: import.meta.env.VITE_SHOW_CONTACT_METHODS !== 'false'
  }
};

const getConfig = (): AppConfig => {
  const config = { ...defaultConfig };
  
  if (window.location.hostname === 'bernardo-kra.github.io') {
    config.backend.baseUrl = 'https://portfolio-08my.onrender.com';
  }
  
  if (import.meta.env.DEV) {
    console.log('App Config:', config);
  }
  return config;
};

export const appConfig = getConfig();

export const updateConfig = (newConfig: Partial<AppConfig>) => {
  return getConfig();
};

export const resetConfig = () => {
  return getConfig();
};
