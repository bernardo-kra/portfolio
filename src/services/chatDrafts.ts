export type ChatDraft = { text: string; id: string; pending: boolean }
const empty: ChatDraft = { text: '', id: '', pending: false }
const drafts = new Map<string, ChatDraft>()
const listeners = new Map<string, Set<() => void>>()
const notify = (key: string) => {
  for (const listener of listeners.get(key) || []) listener()
}
export const getChatDraft = (key: string) => drafts.get(key) || empty
export function subscribeChatDraft(key: string, callback: () => void) {
  const callbacks = listeners.get(key) || new Set<() => void>()
  listeners.set(key, callbacks)
  callbacks.add(callback)
  return () => {
    callbacks.delete(callback)
    if (!callbacks.size) listeners.delete(key)
  }
}
export function editChatDraft(key: string, text: string) {
  const current = getChatDraft(key)
  if (current.pending || current.text === text) return
  if (!text) drafts.delete(key)
  else drafts.set(key, { text, id: crypto.randomUUID(), pending: false })
  notify(key)
}
export function beginChatSend(key: string): ChatDraft | null {
  const current = getChatDraft(key)
  if (!current.text.trim() || current.pending) return null
  drafts.set(key, { ...current, pending: true })
  notify(key)
  return current
}
export function finishChatSend(key: string, id: string, sent: boolean) {
  const current = getChatDraft(key)
  if (current.id !== id) return
  if (sent) drafts.delete(key)
  else drafts.set(key, { ...current, pending: false })
  notify(key)
}
export function clearChatDrafts() {
  drafts.clear()
  for (const key of listeners.keys()) notify(key)
}
if (typeof window !== 'undefined')
  window.addEventListener('portfolio:auth', clearChatDrafts)
