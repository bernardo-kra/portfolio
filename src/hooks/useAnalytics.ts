import { useEffect, useSyncExternalStore } from 'react'
import { appConfig } from '@src/config/app.config'
import {
  readConsent,
  subscribeConsent,
  clearAnalyticsCookies,
} from '@src/privacy/consent'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-TTSRG7HEGS'
const enabled = () =>
  appConfig.features.analytics && readConsent() === 'accepted'
let initialized = false

export function useAnalytics() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    readConsent,
    () => 'unset'
  )
  useEffect(() => {
    const allowed = enabled()
    ;(window as unknown as Record<string, unknown>)[
      `ga-disable-${measurementId}`
    ] = !allowed
    if (!allowed) {
      clearAnalyticsCookies()
      return
    }
    if (initialized) return
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      // gtag's command queue uses the Arguments object from its official snippet.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      send_page_view: false,
      page_location: window.location.origin + window.location.pathname,
      page_referrer: '',
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    })
    const script = document.createElement('script')
    script.id = 'portfolio-analytics'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    document.head.appendChild(script)
    initialized = true
  }, [consent])
  return consent
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (enabled())
    window.gtag?.('event', action, {
      event_category: category,
      event_label: label,
      value,
    })
}
export function trackPageView(pagePath: string, pageTitle: string) {
  if (enabled())
    window.gtag?.('event', 'page_view', {
      page_path: pagePath.split(/[?#]/)[0],
      page_location: window.location.origin + pagePath.split(/[?#]/)[0],
      page_title: pageTitle,
    })
}
