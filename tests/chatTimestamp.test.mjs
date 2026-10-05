import test from 'node:test'
import assert from 'node:assert/strict'
import { chatDate } from '../src/services/chatTimestamp.ts'

test('chat dates accept serialized Admin SDK timestamps and ISO dates', () => {
  const expected = Date.parse('2026-10-05T12:00:00Z')
  for (const value of [
    { _seconds: expected / 1000 },
    { seconds: expected / 1000 },
    new Date(expected),
    '2026-10-05T12:00:00Z',
    expected,
  ])
    assert.equal(chatDate(value).getTime(), expected)
})

test('missing or malformed historical dates do not crash the conversation', () => {
  for (const value of [null, undefined, {}, 'bad-date', new Date(NaN)])
    assert.equal(chatDate(value).getTime(), 0)
})
