// Chat service using backend API instead of Firebase
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

      const response = await fetch(`${appConfig.backend.baseUrl}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userEmail,
          userName,
          message: message.trim(),
          isAdmin,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
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
    // Polling-based approach since we're not using Firebase
    const pollMessages = async () => {
      try {
        const response = await fetch(`${appConfig.backend.baseUrl}/api/chat/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          callback(data.messages || []);
        }
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      }
    };

    // Initial load
    pollMessages();

    // Poll every 2 seconds
    const interval = setInterval(pollMessages, 2000);

    // Store cleanup function
    const cleanup = () => {
      clearInterval(interval);
      this.messageListeners.delete(userId);
    };

    this.messageListeners.set(userId, cleanup);
    return cleanup;
  }

  async getAllConversations(): Promise<ChatConversation[]> {
    try {
      const response = await fetch(`${appConfig.backend.baseUrl}/api/chat/all`);
      if (!response.ok) {
        throw new Error('Erro ao buscar conversas');
      }
      
      const data = await response.json();
      return data.conversations || [];
    } catch (error) {
      console.error('Erro ao obter conversas:', error);
      return [];
    }
  }

  async markMessagesAsRead(userId: string): Promise<void> {
    try {
      await fetch(`${appConfig.backend.baseUrl}/api/chat/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
    }
  }

  async createUserChat(userId: string, userEmail: string, userName: string): Promise<void> {
    try {
      await fetch(`${appConfig.backend.baseUrl}/api/chat/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userEmail,
          userName,
        }),
      });
    } catch (error) {
      console.error('Erro ao criar chat do usuário:', error);
    }
  }
}

export const chatService = new ChatService();
