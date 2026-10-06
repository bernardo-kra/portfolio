import type { AuthUser } from '../hooks/useAuth'
interface AuthResponse {
  success: boolean
  data: { token: string; user: AuthUser }
  error: { code?: string; message: string }
}
interface GoogleChallengeResponse {
  data?: { nonce?: string }
}
// Explicit contracts at our backend JSON boundary. Preserve the server payload
// intact and leave the existing HTTP/success checks to each caller.
export async function readAuthResponse(response: Response) {
  const payload: unknown = await response.json()
  return payload as AuthResponse
}
export async function readGoogleChallenge(response: Response) {
  const payload: unknown = await response.json()
  return payload as GoogleChallengeResponse
}
