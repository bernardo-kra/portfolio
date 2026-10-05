import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  getAuthToken,
  getAuthUser,
  setAuthSession,
  clearAuthSession,
  removeLegacyAuthStorage,
} from '../src/services/authSession.ts'

test('session uses memory, clears legacy storage, expires and logs out without depending on storage', () => {
  globalThis.window = new EventTarget()
  const values = new Map([
    ['token', 'old-token'],
    ['user', 'old-user'],
  ])
  globalThis.localStorage = {
    removeItem: (key) => values.delete(key),
    setItem: () => {
      throw Error('Credential persistence forbidden')
    },
  }
  const originalNow = Date.now
  let now = originalNow()
  Date.now = () => now
  try {
    removeLegacyAuthStorage()
    assert.equal(values.size, 0)
    setAuthSession('synthetic-token', { email: 'alice@example.com' })
    assert.equal(getAuthToken(), 'synthetic-token')
    assert.equal(getAuthUser().email, 'alice@example.com')
    now += 60 * 60 * 1000 + 1
    assert.equal(getAuthToken(), null)
    assert.equal(getAuthUser(), null)
    setAuthSession('new-token', { email: 'alice@example.com' })
    clearAuthSession()
    assert.equal(getAuthToken(), null)
    globalThis.localStorage.removeItem = () => {
      throw Error('Storage disabled')
    }
    assert.doesNotThrow(removeLegacyAuthStorage)
  } finally {
    Date.now = originalNow
    delete globalThis.window
    delete globalThis.localStorage
  }
})
