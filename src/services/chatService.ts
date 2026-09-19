import { appConfig } from '../config/app.config'

export type ChatTimestamp =
  | string
  | number
  | Date
  | { seconds?: number; toDate?: () => Date }

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
  read?: boolean
}

const POLL_INTERVAL_MS = 10_000

class ChatService {
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

      this.lastMessageTime = Date.now()
      return { success: true }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      return { success: false, error: 'Erro ao enviar mensagem' }
    }
  }

  subscribeToMessages(
    userId: string,
    callback: (messages: ChatMessage[]) => void
  ): () => void {
    let timeoutId: number | undefined
    let stopped = false

    const poll = async () => {
      if (stopped) return

      if (!document.hidden) {
        const messages = await this.fetchMessagesForUser(userId)
        if (!stopped && messages) {
          callback(messages)
        }
      }

      if (!stopped) {
        timeoutId = window.setTimeout(poll, POLL_INTERVAL_MS)
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && timeoutId === undefined) {
        void poll()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    void poll()

    return () => {
      stopped = true
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }

  async getAllConversations(): Promise<ChatConversation[]> {
    try {
      const headers = this.getAuthHeaders()
      if (!headers) return []

      const response = await fetch(
        `${appConfig.backend.baseUrl}/api/chat/all`,
        { headers }
      )
      if (!response.ok) return []

      const data = await response.json()
      const conversations: ChatConversation[] = []
      const entries = Object.entries(data.data?.messagesByUser ?? {}) as Array<
        [string, ChatApiMessage[]]
      >

      for (const [email, messages] of entries) {
        const lastMessage = messages[0]
        if (!lastMessage) continue

        conversations.push({
          userId: email,
          userEmail: email,
          userName: lastMessage.senderName,
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
      return []
    }
  }

  private getAuthHeaders(): Record<string, string> | null {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (!token || !storedUser) return null

    try {
      const user = JSON.parse(storedUser) as StoredUser
      if (!user.email) return null

      return {
        Authorization: `Bearer ${token}`,
        'x-user-email': user.email,
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
        { headers }
      )
      if (!response.ok) return null

      const data = await response.json()
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

  private toDate(timestamp: ChatTimestamp): Date {
    if (timestamp instanceof Date) return timestamp
    if (typeof timestamp === 'object') {
      if (timestamp.toDate) return timestamp.toDate()
      if (timestamp.seconds !== undefined) {
        return new Date(timestamp.seconds * 1_000)
      }
      return new Date(0)
    }
    return new Date(timestamp)
  }
}

export const chatService = new ChatService()
