import { db } from '../config/firebase.js';
import type { Query, DocumentData } from 'firebase-admin/firestore';

export async function recordPageView(data: Record<string, unknown>) {
  await db.collection('analytics').add(data);
}

export async function listAnalytics(
  startDate?: string,
  endDate?: string
): Promise<Array<Record<string, unknown> & { id: string }>> {
  let query: Query<DocumentData> = db.collection('analytics');
  if (startDate) query = query.where('timestamp', '>=', new Date(startDate));
  if (endDate) query = query.where('timestamp', '<=', new Date(endDate));
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Record<string, unknown>;
    return { id: doc.id, ...data };
  });
}
