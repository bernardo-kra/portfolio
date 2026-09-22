import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCommand } from '../src/Pages/Experimental3D/commands.ts'
import {
  consoleReducer,
  createConsoleState,
  sectors,
  signalQuality,
} from '../src/Pages/Experimental3D/consoleState.ts'

test('starts with a clear mission and no recovered files', () => {
  const state = createConsoleState()
  assert.equal(state.selected, 'dock')
  assert.deepEqual(state.scanned, [])
  assert.deepEqual(state.captured, [])
})

test('scanning reveals a sector once without changing the original state', () => {
  const original = createConsoleState()
  const scanned = consoleReducer(original, { type: 'scan' })
  assert.deepEqual(original.scanned, [])
  assert.deepEqual(scanned.scanned, ['dock'])
  assert.equal(consoleReducer(scanned, { type: 'scan' }), scanned)
})

test('capture and assisted tuning require a scan', () => {
  const state = consoleReducer(createConsoleState(), {
    type: 'tune',
    frequency: 88,
  })
  assert.equal(consoleReducer(state, { type: 'capture' }), state)
  assert.equal(consoleReducer(state, { type: 'assist' }), state)
})

test('capture requires readable signal and never duplicates a file', () => {
  let state = consoleReducer(createConsoleState(), { type: 'scan' })
  assert.equal(consoleReducer(state, { type: 'capture' }), state)
  state = consoleReducer(state, { type: 'tune', frequency: 91 })
  assert.equal(consoleReducer(state, { type: 'capture' }), state)
  state = consoleReducer(state, { type: 'tune', frequency: 90 })
  state = consoleReducer(state, { type: 'capture' })
  assert.deepEqual(state.captured, ['dock'])
  assert.equal(consoleReducer(state, { type: 'capture' }), state)
})

test('assisted tuning completes all sectors and keeps the log bounded', () => {
  let state = createConsoleState()
  for (const sector of sectors) {
    state = consoleReducer(state, { type: 'select', sector: sector.id })
    state = consoleReducer(state, { type: 'scan' })
    state = consoleReducer(state, { type: 'assist' })
    assert.equal(state.frequency, sector.frequency)
    state = consoleReducer(state, { type: 'capture' })
  }
  assert.deepEqual(state.captured, ['dock', 'boiler', 'tower'])
  assert.equal(state.events.length, 4)
  state = consoleReducer(state, { type: 'select', sector: 'dock' })
  assert.deepEqual(state.captured, ['dock', 'boiler', 'tower'])
  assert.deepEqual(
    consoleReducer(state, { type: 'reset' }),
    createConsoleState()
  )
})

test('tuning is clamped, rounded and ignores invalid values', () => {
  const state = createConsoleState()
  assert.equal(consoleReducer(state, { type: 'tune', frequency: NaN }), state)
  assert.equal(
    consoleReducer(state, { type: 'tune', frequency: Infinity }),
    state
  )
  assert.equal(
    consoleReducer(state, { type: 'tune', frequency: 200 }).frequency,
    120
  )
  assert.equal(
    consoleReducer(state, { type: 'tune', frequency: 0 }).frequency,
    80
  )
  assert.equal(
    consoleReducer(state, { type: 'tune', frequency: 88.6 }).frequency,
    89
  )
  assert.equal(signalQuality(88, 88), 100)
  assert.equal(signalQuality(90, 88), 84)
  assert.equal(signalQuality(120, 88), 0)
})

test('scan sequence commits only after its three stages', () => {
  let state = consoleReducer(createConsoleState(), {
    type: 'begin',
    kind: 'scan',
    id: 1,
  })
  assert.deepEqual(state.scanned, [])
  for (let stage = 0; stage < 3; stage++) {
    assert.equal(state.operation.stage, stage)
    state = consoleReducer(state, { type: 'advance', id: 1, stage })
  }
  assert.deepEqual(state.scanned, ['dock'])
  assert.equal(state.operation, null)
})

test('wrong or repeated sequence callbacks cannot advance the operation', () => {
  const initial = consoleReducer(createConsoleState(), {
    type: 'begin',
    kind: 'scan',
    id: 7,
  })
  assert.equal(
    consoleReducer(initial, { type: 'advance', id: 6, stage: 0 }),
    initial
  )
  const advanced = consoleReducer(initial, { type: 'advance', id: 7, stage: 0 })
  assert.equal(
    consoleReducer(advanced, { type: 'advance', id: 7, stage: 0 }),
    advanced
  )
  assert.equal(
    consoleReducer(advanced, { type: 'begin', kind: 'scan', id: 8 }),
    advanced
  )
})

test('switching target, cancelling and resetting invalidate the active sequence', () => {
  const running = consoleReducer(createConsoleState(), {
    type: 'begin',
    kind: 'scan',
    id: 4,
  })
  for (const action of [
    { type: 'cancel' },
    { type: 'reset' },
    { type: 'select', sector: 'tower' },
  ]) {
    const stopped = consoleReducer(running, action)
    assert.equal(stopped.operation, null)
    assert.deepEqual(stopped.scanned, [])
    assert.equal(
      consoleReducer(stopped, { type: 'advance', id: 4, stage: 0 }),
      stopped
    )
  }
})

test('capture sequence validates tuning and can be completed without animation', () => {
  const initial = createConsoleState()
  assert.equal(
    consoleReducer(initial, { type: 'begin', kind: 'capture', id: 1 }),
    initial
  )
  let state = consoleReducer(initial, { type: 'scan' })
  assert.equal(
    consoleReducer(state, { type: 'begin', kind: 'capture', id: 2 }),
    state
  )
  state = consoleReducer(state, { type: 'assist' })
  state = consoleReducer(state, { type: 'begin', kind: 'capture', id: 3 })
  assert.deepEqual(state.captured, [])
  assert.equal(consoleReducer(state, { type: 'tune', frequency: 120 }), state)
  assert.equal(consoleReducer(state, { type: 'finish', id: 2 }), state)
  state = consoleReducer(state, { type: 'finish', id: 3 })
  assert.deepEqual(state.captured, ['dock'])
  assert.equal(state.operation, null)
})

test('terminal accepts only supported commands and valid arguments', () => {
  assert.deepEqual(parseCommand(' SCAN '), { type: 'scan' })
  assert.deepEqual(parseCommand('tune 88'), { type: 'tune', frequency: 88 })
  assert.deepEqual(parseCommand('target B02'), {
    type: 'target',
    sector: 'boiler',
  })
  for (const command of [
    '',
    'tune 79',
    'tune 121',
    'tune NaN',
    'tune 88 extra',
    'target toString',
    'target constructor',
    'target __proto__',
    'target nowhere',
    'scan && reset',
    'help extra',
  ]) {
    assert.equal(parseCommand(command), null)
  }
})
