import type { ChatTimestamp, ChatConversation } from './chatService'

export interface ChatApiMessage {
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

type MessageResponse = { data?: ChatApiMessage[] }
type ConversationResponse = {
  data?: {
    messagesByUser?: Record<string, ChatApiMessage[]>
    hasMore?: boolean
  }
}
type ErrorResponse = { error?: { message?: string } }

// Typed contracts at the backend's JSON boundary; no payload transformation.
export async function readMessageResponse(response: Response) {
  const payload: unknown = await response.json()
  return payload as MessageResponse
}
export async function readConversationResponse(response: Response) {
  const payload: unknown = await response.json()
  return payload as ConversationResponse
}
export async function readChatError(response: Response) {
  const payload: unknown = await response.json()
  return payload as ErrorResponse
}

export async function fetchConversationGroups(
  baseUrl: string,
  headers: Record<string, string>
) {
  const grouped: Record<string, ChatApiMessage[]> = Object.create(
    null
  ) as Record<string, ChatApiMessage[]>
  let offset = 0
  let hasMore = true
  while (hasMore) {
    const response = await fetch(
      `${baseUrl}/api/chat/all?limit=200&offset=${offset}`,
      {
        headers,
        signal: AbortSignal.timeout(15000),
      }
    )
    if (!response.ok) throw new Error('CHAT_LOAD_FAILED')
    const data = await readConversationResponse(response)
    for (const [email, messages] of Object.entries(
      data.data?.messagesByUser ?? {}
    )) {
      ;(grouped[email] ||= []).push(...messages)
    }
    hasMore = data.data?.hasMore === true
    offset += 200
  }
  return grouped
}

export function summarizeConversation(
  email: string,
  messages: ChatApiMessage[]
): ChatConversation | undefined {
  const lastMessage = messages[0]
  if (!lastMessage) return undefined
  return {
    userId: email,
    userEmail: email,
    userName: messages.find((message) => !message.isAdmin)?.senderName || email,
    lastMessage: lastMessage.message,
    lastMessageTime: lastMessage.timestamp,
    unreadCount: messages.filter((message) => !message.read && !message.isAdmin)
      .length,
    isOnline: false,
  }
}
