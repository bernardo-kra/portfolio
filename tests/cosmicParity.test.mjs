import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { InfiniteGenerator } from './cosmic/loadSimulation.mjs'
import { runScenario } from './cosmic/canvasTrace.mjs'
import { scenarios } from './cosmic/scenarios.mjs'

// Recorded from the original pre-refactor engine, with seeded RNG and Canvas command/state hashes.
const golden = JSON.parse(
  fs.readFileSync(new URL('./cosmic/golden.json', import.meta.url), 'utf8')
)

for (const scenario of scenarios) {
  test('cosmic engine preserves ' + scenario.name, () => {
    assert.deepEqual(
      runScenario(InfiniteGenerator, scenario),
      golden[scenario.name]
    )
  })
}

test('cosmic engine preserves the original public prototype and arities', () => {
  assert.deepEqual(
    Object.getOwnPropertyNames(InfiniteGenerator.prototype).sort(),
    ['constructor', 'render', 'updateSettings']
  )
  assert.equal(InfiniteGenerator.length, 3)
  assert.equal(InfiniteGenerator.prototype.updateSettings.length, 1)
  assert.equal(InfiniteGenerator.prototype.render.length, 1)
})
