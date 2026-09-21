import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from '@src/i18n'
import { useScrollToTop } from '@hooks/useScrollToTop'

const RouteEffects = () => {
  const { pathname } = useLocation()
  const { t, lang } = useI18n()
  useScrollToTop()

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': t.myProjects,
      '/portfolio': t.recruiter.pageTitle,
      '/pomodoro': t.pomodoroTitle,
      '/generative': t.generativeTitle,
      '/landing': t.landingTitle,
      '/experimental3d': 'Dock 07',
      '/agency': 'Forma — Creative Studio',
    }
    const route = pathname.replace(/\/$/, '') || '/'
    const isPublicRoute = Object.hasOwn(titles, route)
    const fallbackTitle =
      route === '/admin/chat'
        ? 'Admin Chat'
        : lang === 'pt'
          ? 'Página não encontrada'
          : 'Page not found'
    const title = `${t.name} — ${titles[route] ?? fallbackTitle}`
    const description =
      route === '/agency'
        ? 'Forma — estúdio criativo conceitual. Um estudo de design editorial, interfaces responsivas e desenvolvimento com React e TypeScript.'
        : t.recruiter.summary
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute(
        'content',
        isPublicRoute ? 'index, follow' : 'noindex, follow'
      )
    const url = `https://bernardo-kra.github.io${route === '/' ? '/' : route}`
    document.title = title
    document.documentElement.lang =
      route === '/agency' || lang === 'pt' ? 'pt-BR' : 'en'
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute('content', url)
    for (const selector of [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ]) {
      document.querySelector(selector)?.setAttribute('content', title)
    }
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ]) {
      document.querySelector(selector)?.setAttribute('content', description)
    }
  }, [pathname, lang, t])

  return null
}

export default RouteEffects
