import {
  getAuthToken,
  getAuthUser,
  clearAuthSession,
  removeLegacyAuthStorage,
} from '@src/services/authSession'
import { useState, useEffect } from 'react'
import { useAppConfig } from '@context'
import { appConfig } from '@src/config/app.config'

export interface AuthUser {
  email: string
  firstName: string
  lastName: string
  phone?: string
  role?: string
}

export const useAuth = () => {
  const { isFeatureEnabled } = useAppConfig()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFeatureEnabled('authentication')) {
      setLoading(false)
      return
    }

    removeLegacyAuthStorage()
    const sync = () => setUser(getAuthUser())
    sync()
    window.addEventListener('portfolio:auth', sync)
    const timer = window.setInterval(sync, 30000)
    setLoading(false)
    return () => {
      window.removeEventListener('portfolio:auth', sync)
      window.clearInterval(timer)
    }
  }, [isFeatureEnabled])

  const login = (userData: AuthUser) => {
    if (!isFeatureEnabled('authentication')) {
      return
    }
    setUser(userData)
  }

  const logout = () => {
    if (!isFeatureEnabled('authentication')) {
      return
    }
    const token = getAuthToken()
    if (token)
      void fetch(`${appConfig.backend.baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        keepalive: true,
      }).catch(() => {})
    clearAuthSession()
    setUser(null)
  }

  const isAuthenticated = isFeatureEnabled('authentication') && !!user

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  }
}
