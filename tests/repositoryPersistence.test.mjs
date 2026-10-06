import { test, beforeEach, after } from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { createHash } from 'node:crypto'

const records = new Map()
const operations = []
let generated = 0
function snapshot(key) {
  return {
    exists: records.has(key),
    data() {
      const data = records.get(key)
      if (
        data?.expiresAt instanceof Date &&
        key.startsWith('googleChallenges/')
      )
        return {
          ...data,
          expiresAt: { toMillis: () => data.expiresAt.getTime() },
        }
      return data
    },
  }
}
function writes(kind) {
  const queued = []
  return {
    get: (ref) => ref.get(),
    set: (ref, data) => queued.push(() => ref.set(data)),
    create: (ref, data) => queued.push(() => ref.set(data)),
    delete: (ref) => queued.push(() => ref.delete()),
    update: (ref, data) => queued.push(() => ref.update(data)),
    async commit() {
      operations.push([kind, queued.length])
      for (const operation of queued) await operation()
    },
  }
}
globalThis.__repositoryPersistenceDb = {
  collection(name) {
    const filters = []
    let limit = Infinity,
      offset = 0
    return {
      doc(id = `generated-${++generated}`) {
        const key = `${name}/${id}`
        return {
          id,
          async get() {
            operations.push(['get', key])
            return snapshot(key)
          },
          async set(data) {
            operations.push(['set', key])
            records.set(key, data)
          },
          async update(data) {
            operations.push(['update', key])
            records.set(key, { ...records.get(key), ...data })
          },
          async delete() {
            operations.push(['delete', key])
            records.delete(key)
          },
        }
      },
      where(field, operator, value) {
        filters.push([field, operator, value])
        return this
      },
      orderBy(field, direction) {
        operations.push(['order', name, field, direction])
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
      async get() {
        operations.push(['query', name, [...filters], limit, offset])
        return {
          docs: [...records]
            .filter(
              ([key, data]) =>
                key.startsWith(`${name}/`) &&
                filters.every(([field, operator, value]) => {
                  if (operator === '>=') return data[field] >= value
                  if (operator === '<=') return data[field] <= value
                  return data[field] === value
                })
            )
            .slice(offset, offset + limit)
            .map(([key, data]) => ({
              id: key.split('/')[1],
              data: () => data,
            })),
        }
      },
      async add(data) {
        const id = `generated-${++generated}`
        records.set(`${name}/${id}`, data)
        return { id }
      },
    }
  },
  batch: () => writes('batch'),
  async runTransaction(callback) {
    const transaction = writes('transaction')
    const result = await callback(transaction)
    await transaction.commit()
    return result
  },
}
const hook = registerHooks({
  load(url, context, next) {
    if (url.endsWith('/backend/dist/config/firebase.js'))
      return {
        format: 'module',
        shortCircuit: true,
        source: 'export const db = globalThis.__repositoryPersistenceDb;',
      }
    return next(url, context)
  },
})
const chat = await import('../backend/dist/repositories/chatRepository.js')
const google = await import(
  '../backend/dist/repositories/googleAccountRepository.js'
)
const projects = await import(
  '../backend/dist/repositories/projectRepository.js'
)
const contact = await import(
  '../backend/dist/repositories/contactRepository.js'
)
const analytics = await import(
  '../backend/dist/repositories/analyticsRepository.js'
)
beforeEach(() => {
  records.clear()
  operations.length = 0
})
after(() => {
  hook.deregister()
  delete globalThis.__repositoryPersistenceDb
})

const email = 'repository-visitor@example.com'
const owner = 'bernardokrac@gmail.com'
const user = {
  email,
  firstName: 'Visitor',
  lastName: '',
  role: 'admin',
  isChatOwner: false,
}

test('legacy conversation queries deduplicate, isolate and order without composite indexes', async () => {
  records.set('chats/new', {
    conversationUserEmail: email,
    senderEmail: email,
    timestamp: new Date(300),
    id: 'stale',
  })
  records.set('chats/old', {
    senderEmail: email,
    isAdmin: false,
    timestamp: { toMillis: () => 100 },
  })
  records.set('chats/reply', {
    replyTo: email,
    isAdmin: true,
    timestamp: new Date(200),
  })
  records.set('chats/other', {
    conversationUserEmail: 'other@example.com',
    senderEmail: email,
  })
  const result = await chat.readConversation(email)
  assert.deepEqual(
    result.map((message) => message.id),
    ['old', 'reply', 'new']
  )
  assert.deepEqual(
    operations.filter(([kind]) => kind === 'query').map((entry) => entry[2]),
    ['conversationUserEmail', 'senderEmail', 'recipientEmail', 'replyTo'].map(
      (field) => [[field, '==', email]]
    )
  )
  assert.equal(
    operations.some(([kind]) => kind === 'order'),
    false
  )
})

test('retry transaction preserves hash, old timestamps and atomic participant invalidations', async () => {
  const clientId = '0272eb20-dda0-4b50-a83e-4cbf924b16ad'
  const id = createHash('sha256').update(`${email}\0${clientId}`).digest('hex')
  const result = await chat.sendMessage(
    user,
    '  Hello  ',
    'ignored@example.com',
    clientId
  )
  assert.equal(result.id, id)
  assert.equal(result.message, 'Hello')
  assert.equal(result.isAdmin, false)
  assert.equal(result.recipientEmail, owner)
  assert.equal(result.conversationUserEmail, email)
  assert.deepEqual(
    operations.filter(([kind]) => kind === 'transaction'),
    [['transaction', 3]]
  )
  assert.deepEqual(records.get(`chatActivity/${owner}`), { messageId: id })
  assert.deepEqual(records.get(`chatActivity/${email}`), { messageId: id })
  operations.length = 0
  const retry = await chat.sendMessage(user, 'Hello', email, clientId)
  assert.equal(retry.timestamp, result.timestamp)
  assert.deepEqual(
    operations.filter(([kind]) => kind === 'transaction'),
    [['transaction', 0]]
  )
  await assert.rejects(
    chat.sendMessage(user, 'Changed', email, clientId),
    /MESSAGE_ID_CONFLICT/
  )
  assert.equal(records.get(`chats/${id}`).message, 'Hello')
})

test('non-idempotent sends use a batch and receipts commit chunks of 400', async () => {
  const result = await chat.sendMessage(
    { ...user, email: owner, isChatOwner: true },
    'Reply',
    email
  )
  assert.equal(result.recipientEmail, email)
  assert.equal(result.conversationUserEmail, email)
  assert.deepEqual(
    operations.filter(([kind]) => kind === 'batch'),
    [['batch', 3]]
  )
  const messages = Array.from({ length: 801 }, (_, index) => ({
    id: `m${index}`,
  }))
  operations.length = 0
  await chat.markConversationRead(messages)
  assert.deepEqual(
    operations.filter(([kind]) => kind === 'batch'),
    [
      ['batch', 400],
      ['batch', 400],
      ['batch', 1],
    ]
  )
  assert.equal(records.get('chats/m800').read, true)
  assert.ok(records.get('chats/m800').readAt instanceof Date)
})

test('projects keep stored id precedence and read after update; other lists preserve their spread order', async () => {
  records.set('projects/actual', { id: 'stored', title: 'Before' })
  records.set('messages/actual', {
    id: 'stored-contact',
    createdAt: new Date(),
  })
  records.set('analytics/actual', {
    id: 'stored-analytics',
    page: '/',
    timestamp: new Date(),
  })
  assert.equal((await projects.listProjects())[0].id, 'stored')
  assert.equal((await contact.listContactMessages())[0].id, 'stored-contact')
  assert.equal((await analytics.listAnalytics())[0].id, 'stored-analytics')
  operations.length = 0
  const updated = await projects.updateProject('actual', { title: 'After' })
  assert.equal(updated.data().title, 'After')
  assert.deepEqual(operations, [
    ['update', 'projects/actual'],
    ['get', 'projects/actual'],
  ])
  await analytics.listAnalytics('2026-01-01', '2026-12-31')
  const filters = operations.at(-1)[2]
  assert.deepEqual(
    filters.map(([field, operator]) => [field, operator]),
    [
      ['timestamp', '>='],
      ['timestamp', '<='],
    ]
  )
  assert.ok(filters.every(([, , value]) => value instanceof Date))
})

test('Google nonce is consumed even for incompatible accounts and never consumed after expiry', async () => {
  const identity = {
    email,
    firstName: 'Google',
    lastName: 'Visitor',
    sub: 'subject',
    nonce: 'nonce',
  }
  const before = Date.now()
  await google.storeGoogleChallenge(identity.nonce)
  const expiry = records.get('googleChallenges/nonce').expiresAt.getTime()
  assert.ok(expiry >= before + 300000 && expiry <= Date.now() + 300000)
  records.set(`users/${email}`, { email, password: 'old-hash' })
  assert.deepEqual(await google.consumeGoogleChallenge(identity), {
    error: 'GOOGLE_EXISTING_ACCOUNT',
  })
  assert.equal(records.has('googleChallenges/nonce'), false)
  assert.equal(records.get(`users/${email}`).googleSub, undefined)
  records.set('googleChallenges/nonce', { expiresAt: new Date(0) })
  assert.deepEqual(await google.consumeGoogleChallenge(identity), {
    error: 'GOOGLE_EXPIRED',
  })
  assert.equal(records.has('googleChallenges/nonce'), true)
})

test('Google creates only a regular account and preserves existing fields for the matching subject', async () => {
  const identity = {
    email,
    firstName: 'Google',
    lastName: 'Visitor',
    sub: 'subject',
    nonce: 'nonce',
  }
  await google.storeGoogleChallenge(identity.nonce)
  assert.deepEqual((await google.consumeGoogleChallenge(identity)).user, {
    email,
    firstName: 'Google',
    lastName: 'Visitor',
    role: 'user',
    isChatOwner: false,
  })
  const account = records.get(`users/${email}`)
  assert.equal(account.googleSub, 'subject')
  assert.ok(
    account.createdAt instanceof Date && account.updatedAt instanceof Date
  )
  account.firstName = 'Stored'
  account.role = 'admin'
  await google.storeGoogleChallenge(identity.nonce)
  const existing = (await google.consumeGoogleChallenge(identity)).user
  assert.equal(existing.firstName, 'Stored')
  assert.equal(existing.role, 'admin')
  assert.equal(existing.isChatOwner, false)
})
