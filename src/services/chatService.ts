import {
  readMessageResponse,
  readChatError,
  fetchConversationGroups,
  summarizeConversation,
} from './chatApi'
import { logger } from '@src/services/logger'
import { getAuthToken, getAuthUser, clearAuthSession } from './authSession'
import { appConfig } from '../config/app.config'

import { chatDate, type ChatTimestamp } from './chatTimestamp'
import { createChatEventFeed } from './chatEvents'
export type { ChatTimestamp } from './chatTimestamp'

export interface ChatMessage {
  id: string
  message: string
  senderEmail: string
  senderName: string
  timestamp: ChatTimestamp
  isAdmin: boolean
  isRead: boolean
}

export interface ChatConversation {
  userId: string
  userEmail: string
  userName: string
  lastMessage: string
  lastMessageTime: ChatTimestamp
  unreadCount: number
  isOnline: boolean
}

export interface ChatNotification extends ChatMessage {
  conversationUserEmail: string
}

interface StoredUser {
  email?: string
}

const POLL_INTERVAL_MS = 10_000
const events = createChatEventFeed({
  url: `${appConfig.backend.baseUrl}/api/chat/events`,
  getToken: getAuthToken,
  onUnauthorized: clearAuthSession,
  keepAliveWhenHidden: true,
})

class ChatService {
  subscribeToUpdates(callback: () => void) {
    return events.subscribe(callback)
  }
  async getNotifications(): Promise<ChatNotification[]> {
    const headers = this.getAuthHeaders()
    if (!headers) throw new Error('CHAT_AUTH_REQUIRED')
    const response = await fetch(
      `${appConfig.backend.baseUrl}/api/chat/notifications`,
      {
        headers,
        signal: AbortSignal.timeout(15000),
      }
    )
    if (response.status === 401 || response.status === 403) clearAuthSession()
    if (!response.ok) throw new Error('CHAT_LOAD_FAILED')
    const data = await readMessageResponse(response)
    return data.data!.map((message) => ({
      ...message,
      isRead: Boolean(message.read),
      conversationUserEmail: message.conversationUserEmail || '',
    }))
  }
  async markMessagesRead(
    userId: string,
    messageIds: string[]
  ): Promise<boolean> {
    const headers = this.getAuthHeaders()
    const token = getAuthToken()
    if (!headers || !messageIds.length) return false
    try {
      const response = await fetch(
        `${appConfig.backend.baseUrl}/api/chat/read/${encodeURIComponent(userId)}`,
        {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageIds }),
          signal: AbortSignal.timeout(15000),
        }
      )
      if (response.ok && token === getAuthToken()) {
        window.dispatchEvent(
          new CustomEvent('portfolio:chat-read', {
            detail: { userId, messageIds },
          })
        )
        window.dispatchEvent(new Event('portfolio:chat-refresh'))
        return true
      }
      return false
    } catch {
      return false
    }
  }
  private readonly messageLimit = 500
  private readonly cooldownTime = 3_000
  private lastMessageTime = 0

  canSendMessage(): boolean {
    return Date.now() - this.lastMessageTime >= this.cooldownTime
  }

  validateMessage(message: string): { valid: boolean; error?: string } {
    if (!message.trim()) {
      return { valid: false, error: 'Mensagem não pode estar vazia' }
    }

    if (message.length > this.messageLimit) {
      return {
        valid: false,
        error: `Mensagem muito longa. Máximo ${this.messageLimit} caracteres`,
      }
    }

    return { valid: true }
  }

  async sendMessage(
    userId: string,
    message: string,
    isAdmin = false,
    clientMessageId: string = crypto.randomUUID()
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.canSendMessage()) {
        return {
          success: false,
          error: 'Aguarde alguns segundos antes de enviar outra mensagem',
        }
      }

      const validation = this.validateMessage(message)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      const headers = this.getAuthHeaders()
      if (!headers) {
        return { success: false, error: 'Usuário não autenticado' }
      }

      const response = await fetch(
        `${appConfig.backend.baseUrl}/api/chat/send`,
        {
          method: 'POST',
          signal: AbortSignal.timeout(15000),
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message.trim(),
            clientMessageId,
            recipientEmail: isAdmin ? userId : undefined,
          }),
        }
      )

      if (!response.ok) {
        const data = await readChatError(response)
        throw new Error(data.error?.message || 'Erro ao enviar mensagem')
      }

      window.dispatchEvent(new Event('portfolio:chat-refresh'))
      this.lastMessageTime = Date.now()
      return { success: true }
    } catch (error) {
      logger.error('Erro ao enviar mensagem:', error)
      return { success: false, error: 'Erro ao enviar mensagem' }
    }
  }

  subscribeToMessages(
    userId: string,
    callback: (messages: ChatMessage[]) => void,
    onError?: () => void
  ): () => void {
    let timeoutId: number | undefined
    let stopped = false
    let inFlight = false
    let refreshRequested = false
    const poll = async () => {
      if (stopped) return
      if (inFlight) {
        refreshRequested = true
        return
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      timeoutId = undefined
      inFlight = true
      try {
        if (!document.hidden) {
          const messages = await this.fetchMessagesForUser(userId)
          if (!stopped) {
            if (messages) callback(messages)
            else onError?.()
          }
        }
      } finally {
        inFlight = false
        if (!stopped)
          timeoutId = window.setTimeout(
            () => {
              void poll()
            },
            refreshRequested ? 0 : POLL_INTERVAL_MS
          )
        refreshRequested = false
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void poll()
      }
    }

    const refresh = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      void poll()
    }
    window.addEventListener('portfolio:chat-refresh', refresh)
    const stopEvents = this.subscribeToUpdates(refresh)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    void poll()

    return () => {
      stopped = true
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }
      window.removeEventListener('portfolio:chat-refresh', refresh)
      stopEvents()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }

  async getAllConversations(): Promise<ChatConversation[]> {
    try {
      const headers = this.getAuthHeaders()
      if (!headers) throw new Error('CHAT_AUTH_REQUIRED')

      const grouped = await fetchConversationGroups(
        appConfig.backend.baseUrl,
        headers
      )
      const conversations: ChatConversation[] = []
      for (const [email, messages] of Object.entries(grouped)) {
        const conversation = summarizeConversation(email, messages)
        if (conversation) conversations.push(conversation)
      }

      return conversations.sort(
        (first, second) =>
          this.toDate(second.lastMessageTime).getTime() -
          this.toDate(first.lastMessageTime).getTime()
      )
    } catch (error) {
      logger.error('Erro ao obter conversas:', error)
      throw error
    }
  }

  private getAuthHeaders(): Record<string, string> | null {
    const token = getAuthToken()
    const storedUser = getAuthUser()
    if (!token || !storedUser) return null

    try {
      const user = storedUser as StoredUser
      if (!user.email) return null

      return {
        Authorization: `Bearer ${token}`,
      }
    } catch {
      return null
    }
  }

  private async fetchMessagesForUser(
    userId: string
  ): Promise<ChatMessage[] | null> {
    try {
      const headers = this.getAuthHeaders()
      if (!headers) return null

      const response = await fetch(
        `${appConfig.backend.baseUrl}/api/chat/user/${encodeURIComponent(userId)}`,
        { headers, signal: AbortSignal.timeout(15000) }
      )
      if (!response.ok) return null

      const data = await readMessageResponse(response)
      return (data.data ?? []).map((message) => ({
        id: message.id,
        message: message.message,
        senderEmail: message.senderEmail,
        senderName: message.senderName,
        timestamp: message.timestamp,
        isAdmin: message.isAdmin,
        isRead: Boolean(message.read),
      }))
    } catch (error) {
      logger.error('Erro ao buscar mensagens:', error)
      return null
    }
  }

  toDate(timestamp: ChatTimestamp): Date {
    return chatDate(timestamp)
  }
}

export const chatService = new ChatService()
