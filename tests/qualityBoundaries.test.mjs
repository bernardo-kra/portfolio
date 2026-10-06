import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ESLint } from 'eslint'
import { fileURLToPath } from 'node:url'

const cwd = fileURLToPath(new URL('../', import.meta.url))
const eslint = new ESLint({ cwd })
const messages = async (code, filePath) =>
  (await eslint.lintText(code, { filePath }))[0].messages

test('entrypoints cannot bypass database boundaries with relative extensions or namespace imports', async () => {
  for (const filePath of ['src/main.tsx', 'api/chat.js']) {
    for (const extension of ['', '.ts', '.js']) {
      for (const binding of ['{ db as database }', '* as database']) {
        const diagnostics = await messages(
          `import ${binding} from '../backend/src/config/firebase${extension}'; void database;`,
          filePath
        )
        assert.ok(
          diagnostics.some((message) => message.ruleId?.endsWith('/no-restricted-paths')),
          `${filePath}: ${binding}, ${extension || 'extensionless'}`
        )
      }
    }
  }
})

test('repository infrastructure may import the database client', async () => {
  const diagnostics = await messages(
    "import { db } from '../config/firebase.js'; void db;",
    'backend/src/repositories/boundaryProbe.ts'
  )
  assert.deepEqual(diagnostics, [])
})

test('Vite public assets resolve only when the asset exists', async () => {
  for (const [asset, expected] of [
    ['/bernardo-kra.jpg', false],
    ['/quality-boundary-missing-image.jpg', true],
  ]) {
    const diagnostics = await messages(
      `import photo from '${asset}'; void photo;`,
      'src/components/portfolio/HeroSection/index.tsx'
    )
    assert.equal(
      diagnostics.some((message) => message.ruleId === 'import-x/no-unresolved'),
      expected,
      asset
    )
  }
})
