import type { AuthUser } from '../hooks/useAuth'
let token: string | null = null
let user: AuthUser | null = null
let expiry = 0
export const getAuthToken = () => (Date.now() < expiry ? token : null)
export const getAuthUser = () => (getAuthToken() ? user : null)
export function setAuthSession(nextToken: string, nextUser: AuthUser) {
  expiry = Date.now() + 60 * 60 * 1000
  token = nextToken
  user = nextUser
  window.dispatchEvent(new Event('portfolio:auth'))
}
export function clearAuthSession() {
  token = null
  user = null
  window.dispatchEvent(new Event('portfolio:auth'))
}
export function removeLegacyAuthStorage() {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  } catch {
    /* Authentication does not depend on browser storage. */
  }
}
