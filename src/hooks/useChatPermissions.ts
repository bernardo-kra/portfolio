import { useAuth } from './useAuth'

export const useChatPermissions = () => {
  const { user, isAuthenticated } = useAuth()

  const isAdmin = user?.isChatOwner === true
  const canAccessChat = isAuthenticated
  const canViewAllChats = isAdmin
  const canSendMessages = isAuthenticated

  return {
    isAdmin,
    canAccessChat,
    canViewAllChats,
    canSendMessages,
    userEmail: user?.email,
    userName: user ? `${user.firstName} ${user.lastName}` : '',
  }
}
