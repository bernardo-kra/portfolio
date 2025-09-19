import { 
  collection, 
  doc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  where,
  getDocs,
  serverTimestamp,
  updateDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

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

      const messagesRef = collection(db, 'chats', userId, 'messages');
      await addDoc(messagesRef, {
        message: message.trim(),
        senderEmail: userEmail,
        senderName: userName,
        timestamp: serverTimestamp(),
        isAdmin,
        isRead: false,
      });

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
    const messagesRef = collection(db, 'chats', userId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as ChatMessage);
      });
      callback(messages);
    });
  }

  async getAllConversations(): Promise<ChatConversation[]> {
    try {
      const chatsRef = collection(db, 'chats');
      const chatsSnapshot = await getDocs(chatsRef);
      
      const conversations: ChatConversation[] = [];
      
      for (const chatDoc of chatsSnapshot.docs) {
        const userId = chatDoc.id;
        const messagesRef = collection(db, 'chats', userId, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
        const messagesSnapshot = await getDocs(messagesQuery);
        
        if (!messagesSnapshot.empty) {
          const lastMessage = messagesSnapshot.docs[0].data();
          const allMessagesQuery = query(messagesRef, where('isRead', '==', false));
          const unreadSnapshot = await getDocs(allMessagesQuery);
          
          conversations.push({
            userId,
            userEmail: lastMessage.senderEmail,
            userName: lastMessage.senderName,
            lastMessage: lastMessage.message,
            lastMessageTime: lastMessage.timestamp,
            unreadCount: unreadSnapshot.size,
            isOnline: false,
          });
        }
      }
      
      return conversations.sort((a, b) => 
        b.lastMessageTime?.toDate?.()?.getTime() || 0 - 
        a.lastMessageTime?.toDate?.()?.getTime() || 0
      );
    } catch (error) {
      console.error('Erro ao obter conversas:', error);
      return [];
    }
  }

  async markMessagesAsRead(userId: string): Promise<void> {
    try {
      const messagesRef = collection(db, 'chats', userId, 'messages');
      const unreadQuery = query(messagesRef, where('isRead', '==', false));
      const unreadSnapshot = await getDocs(unreadQuery);
      
      const updatePromises = unreadSnapshot.docs.map(doc => 
        updateDoc(doc.ref, { isRead: true })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
    }
  }

  async createUserChat(userId: string, userEmail: string, userName: string): Promise<void> {
    try {
      const chatRef = doc(db, 'chats', userId);
      await setDoc(chatRef, {
        userId,
        userEmail,
        userName,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao criar chat do usuário:', error);
    }
  }
}

export const chatService = new ChatService();
