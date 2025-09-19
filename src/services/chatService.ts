import { appConfig } from '../config/app.config';

export interface ChatMessage {
  id: string;
  message: string;
  senderEmail: string;
  senderName: string;
  timestamp: any;
  isAdmin: boolean;
  isRead: boolean;
}

export interface ChatConversation {
  userId: string;
  userEmail: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: any;
  unreadCount: number;
  isOnline: boolean;
}

class ChatService {
  private readonly MESSAGE_LIMIT = 500;
  private readonly COOLDOWN_TIME = 3000;
  private lastMessageTime = 0;
  private messageListeners: Map<string, () => void> = new Map();
  private isPageVisible = true;

  canSendMessage(): boolean {
    const now = Date.now();
    return now - this.lastMessageTime >= this.COOLDOWN_TIME;
  }

  validateMessage(message: string): { valid: boolean; error?: string } {
    if (!message.trim()) {
      return { valid: false, error: 'Mensagem não pode estar vazia' };
    }
    if (message.length > this.MESSAGE_LIMIT) {
      return { valid: false, error: `Mensagem muito longa. Máximo ${this.MESSAGE_LIMIT} caracteres` };
    }
    return { valid: true };
  }

  async sendMessage(
    userId: string, 
    userEmail: string, 
    userName: string, 
    message: string, 
    isAdmin: boolean = false
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.canSendMessage()) {
        return { success: false, error: 'Aguarde alguns segundos antes de enviar outra mensagem' };
      }

      const validation = this.validateMessage(message);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const response = await fetch(`${appConfig.backend.baseUrl}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message.trim(),
          recipientEmail: isAdmin ? userId : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao enviar mensagem');
      }

      this.lastMessageTime = Date.now();
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return { success: false, error: 'Erro ao enviar mensagem' };
    }
  }

  subscribeToMessages(
    userId: string, 
    callback: (messages: ChatMessage[]) => void
  ): () => void {
    let lastMessageCount = 0;
    let pollInterval = 10000;
    let consecutiveEmptyResponses = 0;
    let intervalId: NodeJS.Timeout;

    const pollMessages = async () => {
      if (!this.isPageVisible) return;

      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch(`${appConfig.backend.baseUrl}/api/chat/user/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          const messages = (data.data || []).map((msg: any) => ({
            id: msg.id,
            message: msg.message,
            senderEmail: msg.senderEmail,
            senderName: msg.senderName,
            timestamp: msg.timestamp,
            isAdmin: msg.isAdmin,
            isRead: msg.read,
          }));

          if (messages.length !== lastMessageCount) {
            pollInterval = 2000;
            consecutiveEmptyResponses = 0;
            lastMessageCount = messages.length;
          } else {
            consecutiveEmptyResponses++;
            if (consecutiveEmptyResponses > 3) {
              pollInterval = Math.min(pollInterval * 1.2, 30000);
            }
          }

          callback(messages);
        }
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        pollInterval = 5000;
      }
    };

    const startPolling = () => {
      pollMessages();
      intervalId = setInterval(pollMessages, pollInterval);
    };

    const handleVisibilityChange = () => {
      this.isPageVisible = !document.hidden;
      if (this.isPageVisible) {
        startPolling();
      } else {
        clearInterval(intervalId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startPolling();

    const cleanup = () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      this.messageListeners.delete(userId);
    };

    this.messageListeners.set(userId, cleanup);
    return cleanup;
  }

  async getAllConversations(): Promise<ChatConversation[]> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return [];

      const response = await fetch(`${appConfig.backend.baseUrl}/api/chat/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      const conversations: ChatConversation[] = [];
      
      if (data.data?.messagesByUser) {
        Object.entries(data.data.messagesByUser).forEach(([email, messages]: [string, any]) => {
          if (messages.length > 0) {
            const lastMessage = messages[0];
            conversations.push({
              userId: email,
              userEmail: email,
              userName: lastMessage.senderName,
              lastMessage: lastMessage.message,
              lastMessageTime: lastMessage.timestamp,
              unreadCount: messages.filter((msg: any) => !msg.read && !msg.isAdmin).length,
              isOnline: false,
            });
          }
        });
      }
      
      return conversations.sort((a, b) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
    } catch (error) {
      console.error('Erro ao obter conversas:', error);
      return [];
    }
  }

  async markMessagesAsRead(messageId: string): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      await fetch(`${appConfig.backend.baseUrl}/api/chat/mark-read/${messageId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
    }
  }

}

export const chatService = new ChatService();
