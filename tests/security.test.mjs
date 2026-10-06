import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { createHash, randomUUID } from 'node:crypto'

// Exercise real HTTP handlers with synthetic records, never production data.
const records = new Map()
let writes = 0
let nextDoc = 0
const listeners = new Map()
const notifyDocument = (key) => {
  for (const callback of listeners.get(key) || []) callback(snapshot(key))
}
const snapshot = (key) => ({
  exists: records.has(key),
  data: () => records.get(key),
})

globalThis.__securityTestDb = {
  collection(name) {
    const filters = []
    let limit = Infinity
    let offset = 0
    return {
      doc(id = `generated-${++nextDoc}`) {
        const key = `${name}/${id}`
        return {
          id,
          onSnapshot(callback) {
            const callbacks = listeners.get(key) || new Set()
            listeners.set(key, callbacks)
            callbacks.add(callback)
            queueMicrotask(() => {
              if (callbacks.has(callback)) callback(snapshot(key))
            })
            return () => callbacks.delete(callback)
          },
          get: async () => snapshot(key),
          set: async (data) => {
            writes++
            records.set(key, data)
            notifyDocument(key)
          },
          create: async (data) => {
            writes++
            records.set(key, data)
          },
          update: async (data) => {
            writes++
            records.set(key, { ...records.get(key), ...data })
          },
          delete: async () => {
            writes++
            records.delete(key)
          },
        }
      },
      orderBy() {
        return this
      },
      where(field, _operator, value) {
        filters.push([field, value])
        return this
      },
      limit(value) {
        limit = value
        return this
      },
      offset(value) {
        offset = value
        return this
      },
      get: async () => ({
        docs: [...records]
          .filter(
            ([key, value]) =>
              key.startsWith(`${name}/`) &&
              filters.every(([field, expected]) => value[field] === expected)
          )
          .slice(offset, offset + limit)
          .map(([key, data]) => ({ id: key.split('/')[1], data: () => data })),
      }),
      add: async (data) => {
        writes++
        const id = `new-${writes}`
        records.set(`${name}/${id}`, data)
        return { id }
      },
    }
  },
  batch() {
    const operations = []
    return {
      set: (ref, data) => operations.push(() => ref.set(data)),
      update: (ref, data) => operations.push(() => ref.update(data)),
      commit: async () => Promise.all(operations.map((fn) => fn())),
    }
  },
  async runTransaction(callback) {
    return callback({
      get: (ref) => ref.get(),
      set: (ref, data) => ref.set(data),
      delete: (ref) => ref.delete(),
      create: (ref, data) => ref.create(data),
    })
  },
}
const hook = registerHooks({
  load(url, context, next) {
    if (url.includes('/google-auth-library/') && url.endsWith('/build/src/index.js'))
      return {
        format: 'module', shortCircuit: true,
        source: `export class OAuth2Client {
          async verifyIdToken() {
            if (!globalThis.__googleTestClaims) throw new Error('Invalid token');
            return { getPayload: () => globalThis.__googleTestClaims };
          }
        }`,
      }
    if (url.endsWith('/backend/dist/config/firebase.js'))
      return {
        format: 'module',
        shortCircuit: true,
        source: 'export const db = globalThis.__securityTestDb;',
      }
    return next(url, context)
  },
})
const { default: express } = await import(
  '../backend/node_modules/express/index.js'
)
const { default: routes } = await import('../backend/dist/routes/index.js')
const { createSession, getSessionEmail, revokeSession } = await import(
  '../backend/dist/services/sessionService.js'
)
const { accountRateLimit } = await import(
  '../backend/dist/middleware/accountRateLimiter.js'
)
const { default: bcrypt } = await import(
  '../backend/node_modules/bcryptjs/index.js'
)
const app = express()
app.use(express.json({ limit: '32kb' }))
app.use('/api', routes)
app.post('/limit-test', accountRateLimit, (_req, res) => res.sendStatus(204))
const server = app.listen(0, '127.0.0.1')
await new Promise((resolve) => server.once('listening', resolve))
const base = `http://127.0.0.1:${server.address().port}`
after(async () => {
  await new Promise((resolve) => server.close(resolve))
  hook.deregister()
  delete globalThis.__securityTestDb
})
const request = (path, token, method = 'GET', body) =>
  fetch(base + path, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

test('anonymous visitors cannot read contact messages, edit them or alter projects', async () => {
  const before = writes
  for (const [path, method] of [
    ['/api/contact/messages', 'GET'],
    ['/api/contact/messages/private/read', 'PATCH'],
    ['/api/portfolio/projects', 'POST'],
    ['/api/portfolio/projects/private', 'PUT'],
    ['/api/portfolio/projects/private', 'DELETE'],
    ['/api/chat/all', 'GET'],
    ['/api/chat/notifications', 'GET'],
    ['/api/security/logs', 'GET'],
    ['/api/analytics/stats', 'GET'],
  ]) {
    assert.equal(
      (await request(path, null, method)).status,
      401,
      `${method} ${path}`
    )
  }
  assert.equal(writes, before)
})

test('ordinary users cannot act as admin or access another user profile or chat', async () => {
  records.set('users/alice@example.com', {
    email: 'alice@example.com',
    role: 'user',
  })
  const token = await createSession('alice@example.com')
  for (const path of [
    '/api/contact/messages',
    '/api/chat/all',
    '/api/security/logs',
    '/api/auth/profile/bob@example.com',
    '/api/chat/user/bob@example.com',
  ]) {
    assert.equal((await request(path, token)).status, 403, path)
  }
  assert.equal(
    (
      await request('/api/portfolio/projects', token, 'POST', {
        role: 'admin',
        email: 'admin@example.com',
      })
    ).status,
    403
  )
  const own = await request('/api/auth/profile/alice@example.com', token)
  assert.equal(own.status, 200)
  assert.equal((await own.json()).data.email, 'alice@example.com')
})

test('admin can read messages; profile response excludes secrets and internal identity fields', async () => {
  records.set('users/admin@example.com', {
    email: 'admin@example.com',
    role: 'admin',
    password: 'secret-hash',
    googleSub: 'private-provider-id',
  })
  records.set('messages/private', { message: 'synthetic contact' })
  const token = await createSession('admin@example.com')
  assert.equal((await request('/api/contact/messages', token)).status, 200)
  const profile = (
    await (await request('/api/auth/profile/admin@example.com', token)).json()
  ).data
  assert.equal(profile.password, undefined)
  assert.equal(profile.googleSub, undefined)
})

test('forged, expired and revoked tokens cannot authenticate', async () => {
  assert.equal(
    (await request('/api/contact/messages', 'admin@example.com')).status,
    401
  )
  const token = await createSession('admin@example.com')
  const hash = createHash('sha256').update(token).digest('hex')
  records.get(`sessions/${hash}`).expiresAt = new Date(Date.now() - 1000)
  assert.equal(await getSessionEmail(token), null)
  assert.equal((await request('/api/contact/messages', token)).status, 401)
  const valid = await createSession('admin@example.com')
  assert.equal((await request('/api/auth/logout', valid, 'POST')).status, 200)
  assert.equal((await request('/api/contact/messages', valid)).status, 401)
})

test('unverified signup cannot create an account or grant admin privileges', async () => {
  const before = writes
  const response = await request('/api/auth/register', null, 'POST', {
    email: 'victim@example.com',
    password: 'strong-password',
    role: 'admin',
  })
  assert.equal(response.status, 403)
  assert.equal(writes, before)
  assert.equal(records.has('users/victim@example.com'), false)
})

test('account limit is shared across differently cased email attempts', async () => {
  for (let i = 0; i < 10; i++)
    assert.equal(
      (
        await request('/limit-test', null, 'POST', {
          email: i % 2 ? 'LIMIT@example.com' : 'limit@example.com',
        })
      ).status,
      204
    )
  assert.equal(
    (await request('/limit-test', null, 'POST', { email: 'limit@example.com' }))
      .status,
    429
  )
})

test('invalid Google token is rejected without creating a user or session', async () => {
  process.env.GOOGLE_CLIENT_ID = 'synthetic-client.apps.googleusercontent.com'
  const before = writes
  assert.equal(
    (
      await request('/api/auth/google', null, 'POST', {
        credential: 'forged-token',
      })
    ).status,
    401
  )
  assert.equal(writes, before)
  delete process.env.GOOGLE_CLIENT_ID
})

test('password login keeps the stored role and rejects historical short admin passwords', async () => {
  records.set('users/short-admin@example.com', {
    email: 'short-admin@example.com',
    role: 'admin',
    password: await bcrypt.hash('123456', 10),
  })
  assert.equal(
    (
      await request('/api/auth/login', null, 'POST', {
        email: 'short-admin@example.com',
        password: '123456',
      })
    ).status,
    401
  )
  records.set('users/password-user@example.com', {
    email: 'password-user@example.com',
    role: 'user',
    password: await bcrypt.hash('test-password-strong', 10),
  })
  const response = await request('/api/auth/login', null, 'POST', {
    email: 'PASSWORD-USER@example.com',
    password: 'test-password-strong',
    role: 'admin',
  })
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.equal(body.data.user.role, 'user')
  assert.equal(
    (await request('/api/contact/messages', body.data.token)).status,
    403
  )
})

test('sessions from old deployments and invalid expiration timestamps are rejected', async () => {
  for (const corrupt of [
    (data) => delete data.version,
    (data) => {
      data.expiresAt = new Date('invalid')
    },
  ]) {
    const token = await createSession('admin@example.com')
    const hash = createHash('sha256').update(token).digest('hex')
    corrupt(records.get(`sessions/${hash}`))
    assert.equal(await getSessionEmail(token), null)
    assert.equal((await request('/api/contact/messages', token)).status, 401)
  }
})

test('private chat routes every visitor to the owner and isolates replies by conversation', async () => {
  process.env.CHAT_OWNER_EMAIL = 'admin@example.com'
  try {
    records.set('users/bernardokrac@gmail.com', {
      email: 'bernardokrac@gmail.com',
      role: 'user',
      googleSub: 'verified-owner',
    })
    records.set('users/bob@example.com', {
      email: 'bob@example.com',
      role: 'user',
    })
    const alice = await createSession('alice@example.com')
    const bob = await createSession('bob@example.com')
    const owner = await createSession(
      'bernardokrac@gmail.com',
      'verified-owner'
    )
    const otherAdmin = await createSession('admin@example.com')
    const passwordOwner = await createSession('bernardokrac@gmail.com')
    const wrongIdentity = await createSession(
      'bernardokrac@gmail.com',
      'different-sub'
    )
    assert.equal((await request('/api/chat/all', passwordOwner)).status, 403)
    assert.equal((await request('/api/chat/all', wrongIdentity)).status, 401)
    records.get('users/bernardokrac@gmail.com').role = 'admin'
    assert.equal((await request('/api/chat/all', passwordOwner)).status, 403)
    records.get('users/bernardokrac@gmail.com').role = 'user'
    const incoming = await request('/api/chat/send', alice, 'POST', {
      message: 'Alice private question',
      recipientEmail: 'bob@example.com',
      isAdmin: true,
      senderEmail: 'bernardokrac@gmail.com',
    })
    assert.equal(incoming.status, 201)
    const message = (await incoming.json()).data
    assert.equal(message.senderEmail, 'alice@example.com')
    assert.equal(message.recipientEmail, 'bernardokrac@gmail.com')
    assert.equal(message.conversationUserEmail, 'alice@example.com')
    assert.equal(message.isAdmin, false)
    assert.equal((await request('/api/chat/all', alice)).status, 403)
    assert.equal((await request('/api/chat/all', otherAdmin)).status, 403)
    assert.equal(
      (await request('/api/chat/user/alice@example.com', bob)).status,
      403
    )
    const answer = await request('/api/chat/send', owner, 'POST', {
      message: 'Answer only for Alice',
      recipientEmail: 'alice@example.com',
    })
    assert.equal(answer.status, 201)
    const aliceMessages = (
      await (await request('/api/chat/user/alice@example.com', alice)).json()
    ).data
    assert.deepEqual(
      aliceMessages.map((message) => message.message),
      ['Alice private question', 'Answer only for Alice']
    )
    const bobMessages = (
      await (await request('/api/chat/user/bob@example.com', bob)).json()
    ).data
    assert.equal(bobMessages.length, 0)
    const inbox = (await (await request('/api/chat/all', owner)).json()).data
      .messagesByUser
    assert.equal(inbox['alice@example.com'].length, 2)
    assert.equal(inbox['bernardokrac@gmail.com'], undefined)
    assert.equal(
      (await request('/api/chat/read/alice@example.com', alice, 'POST')).status,
      400
    )
    assert.equal(
      (await request('/api/chat/read/alice@example.com', owner, 'POST')).status,
      200
    )
    assert.equal(records.get(`chats/${message.id}`).read, true)
    assert.equal(
      (
        await request('/api/chat/send', owner, 'POST', {
          message: 'No broadcast',
        })
      ).status,
      400
    )
    records.set('chats/legacy-question', {
      senderEmail: 'alice@example.com',
      recipientEmail: 'bernardo@kraczkowski.com',
      message: 'Legacy private question',
      isAdmin: false,
    })
    records.set('chats/legacy-answer', {
      senderEmail: 'bernardo@kraczkowski.com',
      replyTo: 'alice@example.com',
      message: 'Legacy private answer',
      isAdmin: true,
    })
    const legacy = (
      await (await request('/api/chat/user/alice@example.com', alice)).json()
    ).data
    assert.ok(
      legacy.some((message) => message.message === 'Legacy private answer')
    )
    assert.equal(
      (await request('/api/chat/user/alice@example.com', otherAdmin)).status,
      403
    )
  } finally {
    delete process.env.CHAT_OWNER_EMAIL
  }
})

test('chat event streams are authenticated, isolated, notify both participants and release listeners', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] })
  assert.equal((await request('/api/chat/events')).status, 401)
  const alice = await createSession('alice@example.com')
  const bob = await createSession('bob@example.com')
  const owner = await createSession('bernardokrac@gmail.com', 'verified-owner')
  const streams = []
  const waitFor = async (predicate) => {
    const deadline = Date.now() + 2000
    while (!predicate()) {
      if (Date.now() >= deadline) throw new Error('Expected SSE notification')
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  }
  try {
    for (const token of [alice, bob, owner]) {
      const controller = new AbortController()
      const response = await fetch(
        base + '/api/chat/events?email=bob@example.com',
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      )
      assert.equal(response.status, 200)
      assert.match(response.headers.get('content-type'), /text\/event-stream/)
      assert.match(response.headers.get('cache-control'), /no-store/)
      const stream = { controller, count: 0, text: '' }
      streams.push(stream)
      stream.pump = (async () => {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        try {
          while (true) {
            const chunk = await reader.read()
            if (chunk.done) break
            stream.text += decoder.decode(chunk.value, { stream: true })
            stream.count = (stream.text.match(/"type":"refresh"/g) || []).length
          }
        } catch (error) {
          if (!controller.signal.aborted) throw error
        } finally {
          await reader.cancel().catch(() => {})
          stream.done = true
        }
      })()
    }
    await waitFor(() => streams.every((s) => s.count === 1))
    const response = await request('/api/chat/send', alice, 'POST', {
      message: 'Private realtime question',
    })
    assert.equal(response.status, 201)
    await waitFor(() => streams[0].count === 2 && streams[2].count === 2)
    await new Promise((resolve) => setTimeout(resolve, 100))
    assert.equal(
      streams[1].count,
      1,
      'Bob receives no Alice event, even with a forged query email'
    )
    assert.equal(
      (
        await request('/api/chat/send', owner, 'POST', {
          message: 'Private realtime answer',
          recipientEmail: 'alice@example.com',
        })
      ).status,
      201
    )
    await waitFor(() => streams[0].count === 3 && streams[2].count === 3)
    assert.equal(streams[1].count, 1)
    for (const stream of streams) {
      assert.doesNotMatch(stream.text, /example\.com|Private realtime|Bearer/)
    }
    await revokeSession(alice)
    context.mock.timers.tick(30_000)
    await waitFor(() => streams[0].done)
    assert.equal(listeners.get('chatActivity/alice@example.com').size, 0)
    assert.equal(streams[1].done, undefined, 'Other sessions remain connected')
  } finally {
    for (const stream of streams) stream.controller.abort()
    await Promise.all(streams.map((s) => s.pump))
    await waitFor(() =>
      [...listeners.values()].every((callbacks) => callbacks.size === 0)
    )
  }
})

test('opening Google repeatedly does not consume authentication attempts', async () => {
  const { authRateLimit, googleChallengeRateLimit } = await import(
    '../backend/dist/middleware/rateLimiter.js'
  )
  authRateLimit.resetKey('127.0.0.1')
  googleChallengeRateLimit.resetKey('127.0.0.1')
  process.env.GOOGLE_CLIENT_ID = 'synthetic-client.apps.googleusercontent.com'
  try {
    for (let i = 0; i < 6; i++)
      assert.equal(
        (await request('/api/auth/google/challenge', null, 'POST')).status,
        200
      )
    assert.equal(
      (
        await request('/api/auth/google', null, 'POST', {
          credential: 'forged',
        })
      ).status,
      401
    )
  } finally {
    delete process.env.GOOGLE_CLIENT_ID
    authRateLimit.resetKey('127.0.0.1')
  }
})

test('retry IDs deduplicate messages, reject changed payloads and remain scoped to the sender', async () => {
  const { messageRateLimit } = await import(
    '../backend/dist/middleware/rateLimiter.js'
  )
  messageRateLimit.resetKey('127.0.0.1')
  records.set('users/retry-a@example.com', {
    email: 'retry-a@example.com',
    role: 'user',
  })
  records.set('users/retry-b@example.com', {
    email: 'retry-b@example.com',
    role: 'user',
  })
  const a = await createSession('retry-a@example.com'),
    b = await createSession('retry-b@example.com')
  const clientMessageId = randomUUID(),
    body = { message: 'Only once', clientMessageId }
  const first = await request('/api/chat/send', a, 'POST', body)
  assert.equal(first.status, 201)
  const saved = (await first.json()).data
  const before = writes
  const retry = await request('/api/chat/send', a, 'POST', body)
  assert.equal(retry.status, 201)
  assert.equal((await retry.json()).data.id, saved.id)
  assert.equal(writes, before)
  assert.equal(
    (
      await request('/api/chat/send', a, 'POST', {
        ...body,
        message: 'Changed',
      })
    ).status,
    409
  )
  assert.equal(writes, before)
  const other = await request('/api/chat/send', b, 'POST', body)
  assert.equal(other.status, 201)
  assert.notEqual((await other.json()).data.id, saved.id)
  assert.equal(
    (
      await request('/api/chat/send', a, 'POST', {
        message: 'bad',
        clientMessageId: '../invalid',
      })
    ).status,
    400
  )
  messageRateLimit.resetKey('127.0.0.1')
})

test('contact input rejects objects and oversized fields before writing', async () => {
  const { messageRateLimit } = await import('../backend/dist/middleware/rateLimiter.js')
  messageRateLimit.resetKey('127.0.0.1')
  const before = writes
  for (const patch of [{ name: {} }, { message: 'a'.repeat(5001) }, { email: 'invalid' }, { subject: [] }]) {
    assert.equal((await request('/api/contact/messages', null, 'POST', {
      name: 'Visitor', email: 'visitor@example.com', message: 'Hello', ...patch,
    })).status, 400)
  }
  assert.equal(writes, before)
  assert.equal((await request('/api/contact/messages', null, 'POST', {
    name: 'Visitor', email: 'visitor@example.com', message: 'Hello',
  })).status, 201)
  messageRateLimit.resetKey('127.0.0.1')
})

test('project writes reject unknown fields and executable URLs even for admin', async () => {
  const token = await createSession('admin@example.com')
  const before = writes
  for (const body of [{ role: 'admin' }, { title: {} }, { liveUrl: 'javascript:alert(1)' }, { technologies: [{}] }, { createdAt: 'forged' }]) {
    assert.equal((await request('/api/portfolio/projects/private', token, 'PUT', body)).status, 400)
  }
  assert.equal(writes, before)
  records.set('projects/private', { title: 'Original' })
  assert.equal((await request('/api/portfolio/projects/private', token, 'PUT', { title: 'Updated', liveUrl: 'https://example.com' })).status, 200)
  assert.equal(records.get('projects/private').title, 'Updated')
})

test('Google challenge expires, is consumed once and account identity changes revoke access', async () => {
  const { authRateLimit } = await import('../backend/dist/middleware/rateLimiter.js')
  process.env.GOOGLE_CLIENT_ID = 'synthetic-client.apps.googleusercontent.com'
  const nonce = 'b'.repeat(64)
  globalThis.__googleTestClaims = {
    sub: 'synthetic-google-sub', email: 'google-test@example.com',
    email_verified: true, nonce,
  }
  try {
    authRateLimit.resetKey('127.0.0.1')
    records.set(`googleChallenges/${nonce}`, { expiresAt: { toMillis: () => Date.now() - 1 } })
    assert.equal((await request('/api/auth/google', null, 'POST', { credential: 'synthetic' })).status, 409)
    assert.equal(records.has('users/google-test@example.com'), false)
    records.set(`googleChallenges/${nonce}`, { expiresAt: { toMillis: () => Date.now() + 60000 } })
    const response = await request('/api/auth/google', null, 'POST', { credential: 'synthetic' })
    assert.equal(response.status, 200)
    const { token } = (await response.json()).data
    assert.equal(records.has(`googleChallenges/${nonce}`), false)
    assert.equal((await request('/api/auth/google', null, 'POST', { credential: 'synthetic' })).status, 409)
    assert.equal((await request('/api/auth/profile/google-test@example.com', token)).status, 200)
    records.get('users/google-test@example.com').googleSub = 'different-sub'
    assert.equal((await request('/api/auth/profile/google-test@example.com', token)).status, 401)
  } finally {
    delete globalThis.__googleTestClaims
    delete process.env.GOOGLE_CLIENT_ID
    authRateLimit.resetKey('127.0.0.1')
  }
})
