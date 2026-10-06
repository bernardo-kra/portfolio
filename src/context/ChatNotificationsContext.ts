import { createContext } from 'react'
import type { ChatNotification } from '../services/chatService'

export const ChatNotificationsContext = createContext<{
  notifications: ChatNotification[]
  unreadCount: number
  markAllAsRead: () => Promise<void>
  loadError: boolean
  retry: () => void
} | null>(null)
