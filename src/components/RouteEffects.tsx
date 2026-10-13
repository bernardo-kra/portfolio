import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from '@src/i18n'
import { useScrollToTop } from '@hooks/useScrollToTop'

function setMetadataAttribute(
  selector: string,
  attribute: string,
  value: string
) {
  document.querySelector(selector)?.setAttribute(attribute, value)
}
function routeFallbackTitle(route: string, lang: 'pt' | 'en') {
  return route === '/admin/chat' || route === '/chat'
    ? route === '/admin/chat'
      ? lang === 'pt'
        ? 'Caixa de entrada'
        : 'Inbox'
      : lang === 'pt'
        ? 'Conversa com Bernardo'
        : 'Conversation with Bernardo'
    : lang === 'pt'
      ? 'Página não encontrada'
      : 'Page not found'
}

function routeDescription(route: string, lang: 'pt' | 'en', fallback: string) {
  const descriptions: Record<string, string> = {
    '/agency':
      'Forma — estúdio criativo conceitual. Um estudo de design editorial, interfaces responsivas e desenvolvimento com React e TypeScript.',
    '/learning':
      lang === 'pt'
        ? 'Bastidores de uma interface: crie ícones em pixel art, teste animações, resolva desafios visuais e experimente as decisões por trás de uma tela.'
        : 'Behind the interface: create pixel art icons, test animations, solve visual challenges and explore the decisions behind a screen.',
  }
  return descriptions[route] ?? fallback
}

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
      '/experimental3d': 'Neon Bay — Intelligence Bureau',
      '/agency': 'Forma — Creative Studio',
      '/privacy': lang === 'pt' ? 'Privacidade' : 'Privacy',
      '/learning':
        lang === 'pt' ? 'Bastidores de uma interface' : 'Behind the interface',
    }
    const route = pathname.replace(/\/$/, '') || '/'
    const isPublicRoute = Object.hasOwn(titles, route)
    const fallbackTitle = routeFallbackTitle(route, lang)
    const title = `${t.name} — ${titles[route] ?? fallbackTitle}`
    const description = routeDescription(route, lang, t.recruiter.summary)
    setMetadataAttribute(
      'meta[name="robots"]',
      'content',
      isPublicRoute ? 'index, follow' : 'noindex, follow'
    )
    const url = `https://bernardo-kra.github.io${route === '/' ? '/' : route}`
    document.title = title
    document.documentElement.lang =
      route === '/agency' || lang === 'pt' ? 'pt-BR' : 'en'
    setMetadataAttribute('link[rel="canonical"]', 'href', url)
    setMetadataAttribute('meta[property="og:url"]', 'content', url)
    for (const selector of [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ]) {
      setMetadataAttribute(selector, 'content', title)
    }
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ]) {
      setMetadataAttribute(selector, 'content', description)
    }
  }, [pathname, lang, t])

  return null
}

export default RouteEffects
