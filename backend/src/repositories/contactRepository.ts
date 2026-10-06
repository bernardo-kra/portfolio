import { db } from '../config/firebase.js';

export async function createContactMessage(data: Record<string, unknown>) {
  return db.collection('messages').add(data);
}

export async function listContactMessages() {
  const snapshot = await db
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function markContactMessageRead(id: string) {
  await db
    .collection('messages')
    .doc(id)
    .update({ read: true, readAt: new Date() });
}
