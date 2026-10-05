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

interface StoredUser {
  email?: string
}

interface ChatApiMessage {
  id: string
  message: string
  senderEmail: string
  senderName: string
  timestamp: ChatTimestamp
  isAdmin: boolean
  recipientEmail?: string
  conversationUserEmail?: string
  read?: boolean
}

const POLL_INTERVAL_MS = 10_000
const events = createChatEventFeed({
  url: `${appConfig.backend.baseUrl}/api/chat/events`,
  getToken: getAuthToken,
  onUnauthorized: clearAuthSession,
})

class ChatService {
  subscribeToUpdates(callback: () => void) {
    return events.subscribe(callback)
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
    isAdmin = false
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
            recipientEmail: isAdmin ? userId : undefined,
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error?.message || 'Erro ao enviar mensagem')
      }

      window.dispatchEvent(new Event('portfolio:chat-refresh'))
      this.lastMessageTime = Date.now()
      return { success: true }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
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
            poll,
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

      const grouped: Record<string, ChatApiMessage[]> = Object.create(null)
      let offset = 0
      let hasMore = true
      while (hasMore) {
        const response = await fetch(
          `${appConfig.backend.baseUrl}/api/chat/all?limit=200&offset=${offset}`,
          { headers, signal: AbortSignal.timeout(15000) }
        )
        if (!response.ok) throw new Error('CHAT_LOAD_FAILED')
        const data = await response.json()
        for (const [email, messages] of Object.entries(
          data.data?.messagesByUser ?? {}
        ) as [string, ChatApiMessage[]][]) {
          ;(grouped[email] ||= []).push(...messages)
        }
        hasMore = data.data?.hasMore === true
        offset += 200
      }
      const conversations: ChatConversation[] = []
      const entries = Object.entries(grouped)

      for (const [email, messages] of entries) {
        const lastMessage = messages[0]
        if (!lastMessage) continue

        conversations.push({
          userId: email,
          userEmail: email,
          userName:
            messages.find((message) => !message.isAdmin)?.senderName || email,
          lastMessage: lastMessage.message,
          lastMessageTime: lastMessage.timestamp,
          unreadCount: messages.filter(
            (message) => !message.read && !message.isAdmin
          ).length,
          isOnline: false,
        })
      }

      return conversations.sort(
        (first, second) =>
          this.toDate(second.lastMessageTime).getTime() -
          this.toDate(first.lastMessageTime).getTime()
      )
    } catch (error) {
      console.error('Erro ao obter conversas:', error)
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

      const data = await response.json()
      if (
        getAuthUser()?.isChatOwner &&
        ((data.data ?? []) as ChatApiMessage[]).some(
          (message) => !message.isAdmin && !message.read
        )
      ) {
        void fetch(
          `${appConfig.backend.baseUrl}/api/chat/read/${encodeURIComponent(userId)}`,
          {
            method: 'POST',
            headers,
          }
        ).catch(() => {})
      }
      return ((data.data ?? []) as ChatApiMessage[]).map((message) => ({
        id: message.id,
        message: message.message,
        senderEmail: message.senderEmail,
        senderName: message.senderName,
        timestamp: message.timestamp,
        isAdmin: message.isAdmin,
        isRead: Boolean(message.read),
      }))
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      return null
    }
  }

  toDate(timestamp: ChatTimestamp): Date {
    return chatDate(timestamp)
  }
}

export const chatService = new ChatService()
