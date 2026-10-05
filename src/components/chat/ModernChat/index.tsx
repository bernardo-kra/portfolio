import themeStyles from '../chatTheme.module.css'
import React, { useState } from 'react'
import { useChatPermissions } from '../../../hooks/useChatPermissions'
import ConversationList from '../ConversationList'
import WhatsAppChat from '../WhatsAppChat'
import { useI18n } from '@src/i18n'
import { LockKeyhole } from 'lucide-react'
import styles from './styles.module.css'

const ModernChat: React.FC = () => {
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const { canAccessChat, canViewAllChats, isAdmin } = useChatPermissions()
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>()
  const [showConversationList, setShowConversationList] = useState(false)

  if (!canAccessChat) {
    return (
      <div className={`${styles.chatContainer} ${themeStyles.chatTheme}`}>
        <div className={styles.accessDenied}>
          <div className={styles.accessDeniedIcon}>
            <LockKeyhole size={28} />
          </div>
          <h3>{pt ? 'Acesso restrito' : 'Sign-in required'}</h3>
          <p>
            {pt
              ? 'Entre para conversar em particular com Bernardo.'
              : 'Sign in to talk privately with Bernardo.'}
          </p>
        </div>
      </div>
    )
  }

  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId)
    setShowConversationList(false)
  }

  const handleBackToList = () => {
    setShowConversationList(true)
    setSelectedUserId(undefined)
  }

  return (
    <div className={`${styles.chatContainer} ${themeStyles.chatTheme}`}>
      {isAdmin && canViewAllChats ? (
        <div className={styles.adminLayout}>
          {showConversationList || !selectedUserId ? (
            <ConversationList
              onSelectConversation={handleSelectConversation}
              selectedUserId={selectedUserId}
            />
          ) : (
            <WhatsAppChat
              selectedUserId={selectedUserId}
              onBack={handleBackToList}
            />
          )}
        </div>
      ) : (
        <div className={styles.userLayout}>
          <WhatsAppChat />
        </div>
      )}
    </div>
  )
}

export default ModernChat
