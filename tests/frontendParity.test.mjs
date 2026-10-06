import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { drawDayScene } from '../src/components/theme/DayBackground/dayScene.ts'
import { drawNebula } from '../src/components/theme/StarfieldBackground/nebulaScene.ts'
import {
  drawPlanet,
  drawMoon,
  drawStar,
} from '../src/components/theme/StarfieldBackground/celestialScene.ts'
import { drawComet } from '../src/components/theme/StarfieldBackground/cometScene.ts'
import { pomodoroReducer } from '../src/context/pomodoro/reducer.ts'
import { initialState } from '../src/context/pomodoro/state.ts'

// Golden traces captured from unmodified source at 0fee8e2 before extraction.
// Each trace includes canvas command order and the resulting mutable scene state.
const expected = {
  day: '676a175772436613e3ce6cd7aebc78836bf37bc8a30cc4d2a15030de492739e2',
  night: '402730bf8d7698ad305adfb837785f300c893324ff6c64b8a7ab722986105e45',
  noParallax:
    '44b81cfdab2d0d6d90e8089b5b4b0ffa940f13ad120468024f2a11683040b04e',
  pomodoro: 'db4f38d80fd69a0c23b98e1ed41764b682e11dadba9810c675860331447cd577',
}

function hash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

function canvasTrace() {
  const commands = [],
    values = new Map()
  let gradientId = 0
  const ctx = new Proxy(
    {},
    {
      set(_, name, value) {
        values.set(name, value)
        commands.push(['set', name, value?.gradient || value])
        return true
      },
      get(_, name) {
        if (values.has(name)) return values.get(name)
        return (...args) => {
          commands.push([name, ...args])
          if (!String(name).startsWith('create')) return undefined
          const gradient = 'gradient-' + gradientId++
          return {
            gradient,
            addColorStop: (...stops) => commands.push([gradient, ...stops]),
          }
        }
      },
    }
  )
  return { ctx, commands }
}

function dayScenario(draw) {
  const { ctx, commands } = canvasTrace()
  const clouds = [
    { x: 120, y: 80, speed: 0.2, size: 90, opacity: 0.8 },
    { x: 1700, y: 400, speed: 3, size: 70, opacity: 0.6 },
    { x: -400, y: 35, speed: 0.05, size: 130, opacity: 0.7 },
    { x: 550, y: 1300, speed: 0.1, size: 60, opacity: 0.9 },
  ]
  for (let frame = 0; frame < 8; frame++) draw(ctx, 1440, 900, clouds)
  return hash({ commands, clouds })
}

function nightScenario(draw, disableParallax) {
  const { ctx, commands } = canvasTrace()
  const scene = {
    ctx,
    width: 1440,
    height: 900,
    mouse: { x: 0.92, y: 0.08 },
    disableParallax,
    nebulae: [
      {
        x: 10,
        y: 15,
        width: 240,
        height: 180,
        color: '#16213e',
        opacity: 0.1,
        speed: 0.03,
      },
      {
        x: 2000,
        y: 350,
        width: 350,
        height: 200,
        color: '#abc',
        opacity: 0.06,
        speed: 0.01,
      },
    ],
    planets: [
      { x: 200, y: 400, radius: 4, color: '#4a5568', speed: 0.02, phase: 0 },
      { x: 1450, y: -50, radius: 5, color: '#2d3748', speed: 0.04, phase: 2 },
    ],
    comets: [
      {
        x: 100,
        y: 180,
        vx: -1,
        vy: 0.3,
        life: 0.8,
        tail: [
          { x: 101, y: 180 },
          { x: 102, y: 181 },
        ],
      },
      {
        x: 1700,
        y: -150,
        vx: -2,
        vy: -1,
        life: 0.001,
        tail: [{ x: 800, y: 400 }],
      },
      { x: -75, y: 200, vx: 0.1, vy: 0, life: 0.7, tail: [] },
    ],
    stars: [
      { x: 10, y: 5, r: 0.7, speed: 0.04, color: '#fff', depth: 0.2 },
      { x: 1450, y: 200, r: 1, speed: 0.2, color: '#bfcfff', depth: 0.9 },
    ],
  }
  for (let frame = 0; frame < 30; frame++) draw(scene)
  const { ctx: ignored, ...state } = scene
  void ignored
  return hash({ commands, state })
}

function drawNight(scene) {
  const { ctx, width, height } = scene
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.clearRect(0, 0, width, height)
  for (const nebula of scene.nebulae) drawNebula(scene, nebula)
  for (const planet of scene.planets) drawPlanet(scene, planet)
  for (const comet of scene.comets) drawComet(scene, comet)
  drawMoon(scene)
  for (const star of scene.stars) drawStar(scene, star)
}

function withDeterministicEnvironment(run) {
  const originalRandom = Math.random,
    OriginalDate = Date
  const originalStyle = globalThis.getComputedStyle,
    originalDocument = globalThis.document
  let seed = 42
  Math.random = () => (seed = (1664525 * seed + 1013904223) >>> 0) / 2 ** 32
  globalThis.Date = class extends OriginalDate {
    constructor(...args) {
      super(...(args.length ? args : [1791297600000]))
    }
    static now() {
      return 1791297600000
    }
  }
  globalThis.document = { documentElement: {} }
  globalThis.getComputedStyle = () => ({ getPropertyValue: () => '' })
  try {
    return run()
  } finally {
    Math.random = originalRandom
    globalThis.Date = OriginalDate
    globalThis.getComputedStyle = originalStyle
    globalThis.document = originalDocument
  }
}

function timerScenario(reduce, fallback) {
  const snapshots = []
  let state = structuredClone(fallback)
  const dispatch = (action) => {
    state = reduce(state, action)
    snapshots.push(state)
  }
  for (const action of [
    { type: 'START' },
    { type: 'TICK' },
    { type: 'PAUSE' },
    { type: 'SET_FOCUS_DURATION', payload: 3 },
    { type: 'SET_BREAK_DURATION', payload: 2 },
    {
      type: 'SET_ACTIVE_TASK',
      payload: { taskId: 'work', taskName: 'A task' },
    },
    { type: 'RESET' },
    { type: 'TICK' },
    { type: 'TICK' },
    { type: 'TICK' },
    { type: 'TICK' },
    { type: 'SWITCH' },
    { type: 'TICK' },
    { type: 'TICK' },
    { type: 'SWITCH' },
    { type: 'SET_ACTIVE_TASK', payload: null },
  ])
    dispatch(action)
  dispatch({
    type: 'ADD_MUSIC_TRACK',
    payload: { id: 'one', name: 'One', url: 'one' },
  })
  dispatch({
    type: 'ADD_MUSIC_TRACK',
    payload: { id: 'two', name: 'Two', url: 'two' },
  })
  for (const shuffleMode of [false, true])
    for (const repeatMode of ['none', 'one', 'all']) {
      dispatch({
        type: 'SET_MUSIC_SETTINGS',
        payload: { shuffleMode, repeatMode },
      })
      for (const type of [
        'NEXT_TRACK',
        'NEXT_TRACK',
        'PREVIOUS_TRACK',
        'PREVIOUS_TRACK',
      ])
        dispatch({ type })
    }
  for (const id of ['default', 'one', 'two', 'missing'])
    dispatch({ type: 'REMOVE_MUSIC_TRACK', payload: id })
  dispatch({ type: 'NEXT_TRACK' })
  dispatch({ type: 'PREVIOUS_TRACK' })
  dispatch({ type: 'SET_CURRENT_TRACK', payload: 'missing' })
  dispatch({ type: 'LOAD_STATE', payload: structuredClone(fallback) })
  dispatch({ type: 'UNKNOWN' })
  return hash(snapshots)
}

test('day drawing and cloud wrap retain the original canvas trace', () => {
  assert.equal(
    withDeterministicEnvironment(() => dayScenario(drawDayScene)),
    expected.day
  )
})
test('night drawing retains parallax, comet tails, respawn RNG and wraps', () => {
  assert.equal(
    withDeterministicEnvironment(() => nightScenario(drawNight, false)),
    expected.night
  )
  assert.equal(
    withDeterministicEnvironment(() => nightScenario(drawNight, true)),
    expected.noParallax
  )
})
test('timer and playlist actions retain prior transitions, dates and RNG order', () => {
  assert.equal(
    withDeterministicEnvironment(() =>
      timerScenario(pomodoroReducer, initialState)
    ),
    expected.pomodoro
  )
})
