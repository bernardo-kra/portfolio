import { createContext, useContext, type ReactNode } from 'react'
import { appConfig, type AppConfig } from '@src/config/app.config'

interface AppConfigContextType {
  config: AppConfig
  isBackendEnabled: boolean
  isFeatureEnabled: (feature: keyof AppConfig['features']) => boolean
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined
)

interface AppConfigProviderProps {
  children: ReactNode
}

export const AppConfigProvider = ({ children }: AppConfigProviderProps) => {
  const config = appConfig
  const isBackendEnabled = config.backend.enabled

  const isFeatureEnabled = (feature: keyof AppConfig['features']) => {
    return config.features[feature] && isBackendEnabled
  }

  const value: AppConfigContextType = {
    config,
    isBackendEnabled,
    isFeatureEnabled,
  }

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  )
}

export const useAppConfig = (): AppConfigContextType => {
  const context = useContext(AppConfigContext)
  if (context === undefined) {
    throw new Error(
      'useAppConfig deve ser usado dentro de um AppConfigProvider'
    )
  }
  return context
}
