import assert from 'node:assert/strict'
import test from 'node:test'
import {
  paintPixels,
  pixelLine,
  pixelReducer,
  pixelSize,
  pixelSvg,
} from '../src/Pages/LearningLab/experiments/pixelModel.ts'

const blank = () => Array(pixelSize ** 2).fill(0)
const state = () => ({ pixels: blank(), past: [], future: [], stroke: null })
const paint = (index, overrides = {}) => ({
  type: 'paint',
  index,
  color: 2,
  tool: 'pen',
  mirror: false,
  ...overrides,
})

test('one dragged stroke is undone atomically, and redo restores its pixels', () => {
  let drawing = pixelReducer(state(), paint(0))
  drawing = pixelReducer(drawing, paint(1))
  drawing = pixelReducer(drawing, { type: 'commit' })
  assert.equal(drawing.past.length, 1)
  const undone = pixelReducer(drawing, { type: 'undo' })
  assert.deepEqual(undone.pixels, blank())
  assert.deepEqual(
    pixelReducer(undone, { type: 'redo' }).pixels,
    drawing.pixels
  )
  const repainted = pixelReducer(pixelReducer(undone, paint(5)), {
    type: 'commit',
  })
  assert.equal(repainted.future.length, 0)
})

test('fill respects four-way connectivity without wrapping between rows', () => {
  const pixels = Array(pixelSize ** 2).fill(1)
  pixels[pixelSize - 1] = 0
  pixels[pixelSize] = 0
  const filled = paintPixels(
    pixels,
    paint(pixelSize - 1, { tool: 'fill', color: 3 })
  )
  assert.equal(filled[pixelSize - 1], 3)
  assert.equal(filled[pixelSize], 0)
  assert.equal(pixels[pixelSize - 1], 0)
})

test('mirror pairs the correct columns; erase and no-op strokes preserve history', () => {
  const mirrored = pixelReducer(state(), paint(0, { mirror: true }))
  assert.equal(mirrored.pixels[0], 2)
  assert.equal(mirrored.pixels[pixelSize - 1], 2)
  const erased = paintPixels(
    mirrored.pixels,
    paint(0, { tool: 'erase', mirror: true })
  )
  assert.deepEqual(erased, blank())
  const unchanged = pixelReducer(
    pixelReducer(state(), paint(0, { tool: 'erase' })),
    { type: 'commit' }
  )
  assert.equal(unchanged.past.length, 0)
})

test('fast pointer moves interpolate connected pixels and SVG preserves their colors', () => {
  assert.deepEqual(pixelLine(0, 5), [0, 1, 2, 3, 4, 5])
  assert.deepEqual(pixelLine(0, 26), [0, 13, 26])
  const svg = pixelSvg(paintPixels(blank(), paint(13)))
  assert.match(svg, /viewBox="0 0 12 12"/)
  assert.match(svg, /x="1" y="1" width="1" height="1" fill="#1675ad"/)
})
