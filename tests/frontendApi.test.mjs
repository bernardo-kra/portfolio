import test from 'node:test'
import assert from 'node:assert/strict'
import {
  readAuthResponse,
  readGoogleChallenge,
} from '../src/services/authResponse.ts'
import {
  readChatError,
  readMessageResponse,
  readConversationResponse,
} from '../src/services/chatApi.ts'

test('typed backend boundaries preserve the original payload, including legacy optional names', async () => {
  const payloads = [
    {
      success: true,
      data: {
        token: 'session',
        user: { email: 'legacy@example.com', id: 'stored-id', role: 'user' },
      },
    },
    { success: false, error: { code: 'AUTH_FAILED', message: 'Try again' } },
    null,
  ]
  for (const payload of payloads) {
    const result = await readAuthResponse({ json: async () => payload })
    assert.equal(result, payload)
  }
})

test('challenge and chat JSON contracts retain omitted fields and server metadata', async () => {
  for (const read of [
    readGoogleChallenge,
    readChatError,
    readMessageResponse,
    readConversationResponse,
  ]) {
    const payload = {
      data: undefined,
      error: { message: 'Provider error' },
      metadata: { revision: 'original' },
    }
    assert.equal(await read({ json: async () => payload }), payload)
  }
})
