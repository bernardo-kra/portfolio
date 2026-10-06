import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, X } from 'lucide-react'
import { useAuth } from '@hooks/useAuth'
import { useAppConfig } from '@context'
import { useI18n } from '@src/i18n'
import { ChatNotificationsContext } from '@src/context/ChatNotificationsContext'
import { chatService, type ChatNotification } from '@src/services/chatService'
import { getAuthToken } from '@src/services/authSession'
import workspaceStyles from '@components/chat/workspaceTheme.module.css'
import styles from './styles.module.css'

export default function ChatNotifications({
  children,
}: {
  children: ReactNode
}) {
  const { user } = useAuth()
  const { isFeatureEnabled } = useAppConfig()
  const { lang } = useI18n()
  const navigate = useNavigate()
  const navigation = useRef(navigate)
  useEffect(() => {
    navigation.current = navigate
  }, [navigate])
  const pt = lang === 'pt'
  const email = user?.email
  const sessionToken = getAuthToken()
  const owner = user?.isChatOwner === true
  const enabled = isFeatureEnabled('chat')
  const [state, setState] = useState<{
    email?: string
    notifications: ChatNotification[]
    loadError: boolean
  }>({ notifications: [], loadError: false })
  const [notice, setNotice] = useState<{
    email: string
    notification: ChatNotification
  } | null>(null)
  const retry = useCallback(
    () => window.dispatchEvent(new Event('portfolio:chat-refresh')),
    []
  )

  useEffect(() => {
    setNotice(null)
    setState({ email, notifications: [], loadError: false })
    if (!email || !enabled) return
    const token = sessionToken
    let stopped = false,
      inFlight = false,
      requested = false,
      initialized = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let noticeTimer: ReturnType<typeof setTimeout> | undefined
    const seen = new Set<string>(),
      read = new Set<string>()
    const nativeNotifications = new Set<Notification>()
    const current = () => !stopped && getAuthToken() === token
    const poll = async () => {
      if (!current()) return
      if (inFlight) {
        requested = true
        return
      }
      clearTimeout(timer)
      inFlight = true
      try {
        const incoming = await chatService.getNotifications()
        if (!current()) return
        const notifications = incoming.filter(
          (message) => !read.has(message.id)
        )
        const fresh = notifications.filter((message) => !seen.has(message.id))
        incoming.forEach((message) => seen.add(message.id))
        setState({ email, notifications, loadError: false })
        if (initialized && fresh.length) {
          const latest = fresh[0]
          clearTimeout(noticeTimer)
          noticeTimer = setTimeout(() => {
            if (!current() || read.has(latest.id)) return
            const visible =
              !document.hidden &&
              document.hasFocus() &&
              [
                ...document.querySelectorAll<HTMLElement>(
                  '[data-chat-message]'
                ),
              ].some((element) => {
                if (element.dataset.chatMessage !== latest.id) return false
                const rect = (
                  element.querySelector('[data-chat-message-text]') || element
                ).getBoundingClientRect()
                const root = element.parentElement?.getBoundingClientRect()
                return (
                  root &&
                  rect.bottom > Math.max(root.top, 0) &&
                  rect.top < Math.min(root.bottom, innerHeight)
                )
              })
            if (visible) return
            setNotice({ email, notification: latest })
            if (
              (document.hidden || !document.hasFocus()) &&
              'Notification' in window &&
              Notification.permission === 'granted'
            ) {
              try {
                const english = document.documentElement.lang === 'en'
                const notification = new Notification(
                  english ? 'New chat message' : 'Nova mensagem no chat',
                  {
                    body: english
                      ? 'Open your conversation to read the reply.'
                      : 'Abra sua conversa para ler a resposta.',
                    icon: '/favicon.ico',
                    tag: 'portfolio-chat',
                  }
                )
                nativeNotifications.add(notification)
                notification.onclick = () => {
                  if (current()) {
                    window.focus()
                    navigation.current(owner ? '/admin/chat' : '/chat')
                  }
                  notification.close()
                }
                notification.onclose = () =>
                  nativeNotifications.delete(notification)
              } catch {
                /* In-site notices still work when desktop notifications are unsupported. */
              }
            }
          }, 350)
        }
        initialized = true
      } catch {
        if (current())
          setState((previous) => ({
            email,
            notifications:
              previous.email === email ? previous.notifications : [],
            loadError: true,
          }))
      } finally {
        inFlight = false
        if (current()) timer = setTimeout(poll, requested ? 0 : 10000)
        requested = false
      }
    }
    const refresh = () => {
      void poll()
    }
    const receivedRead = (event: Event) => {
      const ids = (event as CustomEvent<{ messageIds: string[] }>).detail
        .messageIds
      ids.forEach((id) => read.add(id))
      setState((previous) => ({
        ...previous,
        notifications: previous.notifications.filter(
          (message) => !read.has(message.id)
        ),
      }))
      setNotice((previous) =>
        previous && read.has(previous.notification.id) ? null : previous
      )
      refresh()
    }
    const stopEvents = chatService.subscribeToUpdates(refresh)
    window.addEventListener('portfolio:chat-refresh', refresh)
    window.addEventListener('portfolio:chat-read', receivedRead)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    void poll()
    return () => {
      stopped = true
      clearTimeout(timer)
      clearTimeout(noticeTimer)
      nativeNotifications.forEach((notification) => notification.close())
      stopEvents()
      window.removeEventListener('portfolio:chat-refresh', refresh)
      window.removeEventListener('portfolio:chat-read', receivedRead)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [email, enabled, owner, sessionToken])

  const notifications = useMemo(
    () => (enabled && state.email === email ? state.notifications : []),
    [enabled, state.email, state.notifications, email]
  )
  const markAllAsRead = useCallback(async () => {
    const token = getAuthToken()
    const groups = new Map<string, string[]>()
    for (const notification of notifications) {
      const ids = groups.get(notification.conversationUserEmail) || []
      ids.push(notification.id)
      groups.set(notification.conversationUserEmail, ids)
    }
    const results = await Promise.all(
      [...groups].map(([id, ids]) => chatService.markMessagesRead(id, ids))
    )
    if (token === getAuthToken() && results.some((result) => !result))
      setState((previous) => ({ ...previous, loadError: true }))
  }, [notifications])
  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.length,
      markAllAsRead,
      loadError: enabled && state.email === email && state.loadError,
      retry,
    }),
    [
      notifications,
      markAllAsRead,
      enabled,
      state.email,
      state.loadError,
      email,
      retry,
    ]
  )
  const activeNotice = enabled && notice?.email === email ? notice : null

  return (
    <ChatNotificationsContext.Provider value={value}>
      {children}
      {activeNotice && (
        <aside
          role="status"
          className={`${styles.notice} ${workspaceStyles.workspaceTheme}`}
        >
          <MessageCircle size={22} aria-hidden="true" />
          <div>
            <strong>{pt ? 'Nova mensagem' : 'New message'}</strong>
            <p>{activeNotice.notification.senderName}</p>
            <Link
              to={owner ? '/admin/chat' : '/chat'}
              onClick={() => setNotice(null)}
            >
              {pt ? 'Abrir conversa' : 'Open conversation'}
            </Link>
          </div>
          <button
            onClick={() => setNotice(null)}
            aria-label={pt ? 'Fechar aviso' : 'Dismiss notification'}
          >
            <X size={17} />
          </button>
        </aside>
      )}
    </ChatNotificationsContext.Provider>
  )
}
