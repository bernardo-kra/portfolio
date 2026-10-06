import { db } from '../config/firebase.js';
import {
  canUseGoogleAccount,
  googleIdentity,
} from '../services/googleIdentity.js';
import { isChatOwner } from '../services/chatPolicy.js';
import { userAccount, type UserAccount } from './userRepository.js';

type VerifiedIdentity = NonNullable<ReturnType<typeof googleIdentity>>;
interface GoogleChallenge {
  expiresAt?: { toMillis(): number };
}

export async function storeGoogleChallenge(nonce: string) {
  await db
    .collection('googleChallenges')
    .doc(nonce)
    .set({ expiresAt: new Date(Date.now() + 5 * 60000) });
}

function googleUser(
  existing: UserAccount | undefined,
  identity: VerifiedIdentity
) {
  return {
    email: identity.email,
    firstName: existing?.firstName || identity.firstName,
    lastName: existing?.lastName || identity.lastName,
    role: existing?.role || 'user',
    isChatOwner: isChatOwner({
      email: identity.email,
      googleSub: identity.sub,
    }),
  };
}

export async function consumeGoogleChallenge(identity: VerifiedIdentity) {
  return db.runTransaction(async (transaction) => {
    const challengeRef = db.collection('googleChallenges').doc(identity.nonce);
    const userRef = db.collection('users').doc(identity.email);
    const [challenge, user] = await Promise.all([
      transaction.get(challengeRef),
      transaction.get(userRef),
    ]);
    // Challenges written above are converted by Firestore to Timestamp values.
    const challengeData = challenge.data() as GoogleChallenge | undefined;
    const expiry = challengeData?.expiresAt?.toMillis();
    if (!expiry || expiry <= Date.now())
      return { error: 'GOOGLE_EXPIRED' } as const;
    transaction.delete(challengeRef);
    const existing = userAccount(user.data());
    if (!canUseGoogleAccount(existing, identity.sub))
      return { error: 'GOOGLE_EXISTING_ACCOUNT' } as const;
    if (!existing)
      transaction.create(userRef, {
        email: identity.email,
        firstName: identity.firstName,
        lastName: identity.lastName,
        googleSub: identity.sub,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    return { user: googleUser(existing, identity) };
  });
}
