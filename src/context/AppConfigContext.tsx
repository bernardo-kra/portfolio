import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, appConfig, updateConfig, resetConfig } from '@src/config/app.config';

interface AppConfigContextType {
  config: AppConfig;
  updateAppConfig: (newConfig: Partial<AppConfig>) => void;
  resetAppConfig: () => void;
  isBackendEnabled: boolean;
  isFeatureEnabled: (feature: keyof AppConfig['features']) => boolean;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

interface AppConfigProviderProps {
  children: ReactNode;
}

export const AppConfigProvider: React.FC<AppConfigProviderProps> = ({ children }) => {
  const [config] = useState<AppConfig>(appConfig);

  const updateAppConfig = (newConfig: Partial<AppConfig>) => {
    // Configuração via variáveis de ambiente
  };

  const resetAppConfig = () => {
    // Configuração via variáveis de ambiente
  };

  const isBackendEnabled = config.backend.enabled;
  
  const isFeatureEnabled = (feature: keyof AppConfig['features']) => {
    return config.features[feature] && isBackendEnabled;
  };

  const value: AppConfigContextType = {
    config,
    updateAppConfig,
    resetAppConfig,
    isBackendEnabled,
    isFeatureEnabled
  };

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = (): AppConfigContextType => {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error('useAppConfig deve ser usado dentro de um AppConfigProvider');
  }
  return context;
};
