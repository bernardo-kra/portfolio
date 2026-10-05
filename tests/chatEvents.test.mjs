import test from 'node:test'
import assert from 'node:assert/strict'
import { createChatEventFeed } from '../src/services/chatEvents.ts'

test('chat SSE shares a connection, decodes split frames and reconnects on visibility/auth changes', async () => {
  const original = {
    window: globalThis.window,
    document: globalThis.document,
    fetch: globalThis.fetch,
  }
  globalThis.window = new EventTarget()
  globalThis.document = new EventTarget()
  document.hidden = false
  let token = 'private-token'
  const streams = []
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://backend.example/api/chat/events')
    assert.equal(options.headers.Authorization, `Bearer ${token}`)
    assert.ok(!url.includes(token))
    let writer
    const body = new ReadableStream({
      start(controller) {
        writer = controller
      },
    })
    options.signal.addEventListener(
      'abort',
      () => writer.error(new Error('aborted')),
      { once: true }
    )
    streams.push({ writer, signal: options.signal })
    return new Response(body, {
      headers: { 'content-type': 'text/event-stream' },
    })
  }
  const until = async (predicate) => {
    const deadline = Date.now() + 2000
    while (!predicate()) {
      if (Date.now() >= deadline) throw new Error('Expected stream state')
      await new Promise((resolve) => setTimeout(resolve, 5))
    }
  }
  let first = 0,
    second = 0
  const feed = createChatEventFeed({
    url: 'https://backend.example/api/chat/events',
    getToken: () => token,
    onUnauthorized: () => {
      token = null
    },
  })
  const stopFirst = feed.subscribe(() => first++)
  const stopSecond = feed.subscribe(() => second++)
  try {
    await until(() => streams.length === 1)
    const encode = (value) => new TextEncoder().encode(value)
    streams[0].writer.enqueue(encode(': heartbeat\r\n\r\ndata: {"type":'))
    await new Promise((resolve) => setTimeout(resolve, 10))
    assert.equal(first, 0)
    streams[0].writer.enqueue(encode('"refresh"}\r\n\r\n'))
    await until(() => first === 1 && second === 1)
    document.hidden = true
    document.dispatchEvent(new Event('visibilitychange'))
    assert.equal(streams[0].signal.aborted, true)
    document.hidden = false
    document.dispatchEvent(new Event('visibilitychange'))
    await until(() => streams.length === 2)
    stopFirst()
    assert.equal(streams[1].signal.aborted, false)
    streams[1].writer.enqueue(encode('data: {"type":"refresh"}\n\n'))
    await until(() => second === 2)
    assert.equal(first, 1)
    token = null
    window.dispatchEvent(new Event('portfolio:auth'))
    assert.equal(streams[1].signal.aborted, true)
  } finally {
    stopFirst()
    stopSecond()
    await new Promise((resolve) => setTimeout(resolve, 10))
    Object.assign(globalThis, original)
  }
})
