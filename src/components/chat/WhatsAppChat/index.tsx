import React, { useState, useEffect, useRef } from 'react'
import { chatService, type ChatMessage } from '../../../services/chatService'
import { useChatPermissions } from '../../../hooks/useChatPermissions'
import MessageBubble from '../MessageBubble'
import MessageInput from '../MessageInput'
import { useI18n } from '@src/i18n'
import { MessageCircle, ArrowLeft, Search, X, LockKeyhole } from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'
import styles from './styles.module.css'

interface WhatsAppChatProps {
  selectedUserId?: string
  onBack?: () => void
  workspace?: boolean
  selectedName?: string
}
type RenderConversationComposerProps = {
  chatUserId: string
  userEmail: string | undefined
  handleSendMessage: (
    message: string,
    clientMessageId: string
  ) => Promise<boolean>
  sending: boolean
  cooldownRemaining: number
  workspace: boolean
  isAdmin: boolean
  pt: boolean
}

function renderConversationComposer({
  chatUserId,
  userEmail,
  handleSendMessage,
  sending,
  cooldownRemaining,
  workspace,
  isAdmin,
  pt,
}: RenderConversationComposerProps) {
  return (
    <MessageInput
      key={chatUserId}
      draftKey={`${userEmail}:${chatUserId}`}
      onSendMessage={handleSendMessage}
      disabled={sending}
      cooldownRemaining={cooldownRemaining}
      workspace={workspace}
      placeholder={
        isAdmin
          ? pt
            ? 'Responder a esta pessoa...'
            : 'Reply to this person...'
          : pt
            ? 'Digite sua mensagem...'
            : 'Type your message...'
      }
    />
  )
}

function useConversationSearch() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')

  return { searchOpen, setSearchOpen, search, setSearch }
}

function useConversationViewport() {
  const nearBottom = useRef(true)
  const previousLast = useRef<string | undefined>(undefined)
  const scrollContainer = useRef<HTMLDivElement>(null)
  const acknowledged = useRef(new Set<string>())

  return { nearBottom, previousLast, scrollContainer, acknowledged }
}

type RenderConversationViewProps = {
  workspace: boolean
  onBack: (() => void) | undefined
  pt: boolean
  contactName: string
  isAdmin: boolean
  selectedUserId: string | undefined
  searchOpen: boolean
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSearch: React.Dispatch<React.SetStateAction<string>>
  search: string
  displayedMessages: ChatMessage[]
  scrollContainer: React.RefObject<HTMLDivElement | null>
  nearBottom: React.RefObject<boolean>
  setNewMessages: React.Dispatch<React.SetStateAction<boolean>>
  messages: ChatMessage[]
  loadError: boolean
  userEmail: string | undefined
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  newMessages: boolean
  sendError: string
  chatUserId: string
  handleSendMessage: (
    message: string,
    clientMessageId: string
  ) => Promise<boolean>
  sending: boolean
  cooldownRemaining: number
}

function renderConversationView({
  workspace,
  onBack,
  pt,
  contactName,
  isAdmin,
  selectedUserId,
  searchOpen,
  setSearchOpen,
  setSearch,
  search,
  displayedMessages,
  scrollContainer,
  nearBottom,
  setNewMessages,
  messages,
  loadError,
  userEmail,
  messagesEndRef,
  newMessages,
  sendError,
  chatUserId,
  handleSendMessage,
  sending,
  cooldownRemaining,
}: RenderConversationViewProps) {
  return (
    <div
      className={`${styles.chatContainer} ${workspace ? styles.workspace : ''}`}
    >
      {renderConversationHeader({
        onBack,
        pt,
        workspace,
        contactName,
        isAdmin,
        selectedUserId,
        searchOpen,
        setSearchOpen,
        setSearch,
      })}
      {searchOpen && (
        <div className={styles.threadSearch}>
          <Search size={16} />
          <input
            autoFocus
            type="search"
            aria-label={pt ? 'Buscar mensagem' : 'Search messages'}
            placeholder={
              pt ? 'Buscar nesta conversa...' : 'Search this conversation...'
            }
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <span>
            {displayedMessages.length} {pt ? 'resultados' : 'results'}
          </span>
        </div>
      )}

      {renderConversationMessages({
        scrollContainer,
        nearBottom,
        setNewMessages,
        messages,
        loadError,
        pt,
        displayedMessages,
        userEmail,
        isAdmin,
        workspace,
        search,
        messagesEndRef,
      })}

      {loadError && (
        <div role="alert" className={styles.sendError}>
          {pt
            ? 'Não foi possível atualizar a conversa.'
            : 'Could not update the conversation.'}{' '}
          <button
            onClick={() =>
              window.dispatchEvent(new Event('portfolio:chat-refresh'))
            }
          >
            {pt ? 'Tentar novamente' : 'Retry'}
          </button>
        </div>
      )}
      {newMessages && (
        <button
          className={styles.newMessages}
          onClick={() => {
            nearBottom.current = true
            setNewMessages(false)
            messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
          }}
        >
          {pt ? 'Novas mensagens ↓' : 'New messages ↓'}
        </button>
      )}
      {sendError && (
        <p role="alert" className={styles.sendError}>
          {sendError}
        </p>
      )}
      {renderConversationComposer({
        chatUserId,
        userEmail,
        handleSendMessage,
        sending,
        cooldownRemaining,
        workspace,
        isAdmin,
        pt,
      })}
    </div>
  )
}

type RenderConversationIdentityProps = {
  workspace: boolean
  contactName: string
  isAdmin: boolean
  pt: boolean
  selectedUserId: string | undefined
}

function renderConversationIdentity({
  workspace,
  contactName,
  isAdmin,
  pt,
  selectedUserId,
}: RenderConversationIdentityProps) {
  return (
    <div className={styles.chatInfo}>
      <h3 className={styles.chatTitle}>
        {workspace
          ? contactName
          : isAdmin
            ? pt
              ? 'Conversa privada'
              : 'Private conversation'
            : pt
              ? 'Converse com Bernardo'
              : 'Talk to Bernardo'}
      </h3>
      <p className={styles.chatSubtitle}>
        {isAdmin
          ? selectedUserId
          : pt
            ? 'Somente você e Bernardo veem esta conversa'
            : 'Only you and Bernardo can see this conversation'}
      </p>
    </div>
  )
}

type SendConversationMessageProps = {
  chatUserId: string
  sending: boolean
  setSending: React.Dispatch<React.SetStateAction<boolean>>
  setSendError: React.Dispatch<React.SetStateAction<string>>
  isAdmin: boolean
  setCooldownRemaining: React.Dispatch<React.SetStateAction<number>>
  pt: boolean
}

async function sendConversationMessage(
  {
    chatUserId,
    sending,
    setSending,
    setSendError,
    isAdmin,
    setCooldownRemaining,
    pt,
  }: SendConversationMessageProps,
  message: string,
  clientMessageId: string
) {
  if (!chatUserId || sending) return false

  setSending(true)
  setSendError('')

  const result = await chatService.sendMessage(
    chatUserId,
    message,
    isAdmin,
    clientMessageId
  )

  if (result.success) {
    setCooldownRemaining(3)
  } else {
    setSendError(
      pt
        ? 'Não foi possível enviar. Sua mensagem foi mantida; tente novamente.'
        : 'Could not send. Your draft was kept; please retry.'
    )
  }

  setSending(false)
  return result.success
}

function useMessageDeliveryState() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  return {
    messages,
    setMessages,
    loading,
    setLoading,
    sending,
    setSending,
    sendError,
    setSendError,
    cooldownRemaining,
    setCooldownRemaining,
  }
}

type ObserveReceivedMessagesProps = {
  scrollContainer: React.RefObject<HTMLDivElement | null>
  chatUserId: string
  messages: ChatMessage[]
  userEmail: string | undefined
  acknowledged: React.RefObject<Set<string>>
}

function observeReceivedMessages({
  scrollContainer,
  chatUserId,
  messages,
  userEmail,
  acknowledged,
}: ObserveReceivedMessagesProps) {
  const root = scrollContainer.current
  if (!root || !chatUserId) return
  let stopped = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const pending = new Set<string>()
  const unread = new Set(
    messages
      .filter(
        (message) =>
          message.senderEmail !== userEmail &&
          !message.isRead &&
          !acknowledged.current.has(message.id)
      )
      .map((message) => message.id)
  )
  const observer = new IntersectionObserver(
    (entries) => {
      if (document.hidden || !document.hasFocus()) return
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).closest<HTMLElement>(
          '[data-chat-message]'
        )!.dataset.chatMessage!
        if (
          entry.isIntersecting &&
          entry.intersectionRect.height >=
            Math.min(24, entry.boundingClientRect.height)
        )
          pending.add(id)
        else pending.delete(id)
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        void acknowledge()
      }, 200)
      async function acknowledge() {
        if (stopped || document.hidden || !document.hasFocus()) return
        const ids = [...pending].slice(0, 100)
        if (!ids.length) return
        if (await chatService.markMessagesRead(chatUserId, ids))
          ids.forEach((id) => acknowledged.current.add(id))
      }
    },
    { root, threshold: [0, 0.1, 0.5, 1] }
  )
  const observe = () => {
    observer.disconnect()
    root
      .querySelectorAll<HTMLElement>('[data-chat-message]')
      .forEach((element) => {
        if (unread.has(element.dataset.chatMessage!))
          observer.observe(
            element.querySelector<HTMLElement>('[data-chat-message-text]') ||
              element
          )
      })
  }
  observe()
  document.addEventListener('visibilitychange', observe)
  window.addEventListener('focus', observe)
  return () => {
    stopped = true
    clearTimeout(timer)
    observer.disconnect()
    document.removeEventListener('visibilitychange', observe)
    window.removeEventListener('focus', observe)
  }
}

type RenderConversationHeaderProps = {
  onBack: (() => void) | undefined
  pt: boolean
  workspace: boolean
  contactName: string
  isAdmin: boolean
  selectedUserId: string | undefined
  searchOpen: boolean
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

function renderConversationHeader({
  onBack,
  pt,
  workspace,
  contactName,
  isAdmin,
  selectedUserId,
  searchOpen,
  setSearchOpen,
  setSearch,
}: RenderConversationHeaderProps) {
  return (
    <div className={styles.chatHeader}>
      {onBack && (
        <button
          aria-label={pt ? 'Voltar às conversas' : 'Back to conversations'}
          onClick={onBack}
          className={styles.backButton}
        >
          <ArrowLeft size={20} />
        </button>
      )}
      {workspace && (
        <div className={styles.avatar}>
          {contactName
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase()}
        </div>
      )}
      {renderConversationIdentity({
        workspace,
        contactName,
        isAdmin,
        pt,
        selectedUserId,
      })}
      {workspace && (
        <div className={styles.headerTools}>
          <span className={styles.privacyTag}>
            <LockKeyhole size={13} />
            {pt ? 'Privada' : 'Private'}
          </span>
          <button
            className={styles.searchButton}
            aria-label={
              searchOpen
                ? pt
                  ? 'Fechar busca'
                  : 'Close search'
                : pt
                  ? 'Buscar nesta conversa'
                  : 'Search this conversation'
            }
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen(!searchOpen)
              setSearch('')
            }}
          >
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>
        </div>
      )}
    </div>
  )
}

type RenderConversationMessagesProps = {
  scrollContainer: React.RefObject<HTMLDivElement | null>
  nearBottom: React.RefObject<boolean>
  setNewMessages: React.Dispatch<React.SetStateAction<boolean>>
  messages: ChatMessage[]
  loadError: boolean
  pt: boolean
  displayedMessages: ChatMessage[]
  userEmail: string | undefined
  isAdmin: boolean
  workspace: boolean
  search: string
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

function renderConversationMessages({
  scrollContainer,
  nearBottom,
  setNewMessages,
  messages,
  loadError,
  pt,
  displayedMessages,
  userEmail,
  isAdmin,
  workspace,
  search,
  messagesEndRef,
}: RenderConversationMessagesProps) {
  return (
    <div
      className={styles.messagesContainer}
      ref={scrollContainer}
      onScroll={() => {
        const el = scrollContainer.current
        if (el) {
          nearBottom.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < 80
          if (nearBottom.current) setNewMessages(false)
        }
      }}
    >
      {messages.length === 0 && !loadError ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <MessageCircle size={28} />
          </div>
          <h4>{pt ? 'Nenhuma mensagem ainda' : 'No messages yet'}</h4>
          <p>
            {pt
              ? 'Inicie uma conversa enviando uma mensagem!'
              : 'Send a message to start a conversation!'}
          </p>
        </div>
      ) : (
        displayedMessages.map((message, index) => (
          <React.Fragment key={message.id}>
            {(index === 0 ||
              !isSameDay(
                chatService.toDate(message.timestamp),
                chatService.toDate(displayedMessages[index - 1].timestamp)
              )) && (
              <p className={styles.dateLabel}>
                {chatService.toDate(message.timestamp).getTime()
                  ? format(chatService.toDate(message.timestamp), 'PPP', {
                      locale: pt ? ptBR : enUS,
                    })
                  : pt
                    ? 'Data indisponível'
                    : 'Date unavailable'}
              </p>
            )}
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderEmail === userEmail}
              showSenderName={isAdmin && message.senderEmail !== userEmail}
              workspace={workspace}
            />
          </React.Fragment>
        ))
      )}
      {search.trim() && displayedMessages.length === 0 && (
        <p className={styles.searchEmpty}>
          {pt ? 'Nenhuma mensagem encontrada.' : 'No messages found.'}
        </p>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  selectedUserId,
  onBack,
  workspace = false,
  selectedName,
}) => {
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const [loadError, setLoadError] = useState(false)
  const [newMessages, setNewMessages] = useState(false)
  const { nearBottom, previousLast, scrollContainer, acknowledged } =
    useConversationViewport()
  const { isAdmin, userEmail } = useChatPermissions()
  const {
    messages,
    setMessages,
    loading,
    setLoading,
    sending,
    setSending,
    sendError,
    setSendError,
    cooldownRemaining,
    setCooldownRemaining,
  } = useMessageDeliveryState()
  const { searchOpen, setSearchOpen, search, setSearch } =
    useConversationSearch()
  const displayedMessages = messages.filter(
    (message) =>
      !search.trim() ||
      message.message
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase())
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatUserId = selectedUserId || userEmail || ''
  const contactName = isAdmin
    ? selectedName ||
      selectedUserId ||
      (pt ? 'Conversa privada' : 'Private conversation')
    : 'Bernardo Kraczkowski'

  useEffect(() => {
    if (!chatUserId) return

    const unsubscribe = chatService.subscribeToMessages(
      chatUserId,
      (newMessages) => {
        setMessages(newMessages)
        setLoading(false)
        setLoadError(false)
      },
      () => {
        setLoading(false)
        setLoadError(true)
      }
    )

    return () => unsubscribe()
  }, [chatUserId, isAdmin, userEmail, setLoading, setMessages])

  useEffect(
    () =>
      observeReceivedMessages({
        scrollContainer,
        chatUserId,
        messages,
        userEmail,
        acknowledged,
      }),
    [messages, search, chatUserId, userEmail, acknowledged, scrollContainer]
  )

  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownRemaining, setCooldownRemaining])

  useEffect(() => {
    const last = messages.at(-1)?.id
    if (last !== previousLast.current) {
      if (nearBottom.current)
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
      else setNewMessages(true)
      previousLast.current = last
    }
  }, [messages, nearBottom, previousLast])

  const handleSendMessage = (message: string, clientMessageId: string) =>
    sendConversationMessage(
      {
        chatUserId,
        sending,
        setSending,
        setSendError,
        isAdmin,
        setCooldownRemaining,
        pt,
      },
      message,
      clientMessageId
    )

  if (loading) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>{pt ? 'Carregando conversa...' : 'Loading conversation...'}</p>
        </div>
      </div>
    )
  }

  return renderConversationView({
    workspace,
    onBack,
    pt,
    contactName,
    isAdmin,
    selectedUserId,
    searchOpen,
    setSearchOpen,
    setSearch,
    search,
    displayedMessages,
    scrollContainer,
    nearBottom,
    setNewMessages,
    messages,
    loadError,
    userEmail,
    messagesEndRef,
    newMessages,
    sendError,
    chatUserId,
    handleSendMessage,
    sending,
    cooldownRemaining,
  })
}

export default WhatsAppChat
