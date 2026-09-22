import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .find((source) => source.includes('})(window.location)'))

for (const [path, expected] of [
  ['/portfolio/', '/portfolio'],
  ['/portfolio/?source=test#contact', '/portfolio?source=test#contact'],
  ['/?/portfolio/&source=test#contact', '/portfolio?source=test#contact'],
  ['/?/portfolio/&a=1~and~b=2#contact', '/portfolio?a=1&b=2#contact'],
  ['/portfolio', '/portfolio'],
  ['/', '/'],
]) {
  test(`route entry restores ${path} to ${expected} without a reload`, () => {
    const location = new URL(path, 'https://example.com')
    const window = {
      location,
      history: {
        state: null,
        replaceState(state, _title, target) {
          this.state = state
          location.href = new URL(target, location).href
        },
      },
    }
    assert.ok(script)
    runInNewContext(script, { window })
    assert.equal(location.pathname + location.search + location.hash, expected)
  })
}
