import themeStyles from '../chatTheme.module.css'
import workspaceStyles from '../workspaceTheme.module.css'
import React, { useState } from 'react'
import { useChatPermissions } from '../../../hooks/useChatPermissions'
import ConversationList from '../ConversationList'
import WhatsAppChat from '../WhatsAppChat'
import { useI18n } from '@src/i18n'
import { LockKeyhole, MessagesSquare, Inbox, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ChatConversation } from '../../../services/chatService'
import styles from './styles.module.css'
type RenderAdminWelcomeProps = { pt: boolean }

function renderAdminWelcome({ pt }: RenderAdminWelcomeProps) {
  return (
    <div className={styles.welcome}>
      <div className={styles.welcomeArt}>
        <MessagesSquare size={42} strokeWidth={1.3} />
        <span />
        <span />
      </div>
      <span className={styles.welcomeLabel}>
        {pt ? 'SEU ESPAÇO DE CONVERSA' : 'YOUR CONVERSATION SPACE'}
      </span>
      <h2>
        {pt ? 'Boas conversas começam aqui.' : 'Good conversations start here.'}
      </h2>
      <p>
        {pt
          ? 'Escolha alguém na lista ao lado. O histórico e suas respostas ficam juntos, em um só lugar.'
          : 'Choose someone from the list. Their history and your replies stay together, in one place.'}
      </p>
      <span className={styles.privateNote}>
        <LockKeyhole size={14} />
        {pt
          ? 'Conversas privadas entre você e cada visitante'
          : 'Private conversations between you and each visitor'}
      </span>
    </div>
  )
}

type RenderAdminWorkspaceProps = {
  pt: boolean
  handleBackToList: () => void
  selectedUserId: string | undefined
  handleSelectConversation: (
    userId: string,
    conversation?: ChatConversation
  ) => void
  selectedName: string
}

function renderAdminWorkspace({
  pt,
  handleBackToList,
  selectedUserId,
  handleSelectConversation,
  selectedName,
}: RenderAdminWorkspaceProps) {
  return (
    <div className={styles.workspaceLayout}>
      <nav
        className={styles.rail}
        aria-label={pt ? 'Navegação do chat' : 'Chat navigation'}
      >
        <span className={styles.brand}>
          bk<span>.</span>
        </span>
        <button
          className={styles.railActive}
          onClick={handleBackToList}
          aria-label={pt ? 'Caixa de entrada' : 'Inbox'}
          title={pt ? 'Caixa de entrada' : 'Inbox'}
        >
          <Inbox size={22} />
        </button>
        <Link
          to="/portfolio"
          aria-label={pt ? 'Abrir portfólio' : 'Open portfolio'}
          title={pt ? 'Abrir portfólio' : 'Open portfolio'}
        >
          <ArrowUpRight size={21} />
        </Link>
        <span
          className={styles.ownerAvatar}
          title={pt ? 'Proprietário' : 'Owner'}
        >
          BK
        </span>
      </nav>
      <aside
        className={`${styles.sidebar} ${selectedUserId ? styles.mobileHidden : ''}`}
        aria-label={pt ? 'Lista de conversas' : 'Conversation list'}
      >
        <ConversationList
          onSelectConversation={handleSelectConversation}
          selectedUserId={selectedUserId}
          workspace
        />
      </aside>
      <section
        className={`${styles.thread} ${!selectedUserId ? styles.mobileHidden : ''}`}
        aria-label={pt ? 'Conversa selecionada' : 'Selected conversation'}
      >
        {selectedUserId ? (
          <WhatsAppChat
            key={selectedUserId}
            selectedUserId={selectedUserId}
            selectedName={selectedName}
            onBack={handleBackToList}
            workspace
          />
        ) : (
          renderAdminWelcome({ pt })
        )}
      </section>
    </div>
  )
}

type RenderVisitorWorkspaceProps = { workspace: boolean; pt: boolean }

function renderVisitorWorkspace({
  workspace,
  pt,
}: RenderVisitorWorkspaceProps) {
  return (
    <div
      className={`${styles.userLayout} ${workspace ? styles.visitorLayout : ''}`}
    >
      {workspace && (
        <aside
          className={styles.visitorSidebar}
          aria-label={pt ? 'Sua conversa direta' : 'Your direct conversation'}
        >
          <span className={styles.visitorKicker}>
            {pt ? 'MENSAGENS DIRETAS' : 'DIRECT MESSAGES'}
          </span>
          <h3>
            {pt ? 'Conversas' : 'Conversations'} <span>1</span>
          </h3>
          <div className={styles.visitorContact}>
            <div>BK</div>
            <p>
              <strong>Bernardo Kraczkowski</strong>
              <span>
                {pt ? 'Sua conversa privada' : 'Your private conversation'}
              </span>
            </p>
          </div>
          <div className={styles.visitorPrivacy}>
            <LockKeyhole size={17} />
            <p>
              {pt
                ? 'Este espaço é só seu e do Bernardo. Seu histórico não aparece para outros visitantes.'
                : 'This space is just for you and Bernardo. Your history is not visible to other visitors.'}
            </p>
            <Link to="/privacy">
              {pt ? 'Privacidade e seus dados' : 'Privacy and your data'}
            </Link>
          </div>
        </aside>
      )}
      <WhatsAppChat workspace={workspace} />
    </div>
  )
}

const ModernChat: React.FC<{ workspace?: boolean }> = ({
  workspace = false,
}) => {
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const { canAccessChat, canViewAllChats, isAdmin } = useChatPermissions()
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>()
  const [showConversationList, setShowConversationList] = useState(false)
  const [selectedName, setSelectedName] = useState('')

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

  const handleSelectConversation = (
    userId: string,
    conversation?: ChatConversation
  ) => {
    setSelectedUserId(userId)
    setSelectedName(conversation?.userName || userId)
    setShowConversationList(false)
  }

  const handleBackToList = () => {
    setShowConversationList(true)
    setSelectedUserId(undefined)
  }

  return (
    <div
      className={`${styles.chatContainer} ${themeStyles.chatTheme} ${workspace ? `${styles.workspace} ${workspaceStyles.workspaceTheme}` : ''}`}
    >
      {isAdmin && canViewAllChats ? (
        workspace ? (
          renderAdminWorkspace({
            pt,
            handleBackToList,
            selectedUserId,
            handleSelectConversation,
            selectedName,
          })
        ) : (
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
        )
      ) : (
        renderVisitorWorkspace({ workspace, pt })
      )}
    </div>
  )
}

export default ModernChat
