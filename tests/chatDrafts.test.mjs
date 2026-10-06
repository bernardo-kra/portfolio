import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getChatDraft,
  editChatDraft,
  beginChatSend,
  finishChatSend,
  clearChatDrafts,
  subscribeChatDraft,
} from '../src/services/chatDrafts.ts'

test('successful send clears the shared draft even after its original input unmounts', () => {
  clearChatDrafts()
  editChatDraft('owner:alice', 'Reply')
  const attempt = beginChatSend('owner:alice')
  let updates = 0
  const unsubscribe = subscribeChatDraft('owner:alice', () => updates++)
  assert.equal(beginChatSend('owner:alice'), null)
  assert.equal(getChatDraft('owner:alice').pending, true)
  finishChatSend('owner:alice', attempt.id, true)
  assert.equal(getChatDraft('owner:alice').text, '')
  assert.equal(updates, 1)
  unsubscribe()
})

test('a failed send retains its ID for retry; editing creates a new ID', () => {
  clearChatDrafts()
  editChatDraft('owner:alice', 'Reply')
  const attempt = beginChatSend('owner:alice')
  finishChatSend('owner:alice', attempt.id, false)
  assert.equal(getChatDraft('owner:alice').id, attempt.id)
  editChatDraft('owner:alice', 'Different reply')
  assert.notEqual(getChatDraft('owner:alice').id, attempt.id)
  finishChatSend('owner:alice', attempt.id, true)
  assert.equal(getChatDraft('owner:alice').text, 'Different reply')
})

test('completion from a previous session does not erase a new session draft', () => {
  clearChatDrafts()
  editChatDraft('owner:alice', 'Old reply')
  const attempt = beginChatSend('owner:alice')
  clearChatDrafts()
  editChatDraft('owner:alice', 'New reply')
  finishChatSend('owner:alice', attempt.id, true)
  assert.equal(getChatDraft('owner:alice').text, 'New reply')
})
