import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  readConsent,
  saveConsent,
  CONSENT_KEY,
  PRIVACY_VERSION,
} from '../src/privacy/consent.ts'
import {
  googleIdentity,
  canUseGoogleAccount,
} from '../backend/src/services/googleIdentity.ts'

test('analytics is denied by default, rejects corrupt or expired records, and saves each explicit choice', () => {
  const previousStorage = Object.getOwnPropertyDescriptor(
    globalThis,
    'localStorage'
  )
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const values = new Map()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  })
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: new EventTarget(),
  })
  try {
    assert.equal(readConsent(), 'unset')
    values.set(CONSENT_KEY, 'broken')
    assert.equal(readConsent(), 'unset')
    values.set(
      CONSENT_KEY,
      JSON.stringify({ analytics: true, version: 'old', at: Date.now() })
    )
    assert.equal(readConsent(), 'unset')
    values.set(
      CONSENT_KEY,
      JSON.stringify({
        analytics: true,
        version: PRIVACY_VERSION,
        at: Date.now() - 181 * 86400000,
      })
    )
    assert.equal(readConsent(), 'unset')
    assert.equal(saveConsent(false), true)
    assert.equal(readConsent(), 'rejected')
    assert.equal(saveConsent(true), true)
    assert.equal(readConsent(), 'accepted')
    assert.equal(saveConsent(false), true)
    assert.equal(readConsent(), 'rejected')
    globalThis.localStorage.getItem = () => {
      throw new Error('blocked')
    }
    globalThis.localStorage.setItem = () => {
      throw new Error('blocked')
    }
    assert.equal(readConsent(), 'unset')
    assert.equal(saveConsent(true), false)
  } finally {
    if (previousStorage)
      Object.defineProperty(globalThis, 'localStorage', previousStorage)
    else Reflect.deleteProperty(globalThis, 'localStorage')
    if (previousWindow)
      Object.defineProperty(globalThis, 'window', previousWindow)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})

test('entry HTML does not bootstrap analytics before a choice', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  assert.doesNotMatch(html, /googletagmanager|gtag\(/)
})

test('Google claims require a verified email, subject and challenge nonce', () => {
  const claims = {
    sub: 'google-123',
    email: 'User@example.com',
    email_verified: true,
    nonce: 'a'.repeat(64),
  }
  assert.equal(googleIdentity(claims).email, 'user@example.com')
  for (const patch of [
    { sub: '' },
    { email_verified: false },
    { nonce: undefined },
    { nonce: '../bad' },
    { email: 'bad/name@example.com' },
  ])
    assert.equal(googleIdentity({ ...claims, ...patch }), null)
  assert.equal(googleIdentity(undefined), null)
})

test('Google never links a password account or replaces another Google subject by matching email', () => {
  assert.equal(canUseGoogleAccount(undefined, '123'), true)
  assert.equal(canUseGoogleAccount({}, '123'), false)
  assert.equal(canUseGoogleAccount({ googleSub: '456' }, '123'), false)
  assert.equal(canUseGoogleAccount({ googleSub: '123' }, '123'), true)
})
