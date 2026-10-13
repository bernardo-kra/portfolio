export type PatternSettings = {
  mode: number
  palette: number
  density: number
  seed: number
}
export const patternPalettes = [
  ['#fff4cb', '#201b28', '#ffce08', '#f34c40'],
  ['#e5f4f7', '#153847', '#2b9bd1', '#67c4a5'],
  ['#f2e8fb', '#33214b', '#875cc8', '#ed84b3'],
]
export const defaultPattern: PatternSettings = {
  mode: 0,
  palette: 0,
  density: 6,
  seed: 1,
}
function variation(seed: number, index: number) {
  let value = (seed * 2654435761 + index * 1597334677) >>> 0
  value ^= value >>> 16
  value = Math.imul(value, 2246822507) >>> 0
  return (value >>> 0) / 4294967296
}
function patternCell(settings: PatternSettings, index: number) {
  const colors = patternPalettes[settings.palette]
  const size = 600 / settings.density
  const x = (index % settings.density) * size
  const y = Math.floor(index / settings.density) * size
  const random = variation(settings.seed, index)
  const color = colors[1 + Math.floor(random * 3)]
  if (settings.mode === 0)
    return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size * (0.12 + random * 0.25)}" fill="${color}"/>`
  if (settings.mode === 1)
    return `<path d="M${x} ${y} Q${x + size} ${y} ${x + size} ${y + size}" fill="none" stroke="${color}" stroke-width="${size * 0.15}" transform="rotate(${Math.floor(random * 4) * 90} ${x + size / 2} ${y + size / 2})"/>`
  return `<path d="M${x + size / 2} ${y + size * 0.12} L${x + size * 0.88} ${y + size / 2} L${x + size / 2} ${y + size * 0.88} L${x + size * 0.12} ${y + size / 2}Z" fill="${color}" transform="rotate(${Math.floor(random * 4) * 45} ${x + size / 2} ${y + size / 2})"/>`
}
export function patternSvg(settings: PatternSettings) {
  const cells = Array.from({ length: settings.density ** 2 }, (_, index) =>
    patternCell(settings, index)
  ).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 600 600"><rect width="600" height="600" fill="${patternPalettes[settings.palette][0]}"/>${cells}</svg>`
}
export function patternDataUrl(settings: PatternSettings) {
  return `data:image/svg+xml,${encodeURIComponent(patternSvg(settings))}`
}
