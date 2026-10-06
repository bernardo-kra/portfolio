import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'

const records = new Map()
globalThis.__notificationsDb = {
  collection(name) {
    const filters = []
    return {
      doc(id) {
        const key = `${name}/${id}`
        return {
          id,
          get: async () => ({
            exists: records.has(key),
            data: () => records.get(key),
          }),
          set: async (data) => records.set(key, data),
          update: async (data) =>
            records.set(key, { ...records.get(key), ...data }),
        }
      },
      where(field, _operator, value) {
        filters.push([field, value])
        return this
      },
      get: async () => ({
        docs: [...records]
          .filter(
            ([key, data]) =>
              key.startsWith(`${name}/`) &&
              filters.every(([field, value]) => data[field] === value)
          )
          .map(([key, data]) => ({ id: key.split('/')[1], data: () => data })),
      }),
    }
  },
  batch() {
    const jobs = []
    return {
      update: (ref, data) => jobs.push(() => ref.update(data)),
      commit: async () => Promise.all(jobs.map((job) => job())),
    }
  },
}
const hook = registerHooks({
  load(url, context, next) {
    if (url.endsWith('/backend/dist/config/firebase.js'))
      return {
        format: 'module',
        shortCircuit: true,
        source: 'export const db = globalThis.__notificationsDb;',
      }
    return next(url, context)
  },
})
const { default: express } = await import(
  '../backend/node_modules/express/index.js'
)
const { default: chat } = await import('../backend/dist/routes/chat.js')
const { createSession } = await import(
  '../backend/dist/services/sessionService.js'
)
const app = express()
app.use(express.json())
app.use('/api/chat', chat)
const server = app.listen(0, '127.0.0.1')
await new Promise((resolve) => server.once('listening', resolve))
after(async () => {
  await new Promise((resolve) => server.close(resolve))
  hook.deregister()
  delete globalThis.__notificationsDb
})
const request = (path, token, body) =>
  fetch(`http://127.0.0.1:${server.address().port}/api/chat${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

test('unread notifications and explicit receipts are isolated by recipient, not by client-selected IDs or role', async () => {
  const aliceEmail = 'notification-alice@example.com',
    bobEmail = 'notification-bob@example.com',
    ownerEmail = 'bernardokrac@gmail.com'
  records.set(`users/${aliceEmail}`, { email: aliceEmail, role: 'user' })
  records.set(`users/${bobEmail}`, { email: bobEmail, role: 'user' })
  records.set(`users/${ownerEmail}`, {
    email: ownerEmail,
    role: 'user',
    googleSub: 'real-owner-subject',
  })
  const alice = await createSession(aliceEmail),
    bob = await createSession(bobEmail),
    owner = await createSession(ownerEmail, 'real-owner-subject')
  for (const [id, email, admin, read] of [
    ['a-question', aliceEmail, false, false],
    ['a-reply', aliceEmail, true, false],
    ['a-next', aliceEmail, true, false],
    ['a-read', aliceEmail, true, true],
    ['b-reply', bobEmail, true, false],
  ]) {
    records.set(`chats/${id}`, {
      message: id,
      senderEmail: admin ? ownerEmail : email,
      senderName: admin ? 'Bernardo' : 'Visitor',
      recipientEmail: admin ? email : ownerEmail,
      conversationUserEmail: email,
      isAdmin: admin,
      read,
      timestamp: new Date(),
    })
  }
  assert.equal((await request('/notifications')).status, 401)
  const aNotifications = (await (await request('/notifications', alice)).json())
    .data
  assert.deepEqual(
    new Set(aNotifications.map((message) => message.id)),
    new Set(['a-reply', 'a-next'])
  )
  assert.ok(
    aNotifications.every(
      (message) => message.conversationUserEmail === aliceEmail
    )
  )
  assert.deepEqual(
    (await (await request('/notifications', bob)).json()).data.map(
      (message) => message.id
    ),
    ['b-reply']
  )
  assert.deepEqual(
    (await (await request('/notifications', owner)).json()).data.map(
      (message) => message.id
    ),
    ['a-question']
  )
  assert.equal(
    (await request(`/read/${bobEmail}`, alice, { messageIds: ['b-reply'] }))
      .status,
    403
  )
  assert.equal(
    (await request(`/read/${aliceEmail}`, null, { messageIds: ['a-reply'] }))
      .status,
    401
  )
  assert.equal(
    (await request(`/read/${aliceEmail}`, alice, { messageIds: ['bad/id'] }))
      .status,
    400
  )
  assert.equal(
    (
      await request(`/read/${aliceEmail}`, alice, {
        messageIds: Array(101).fill('a-reply'),
      })
    ).status,
    400
  )
  assert.equal(
    (
      await request(`/read/${aliceEmail}`, alice, {
        messageIds: ['a-reply', 'a-question', 'b-reply'],
      })
    ).status,
    200
  )
  assert.equal(records.get('chats/a-reply').read, true)
  assert.equal(
    records.get('chats/a-next').read,
    false,
    'An unseen reply arriving meanwhile remains unread'
  )
  assert.equal(
    records.get('chats/a-question').read,
    false,
    'Visitor cannot acknowledge messages destined to owner'
  )
  assert.equal(
    records.get('chats/b-reply').read,
    false,
    'Visitor cannot acknowledge another conversation'
  )
  assert.deepEqual(
    (await (await request('/notifications', alice)).json()).data.map(
      (message) => message.id
    ),
    ['a-next']
  )
  assert.equal(
    (
      await request(`/read/${aliceEmail}`, owner, {
        messageIds: ['a-question', 'a-next'],
      })
    ).status,
    200
  )
  assert.equal(records.get('chats/a-question').read, true)
  assert.equal(
    records.get('chats/a-next').read,
    false,
    'Owner cannot mark their own outgoing reply as read'
  )
  assert.equal(
    (await request(`/read/${aliceEmail}`, alice, { messageIds: ['a-next'] }))
      .status,
    200
  )
  assert.deepEqual(
    (await (await request('/notifications', alice)).json()).data,
    [],
    'Read state survives fresh fetches'
  )
})
