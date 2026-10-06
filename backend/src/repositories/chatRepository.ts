import { createHash } from 'node:crypto';
import { db } from '../config/firebase.js';
import { chatOwnerEmail, conversationEmail } from '../services/chatPolicy.js';
import type { AuthenticatedUser } from '../middleware/auth.js';

export interface ChatData extends Record<string, unknown> {
  conversationUserEmail?: string;
  senderEmail?: string;
  recipientEmail?: string;
  replyTo?: string;
  isAdmin?: boolean;
  timestamp?: Date | { toMillis(): number };
  read?: boolean;
}

export interface ChatRecord extends ChatData {
  id: string;
}

// Firestore's untyped payloads follow the existing chat schema. Keep every field
// and the existing spread order, including historical documents.
function chatData(data: unknown) {
  return data as ChatData;
}

export const messageTime = (value: unknown): number => {
  if (value && typeof value === 'object' && 'toMillis' in value)
    return (value as { toMillis: () => number }).toMillis();
  return value instanceof Date ? value.getTime() : 0;
};

export async function readConversation(email: string) {
  // Separate equality queries preserve old messages without composite indexes.
  const snapshots = await Promise.all([
    db.collection('chats').where('conversationUserEmail', '==', email).get(),
    db.collection('chats').where('senderEmail', '==', email).get(),
    db.collection('chats').where('recipientEmail', '==', email).get(),
    db.collection('chats').where('replyTo', '==', email).get(),
  ]);
  const records = new Map<string, ChatRecord>();
  for (const snapshot of snapshots)
    for (const doc of snapshot.docs) {
      const data = chatData(doc.data());
      if (conversationEmail(data) === email)
        records.set(doc.id, { ...data, id: doc.id });
    }
  return [...records.values()].sort(
    (a, b) => messageTime(a.timestamp) - messageTime(b.timestamp)
  );
}

export async function incomingVisitorMessages() {
  const snapshot = await db
    .collection('chats')
    .where('isAdmin', '==', false)
    .get();
  return snapshot.docs.map((doc) => ({ ...chatData(doc.data()), id: doc.id }));
}

export async function sendMessage(
  user: AuthenticatedUser,
  message: string,
  email: string,
  clientMessageId?: string
) {
  const data = {
    message: message.trim(),
    senderEmail: user.email,
    senderName: [user.firstName, user.lastName].filter(Boolean).join(' '),
    recipientEmail: user.isChatOwner ? email : chatOwnerEmail(),
    conversationUserEmail: user.isChatOwner ? email : user.email,
    isAdmin: user.isChatOwner,
    timestamp: new Date(),
    read: false,
  };
  const ref = clientMessageId
    ? db
        .collection('chats')
        .doc(
          createHash('sha256')
            .update(`${user.email}\0${clientMessageId}`)
            .digest('hex')
        )
    : db.collection('chats').doc();
  if (clientMessageId) {
    return db.runTransaction(async (transaction) => {
      const existing = await transaction.get(ref);
      if (existing.exists) {
        const saved = chatData(existing.data());
        if (
          saved.message !== data.message ||
          saved.conversationUserEmail !== data.conversationUserEmail ||
          saved.senderEmail !== data.senderEmail
        )
          throw new Error('MESSAGE_ID_CONFLICT');
        return { ...saved, id: ref.id };
      }
      transaction.create(ref, data);
      for (const participant of new Set([
        chatOwnerEmail(),
        data.conversationUserEmail,
      ]))
        transaction.set(db.collection('chatActivity').doc(participant), {
          messageId: ref.id,
        });
      return { id: ref.id, ...data };
    });
  }
  const batch = db.batch();
  batch.set(ref, data);
  // Atomically notify both endpoints without exposing message content.
  for (const participant of new Set([
    chatOwnerEmail(),
    data.conversationUserEmail,
  ]))
    batch.set(db.collection('chatActivity').doc(participant), {
      messageId: ref.id,
    });
  await batch.commit();
  return { id: ref.id, ...data };
}

export async function listRecentMessages(limit: number, offset: number) {
  const snapshot = await db
    .collection('chats')
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .offset(offset)
    .get();
  return snapshot.docs.map((doc) => ({ ...chatData(doc.data()), id: doc.id }));
}

export async function markMessageRead(messageId: string) {
  await db
    .collection('chats')
    .doc(messageId)
    .update({ read: true, readAt: new Date() });
}

export async function markConversationRead(messages: ChatRecord[]) {
  for (let start = 0; start < messages.length; start += 400) {
    const batch = db.batch();
    for (const message of messages.slice(start, start + 400))
      batch.update(db.collection('chats').doc(message.id), {
        read: true,
        readAt: new Date(),
      });
    await batch.commit();
  }
}

export async function findMessage(id: string) {
  const doc = await db.collection('chats').doc(id).get();
  return { exists: doc.exists, data: chatData(doc.data()) };
}

export async function allMessageData() {
  const snapshot = await db.collection('chats').get();
  return snapshot.docs.map((doc) => chatData(doc.data()));
}
