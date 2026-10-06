import { useContext } from 'react'
import { ChatNotificationsContext } from '../context/ChatNotificationsContext'

export const useNotifications = () => {
  const context = useContext(ChatNotificationsContext)
  if (!context) throw new Error('ChatNotifications provider is required')
  return context
}
