import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { createHash } from 'node:crypto'

// Exercise real HTTP handlers with synthetic records, never production data.
const records = new Map()
let writes = 0
const snapshot = (key) => ({
  exists: records.has(key),
  data: () => records.get(key),
})
globalThis.__securityTestDb = {
  collection(name) {
    return {
      doc(id) {
        const key = `${name}/${id}`
        return {
          get: async () => snapshot(key),
          set: async (data) => {
            writes++
            records.set(key, data)
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
      get: async () => ({
        docs: [...records]
          .filter(([key]) => key.startsWith(`${name}/`))
          .map(([key, data]) => ({ id: key.split('/')[1], data: () => data })),
      }),
      add: async (data) => {
        writes++
        records.set(`${name}/new`, data)
        return { id: 'new' }
      },
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
const { createSession, getSessionEmail } = await import(
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
