import { db } from '../config/firebase.js';

// Stored users are keyed by email. Optional fields cover existing password and
// Google accounts; the cast documents that persisted schema, without validating
// or changing the data returned by Firestore.
export interface UserAccount {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  password?: unknown;
  googleSub?: string;
}

export function userAccount(data: unknown): UserAccount | undefined {
  return data as UserAccount | undefined;
}

export async function findUser(email: string) {
  const doc = await db.collection('users').doc(email).get();
  return { exists: doc.exists, data: userAccount(doc.data()) };
}

export async function userExists(email: string) {
  return (await db.collection('users').doc(email).get()).exists;
}
