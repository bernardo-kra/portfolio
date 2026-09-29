import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createMissionState,
  missionReducer,
  gateCodes,
  requiredRoutes,
} from '../src/Pages/Experimental3D/missionState.ts'

const apply = (state, ...actions) => actions.reduce(missionReducer, state)
const connected = () =>
  apply(
    createMissionState(),
    { type: 'file', file: 'blacktide' },
    { type: 'connect' }
  )
const control = () =>
  missionReducer(connected(), {
    type: 'signals',
    captured: ['dock', 'boiler', 'tower'],
  })
function powered() {
  let state = missionReducer(control(), { type: 'isolate' })
  for (let index = 0; index < 3; index++) {
    while (state.routes[index] !== requiredRoutes[index])
      state = missionReducer(state, { type: 'route', index })
  }
  return state
}

test('only the mission dossier opens the receiver', () => {
  for (const file of ['manifest', 'personnel', 'maintenance']) {
    const state = missionReducer(createMissionState(), { type: 'file', file })
    assert.equal(missionReducer(state, { type: 'connect' }), state)
  }
  assert.equal(connected().phase, 'signal')
})

test('all three distinct transmissions are required for access control', () => {
  for (const captured of [
    [],
    ['dock'],
    ['dock', 'dock', 'dock'],
    ['dock', 'boiler'],
    ['invalid', 'boiler', 'tower'],
  ]) {
    const state = connected()
    assert.equal(missionReducer(state, { type: 'signals', captured }), state)
  }
  assert.equal(control().phase, 'control')
})

test('surveillance, power routing and correct key each guard the gates', () => {
  let state = control()
  state = missionReducer(state, { type: 'gate', code: '088' })
  assert.equal(state.feedback, 'isolate')
  state = missionReducer(state, { type: 'isolate' })
  state = missionReducer(state, { type: 'gate', code: '088' })
  assert.equal(state.feedback, 'route')
  state = missionReducer(powered(), { type: 'gate', code: '104' })
  assert.equal(state.feedback, 'code')
  assert.equal(state.gates, 0)
})

test('gates open in order, lock the matrix and allow extraction only at the end', () => {
  let state = powered()
  for (const [index, code] of gateCodes.entries()) {
    assert.equal(missionReducer(state, { type: 'extract' }), state)
    const previous = state
    state = missionReducer(state, { type: 'gate', code })
    assert.equal(previous.gates, index)
    assert.equal(state.gates, index + 1)
    assert.equal(missionReducer(state, { type: 'route', index: 0 }), state)
    assert.equal(
      missionReducer(state, { type: 'gate', code }).gates,
      state.gates
    )
  }
  state = missionReducer(state, { type: 'extract' })
  assert.equal(state.phase, 'complete')
  assert.equal(missionReducer(state, { type: 'gate', code: '116' }), state)
})

test('out-of-phase actions and invalid relay indexes leave state unchanged', () => {
  const state = createMissionState()
  for (const action of [
    { type: 'isolate' },
    { type: 'gate', code: '088' },
    { type: 'extract' },
    { type: 'signals', captured: ['dock', 'boiler', 'tower'] },
  ])
    assert.equal(missionReducer(state, action), state)
  for (const index of [-1, 3, 1.5, NaN]) {
    const state = control()
    assert.equal(missionReducer(state, { type: 'route', index }), state)
  }
})

test('reset clears every stage and supports two full consecutive missions', () => {
  let state = createMissionState()
  for (let attempt = 1; attempt <= 2; attempt++) {
    assert.deepEqual(state, createMissionState(attempt))
    state = apply(
      state,
      { type: 'file', file: 'blacktide' },
      { type: 'connect' },
      { type: 'signals', captured: ['dock', 'boiler', 'tower'] },
      { type: 'isolate' }
    )
    for (let index = 0; index < 3; index++)
      while (state.routes[index] !== requiredRoutes[index])
        state = missionReducer(state, { type: 'route', index })
    state = apply(state, ...gateCodes.map((code) => ({ type: 'gate', code })), {
      type: 'extract',
    })
    assert.equal(state.phase, 'complete')
    state = missionReducer(state, { type: 'reset' })
  }
  assert.deepEqual(state, createMissionState(3))
  assert.deepEqual(
    missionReducer(control(), { type: 'reset' }),
    createMissionState(2)
  )
})
