export type GoogleIdentityClaims = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  nonce?: string;
  given_name?: string;
  family_name?: string;
};

// Signature, issuer, audience and expiry are verified by Google's library first.
export function googleIdentity(claims: GoogleIdentityClaims | undefined) {
  if (
    !claims?.sub ||
    !claims.email_verified ||
    typeof claims.email !== 'string' ||
    !/^[^\s/@]+@[^\s/@]+\.[^\s/@]+$/.test(claims.email) ||
    typeof claims.nonce !== 'string' ||
    !/^[a-f0-9]{64}$/.test(claims.nonce)
  )
    return null;
  return {
    sub: claims.sub,
    email: claims.email.toLowerCase(),
    nonce: claims.nonce,
    firstName: claims.given_name || claims.email.split('@')[0],
    lastName: claims.family_name || '',
  };
}

export function canUseGoogleAccount(
  existing: { googleSub?: string } | undefined,
  sub: string
) {
  // Never merge password accounts or replace a Google identity based on email alone.
  return !existing || existing.googleSub === sub;
}
