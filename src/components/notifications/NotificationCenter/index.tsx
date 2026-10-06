import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Bell, BellRing, CheckCheck } from 'lucide-react'
import { useNotifications } from '@hooks/useNotifications'
import { useAuth } from '@hooks/useAuth'
import { useI18n } from '@src/i18n'
import workspaceStyles from '@components/chat/workspaceTheme.module.css'
import styles from './styles.module.css'

const permission = () =>
  'Notification' in window && window.isSecureContext
    ? Notification.permission
    : 'unsupported'

export default function NotificationCenter() {
  const { notifications, unreadCount, markAllAsRead, loadError, retry } =
    useNotifications()
  const { isAuthenticated, user } = useAuth()
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [nativePermission, setNativePermission] = useState(permission)
  const [position, setPosition] = useState({ top: 70, left: 12 })
  const button = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const panelId = useId()
  useEffect(() => {
    if (!open) return
    const outside = (event: MouseEvent) => {
      if (
        !button.current?.contains(event.target as Node) &&
        !panel.current?.contains(event.target as Node)
      )
        setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    const resize = () => setOpen(false)
    document.addEventListener('click', outside)
    document.addEventListener('keydown', escape)
    window.addEventListener('resize', resize)
    return () => {
      document.removeEventListener('click', outside)
      document.removeEventListener('keydown', escape)
      window.removeEventListener('resize', resize)
    }
  }, [open])
  if (!isAuthenticated) return null
  return (
    <>
      <button
        ref={button}
        className={styles.notificationButton}
        aria-label={pt ? 'Notificações' : 'Notifications'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const rect = button.current!.getBoundingClientRect()
          setPosition({
            left: Math.max(12, rect.right - Math.min(340, innerWidth - 24)),
            top: Math.min(rect.bottom + 8, innerHeight - 200),
          })
          setNativePermission(permission())
          setOpen(!open)
        }}
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className={styles.badge}
            aria-label={
              pt
                ? `${unreadCount} mensagens não lidas`
                : `${unreadCount} unread messages`
            }
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {open &&
        createPortal(
          <div
            ref={panel}
            id={panelId}
            role="region"
            aria-label={
              pt ? 'Notificações de mensagens' : 'Message notifications'
            }
            className={`${styles.panel} ${workspaceStyles.workspaceTheme}`}
            style={position}
          >
            <header>
              <h3>{pt ? 'Notificações' : 'Notifications'}</h3>
              {unreadCount > 0 && (
                <button
                  disabled={busy}
                  aria-label={
                    pt
                      ? 'Marcar avisos como lidos'
                      : 'Mark notifications as read'
                  }
                  onClick={async () => {
                    setBusy(true)
                    try {
                      await markAllAsRead()
                    } finally {
                      setBusy(false)
                    }
                  }}
                >
                  <CheckCheck size={18} />
                </button>
              )}
            </header>
            {loadError && (
              <div role="alert" className={styles.error}>
                {pt
                  ? 'Não foi possível atualizar os avisos.'
                  : 'Could not update notifications.'}{' '}
                <button onClick={retry}>
                  {pt ? 'Tentar novamente' : 'Retry'}
                </button>
              </div>
            )}
            <div className={styles.list}>
              {!notifications.length ? (
                <p className={styles.empty}>
                  {pt ? 'Nenhuma mensagem pendente.' : 'No unread messages.'}
                </p>
              ) : (
                notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={user?.isChatOwner ? '/admin/chat' : '/chat'}
                    className={styles.item}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.dot} />
                    <div>
                      <strong>{notification.senderName}</strong>
                      <p>{notification.message}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <footer>
              {nativePermission === 'default' ? (
                <button
                  className={styles.enable}
                  onClick={async () => {
                    try {
                      setNativePermission(
                        await Notification.requestPermission()
                      )
                    } catch {
                      setNativePermission('unsupported')
                    }
                  }}
                >
                  <BellRing size={15} />
                  {pt
                    ? 'Ativar avisos do navegador'
                    : 'Enable browser notifications'}
                </button>
              ) : (
                <p>
                  {nativePermission === 'granted'
                    ? pt
                      ? 'Avisos do navegador ativados.'
                      : 'Browser notifications enabled.'
                    : nativePermission === 'denied'
                      ? pt
                        ? 'Avisos bloqueados no navegador. Os avisos aqui continuam ativos.'
                        : 'Browser notifications blocked. In-site notifications remain active.'
                      : pt
                        ? 'Os avisos aparecem aqui enquanto você está conectado.'
                        : 'Notifications appear here while you are signed in.'}
                </p>
              )}
            </footer>
          </div>,
          document.body
        )}
    </>
  )
}
