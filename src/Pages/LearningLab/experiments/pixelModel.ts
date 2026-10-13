export const pixelSize = 12
export const pixelColors = [
  '#ffffff',
  '#201b28',
  '#1675ad',
  '#ffce08',
  '#f34c40',
  '#67c4a5',
  '#875cc8',
]
export type PixelTool = 'pen' | 'erase' | 'fill'
export type PixelState = {
  pixels: number[]
  past: number[][]
  future: number[][]
  stroke: number[] | null
}
export type PixelAction =
  | {
      type: 'paint'
      index: number
      color: number
      tool: PixelTool
      mirror: boolean
    }
  | { type: 'commit' | 'undo' | 'redo' }
  | { type: 'replace'; pixels: number[] }

const patterns = [
  [
    '....33..',
    '...33...',
    '..333...',
    '.333333.',
    '....33..',
    '...33...',
    '..33....',
    '.33.....',
  ],
  [
    '.44..44.',
    '44444444',
    '44444444',
    '.444444.',
    '..4444..',
    '...44...',
    '........',
    '........',
  ],
  [
    '...22...',
    '...222..',
    '2222222.',
    '22222222',
    '2222222.',
    '...222..',
    '...22...',
    '........',
  ],
]
export function pixelPreset(index: number) {
  const pixels = Array<number>(pixelSize * pixelSize).fill(0)
  patterns[index].forEach((row, y) => {
    row.split('').forEach((value, x) => {
      pixels[(y + 2) * pixelSize + x + 2] = value === '.' ? 0 : Number(value)
    })
  })
  return pixels
}
export function pixelLine(from: number, to: number) {
  const x = from % pixelSize
  const y = Math.floor(from / pixelSize)
  const dx = (to % pixelSize) - x
  const dy = Math.floor(to / pixelSize) - y
  const steps = Math.max(Math.abs(dx), Math.abs(dy))
  if (!steps) return [to]
  return Array.from(
    { length: steps + 1 },
    (_, step) =>
      Math.round(y + (dy * step) / steps) * pixelSize +
      Math.round(x + (dx * step) / steps)
  )
}
function fillRegion(pixels: number[], start: number) {
  const pending = [start]
  const region = new Set<number>()
  while (pending.length) {
    const index = pending.pop()!
    if (region.has(index) || pixels[index] !== pixels[start]) continue
    region.add(index)
    const row = Math.floor(index / pixelSize)
    const column = index % pixelSize
    if (row > 0) pending.push(index - pixelSize)
    if (row < pixelSize - 1) pending.push(index + pixelSize)
    if (column > 0) pending.push(index - 1)
    if (column < pixelSize - 1) pending.push(index + 1)
  }
  return region
}
export function paintPixels(
  pixels: number[],
  action: Extract<PixelAction, { type: 'paint' }>
) {
  if (action.index < 0 || action.index >= pixels.length) return pixels
  const color = action.tool === 'erase' ? 0 : action.color
  const positions =
    action.tool === 'fill'
      ? fillRegion(pixels, action.index)
      : new Set([action.index])
  const next = [...pixels]
  positions.forEach((index) => {
    next[index] = color
    if (action.mirror)
      next[
        Math.floor(index / pixelSize) * pixelSize +
          pixelSize -
          1 -
          (index % pixelSize)
      ] = color
  })
  return next.every((value, index) => value === pixels[index]) ? pixels : next
}
function commitStroke(state: PixelState): PixelState {
  if (!state.stroke) return state
  if (state.pixels.every((value, index) => value === state.stroke?.[index]))
    return { ...state, stroke: null }
  return {
    ...state,
    past: [...state.past, state.stroke].slice(-30),
    future: [],
    stroke: null,
  }
}
export function pixelReducer(
  state: PixelState,
  action: PixelAction
): PixelState {
  switch (action.type) {
    case 'paint':
      return {
        ...state,
        pixels: paintPixels(state.pixels, action),
        stroke: state.stroke ?? state.pixels,
      }
    case 'commit':
      return commitStroke(state)
    case 'replace':
      return commitStroke({
        ...state,
        stroke: state.pixels,
        pixels: action.pixels,
      })
    case 'undo':
      return state.past.length
        ? {
            pixels: state.past.at(-1)!,
            past: state.past.slice(0, -1),
            future: [state.pixels, ...state.future],
            stroke: null,
          }
        : state
    case 'redo':
      return state.future.length
        ? {
            pixels: state.future[0],
            past: [...state.past, state.pixels],
            future: state.future.slice(1),
            stroke: null,
          }
        : state
  }
}
export function pixelSvg(pixels: number[]) {
  const cells = pixels
    .map(
      (color, index) =>
        `<rect x="${index % pixelSize}" y="${Math.floor(index / pixelSize)}" width="1" height="1" fill="${pixelColors[color]}"/>`
    )
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 ${pixelSize} ${pixelSize}" shape-rendering="crispEdges">${cells}</svg>`
}
export function downloadPixelArt(pixels: number[]) {
  const url = URL.createObjectURL(
    new Blob([pixelSvg(pixels)], { type: 'image/svg+xml' })
  )
  const link = document.createElement('a')
  link.href = url
  link.download = 'meu-icone.svg'
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
