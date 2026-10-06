import React, { useState, useEffect, useRef } from 'react'
import { chatService } from '../../../services/chatService'
import type {
  ChatConversation,
  ChatTimestamp,
} from '../../../services/chatService'
import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'
import { chatDate } from '../../../services/chatTimestamp'
import { useI18n } from '@src/i18n'
import { RefreshCw, MessageCircle, Search } from 'lucide-react'
import styles from './styles.module.css'

interface ConversationListProps {
  onSelectConversation: (
    userId: string,
    conversation?: ChatConversation
  ) => void
  selectedUserId?: string
  workspace?: boolean
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedUserId,
  workspace = false,
}) => {
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const [query, setQuery] = useState('')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const inFlight = useRef(false)
  const alive = useRef(true)
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    alive.current = true
    void loadConversations()

    const interval = setInterval(loadConversations, 30000)
    const refresh = () => {
      void loadConversations()
    }
    window.addEventListener('portfolio:chat-refresh', refresh)
    const stopEvents = chatService.subscribeToUpdates(refresh)
    return () => {
      alive.current = false
      clearInterval(interval)
      window.removeEventListener('portfolio:chat-refresh', refresh)
      stopEvents()
    }
  }, [])

  const loadConversations = async () => {
    if (inFlight.current) return
    inFlight.current = true
    setRefreshing(true)
    try {
      const data = await chatService.getAllConversations()
      if (alive.current) {
        setConversations(data)
        setError(false)
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      if (alive.current) setError(true)
    } finally {
      inFlight.current = false
      if (alive.current) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }

  const formatLastMessageTime = (timestamp: ChatTimestamp) => {
    if (!timestamp) return ''

    try {
      const date = chatDate(timestamp)
      if (!date.getTime()) return ''
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

      if (diffInHours < 24) {
        return format(date, 'HH:mm', { locale: pt ? ptBR : enUS })
      } else if (diffInHours < 168) {
        return format(date, 'EEE', { locale: pt ? ptBR : enUS })
      } else {
        return format(date, pt ? 'dd/MM' : 'MMM d', { locale: ptBR })
      }
    } catch {
      return ''
    }
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  const filtered = conversations.filter(
    (c) =>
      (!unreadOnly || c.unreadCount > 0) &&
      `${c.userName} ${c.userEmail}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase())
  )

  if (loading) {
    return (
      <div className={styles.conversationList}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>{pt ? 'Carregando conversas...' : 'Loading conversations...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${styles.conversationList} ${workspace ? styles.workspace : ''}`}
    >
      <div className={styles.header}>
        <div>
          <span className={styles.kicker}>
            {pt ? 'MENSAGENS DIRETAS' : 'DIRECT MESSAGES'}
          </span>
          <h3>
            {pt ? 'Conversas' : 'Conversations'}{' '}
            <span className={styles.total}>{conversations.length}</span>
          </h3>
        </div>
        <button
          onClick={loadConversations}
          className={styles.refreshButton}
          disabled={refreshing}
          aria-label={pt ? 'Atualizar conversas' : 'Refresh conversations'}
          title={pt ? 'Atualizar conversas' : 'Refresh conversations'}
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchField}>
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={pt ? 'Buscar conversa' : 'Search conversations'}
            placeholder={pt ? 'Buscar nome ou email' : 'Search name or email'}
          />
        </div>
        <div
          className={styles.filterTabs}
          aria-label={pt ? 'Filtrar conversas' : 'Filter conversations'}
        >
          <button
            aria-pressed={!unreadOnly}
            onClick={() => setUnreadOnly(false)}
          >
            {pt ? 'Todas' : 'All'}
          </button>
          <button aria-pressed={unreadOnly} onClick={() => setUnreadOnly(true)}>
            {pt ? 'Não lidas' : 'Unread'}
            <span>{conversations.filter((c) => c.unreadCount > 0).length}</span>
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className={styles.error}>
          {pt
            ? 'Falha ao atualizar. Use o botão atualizar para tentar novamente.'
            : 'Update failed. Use refresh to try again.'}
        </p>
      )}
      <div className={styles.conversationsContainer}>
        {conversations.length > 0 && filtered.length === 0 && (
          <p className={styles.emptyState}>
            {pt
              ? 'Nenhuma conversa corresponde aos filtros.'
              : 'No conversations match these filters.'}
          </p>
        )}
        {conversations.length === 0 && !error ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <MessageCircle size={28} />
            </div>
            <h4>{pt ? 'Nenhuma conversa' : 'No conversations'}</h4>
            <p>
              {pt
                ? 'Ainda não há conversas iniciadas'
                : 'No conversations have been started yet'}
            </p>
          </div>
        ) : (
          filtered.map((conversation) => (
            <button
              type="button"
              key={conversation.userId}
              className={`${styles.conversationItem} ${
                selectedUserId === conversation.userId ? styles.selected : ''
              }`}
              onClick={() =>
                onSelectConversation(conversation.userId, conversation)
              }
              aria-current={
                selectedUserId === conversation.userId ? 'true' : undefined
              }
            >
              <div className={styles.conversationAvatar}>
                <span>
                  {conversation.userName
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join('')
                    .toUpperCase()}
                </span>
                {conversation.isOnline && (
                  <div className={styles.onlineIndicator}></div>
                )}
              </div>

              <div className={styles.conversationContent}>
                <div className={styles.conversationHeader}>
                  <h4 className={styles.conversationName}>
                    {conversation.userName}
                  </h4>
                  <span className={styles.conversationTime}>
                    {formatLastMessageTime(conversation.lastMessageTime)}
                  </span>
                </div>

                <div className={styles.conversationFooter}>
                  <p className={styles.lastMessage}>
                    {truncateMessage(conversation.lastMessage)}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <div className={styles.unreadBadge}>
                      {conversation.unreadCount > 99
                        ? '99+'
                        : conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      {workspace && (
        <div className={styles.listFooter}>
          <span />
          {pt
            ? 'Atualização automática das conversas'
            : 'Conversations refresh automatically'}
        </div>
      )}
    </div>
  )
}

export default ConversationList
