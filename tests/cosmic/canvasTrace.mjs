import { createHash } from 'node:crypto'

const hash = (value) =>
  createHash('sha256')
    .update(
      JSON.stringify(value, (_, item) => {
        if (typeof item === 'number' && !Number.isFinite(item))
          return String(item)
        return item
      })
    )
    .digest('hex')

function canvas() {
  const trace = []
  const properties = { globalAlpha: 1, globalCompositeOperation: 'source-over' }
  const stack = []
  let gradient = 0
  const ctx = new Proxy(properties, {
    get(target, property) {
      if (property in target) return target[property]
      return (...args) => {
        trace.push([property, ...args])
        if (property === 'save') stack.push({ ...properties })
        if (property === 'restore') {
          const saved = stack.pop()
          if (saved) {
            for (const key of Object.keys(properties)) delete properties[key]
            Object.assign(properties, saved)
          }
        }
        if (
          property === 'createRadialGradient' ||
          property === 'createLinearGradient'
        ) {
          const id = ++gradient
          return {
            gradient: id,
            addColorStop: (...stops) => trace.push(['colorStop', id, ...stops]),
          }
        }
      }
    },
    set(target, property, value) {
      trace.push(['set', property, value])
      target[property] = value
      return true
    },
  })
  return { ctx, trace }
}

export function runScenario(Generator, scenario) {
  const random = Math.random
  let seed = scenario.seed ?? 7219
  let draws = 0
  Math.random = () => {
    draws++
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
  try {
    const { ctx, trace } = canvas()
    const generator = new Generator(
      ctx,
      scenario.width ?? 480,
      scenario.height ?? 320
    )
    const state = generator.engine ?? generator
    scenario.run(generator, state)
    const snapshot = Object.fromEntries(
      Object.keys(state)
        .sort()
        .filter((key) => key !== 'ctx' && typeof state[key] !== 'function')
        .map((key) => [key, state[key]])
    )
    return {
      commands: trace.length,
      trace: hash(trace),
      state: hash(snapshot),
      draws,
    }
  } finally {
    Math.random = random
  }
}
