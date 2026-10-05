export const PRIVACY_VERSION = '2026-09-29'
export const CONSENT_KEY = 'portfolio-privacy-v1'
export type Consent = 'accepted' | 'rejected' | 'unset'
const eventName = 'portfolio:privacy'

export function readConsent(): Consent {
  try {
    const saved = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null')
    if (
      saved?.version !== PRIVACY_VERSION ||
      !Number.isFinite(saved?.at) ||
      Date.now() - saved.at > 180 * 86400000
    )
      return 'unset'
    return saved.analytics === true
      ? 'accepted'
      : saved.analytics === false
        ? 'rejected'
        : 'unset'
  } catch {
    return 'unset'
  }
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener(eventName, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(eventName, callback)
    window.removeEventListener('storage', callback)
  }
}

export function saveConsent(analytics: boolean) {
  try {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ version: PRIVACY_VERSION, analytics, at: Date.now() })
    )
  } catch {
    return false
  }
  window.dispatchEvent(new Event(eventName))
  return true
}

export function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0]
    if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue
    const parts = location.hostname.split('.')
    const domains = [
      '',
      ...parts.map((_, index) => '.' + parts.slice(index).join('.')),
    ]
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax`
    }
  }
}
