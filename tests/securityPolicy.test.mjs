import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { secureEntryHtml } from '../build/securityPolicy.ts'

test('production policy authorizes exact inline scripts, blocks inline handlers and limits API origins', () => {
  const script = 'window.history.replaceState(null, "", "/portfolio")'
  const html = secureEntryHtml(`<html><head></head><body><script>${script}</script><script src="/assets/app.js"></script></body></html>`, 'https://api.example.com/path')
  const policy = html.match(/Content-Security-Policy" content="([^"]+)/)[1]
  assert.ok(policy.includes(`'sha256-${createHash('sha256').update(script).digest('base64')}'`))
  assert.match(policy, /script-src-attr 'none'/)
  assert.match(policy, /base-uri 'none'/)
  assert.match(policy, /connect-src 'self' https:\/\/api.example.com /)
  assert.doesNotMatch(policy.match(/script-src ([^;]+)/)[1], /unsafe-inline|unsafe-eval|https:\s/)
})
