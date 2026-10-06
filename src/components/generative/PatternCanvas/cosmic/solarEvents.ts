import type { CosmicEngine } from './CosmicEngine'
import type { SpaceEvent } from './eventState'
export function createSolarFlare(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'solar_flare',
    x: Math.random() * this.width,
    y: Math.random() * this.height * 0.3,
    life: 0,
    maxLife: 180,
    intensity: 0.8,
    size: 15,
    color: { r: 255, g: 150, b: 50 },
    data: {
      angle: Math.random() * Math.PI * 2,
      length: 50 + Math.random() * 100,
    },
  })
}
export function updateSolarFlare(
  this: CosmicEngine,
  event: SpaceEvent<'solar_flare'>
): void {
  const progress = event.life / event.maxLife
  event.intensity = Math.sin(progress * Math.PI) * 0.8
  event.data.length =
    (50 + Math.random() * 100) * (1 + Math.sin(event.life * 0.1))
}
export function renderSolarFlare(
  this: CosmicEngine,
  event: SpaceEvent<'solar_flare'>
): void {
  const { r, g, b } = event.color
  const alpha = event.intensity

  this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
  this.ctx.lineWidth = event.size
  this.ctx.lineCap = 'round'

  for (let i = 0; i < 3; i++) {
    const angle = event.data.angle + (i - 1) * 0.3
    const length = event.data.length * (0.7 + i * 0.15)

    this.ctx.beginPath()
    this.ctx.moveTo(event.x, event.y)
    this.ctx.lineTo(
      event.x + Math.cos(angle) * length,
      event.y + Math.sin(angle) * length
    )
    this.ctx.stroke()
  }
}
export function createAurora(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'aurora',
    x: Math.random() * this.width,
    y: this.height * 0.7 + Math.random() * this.height * 0.3,
    life: 0,
    maxLife: 480,
    intensity: 0.6,
    size: 200,
    color: { r: 100, g: 255, b: 150 },
    data: {
      wavePhase: Math.random() * Math.PI * 2,
      waveSpeed: 0.02 + Math.random() * 0.03,
      layers: Math.floor(3 + Math.random() * 4),
    },
  })
}
export function updateAurora(
  this: CosmicEngine,
  event: SpaceEvent<'aurora'>
): void {
  event.data.wavePhase += event.data.waveSpeed
  const progress = event.life / event.maxLife
  event.intensity = Math.sin(progress * Math.PI) * 0.6
}
export function renderAurora(
  this: CosmicEngine,
  event: SpaceEvent<'aurora'>
): void {
  const { r, g, b } = event.color
  const alpha = event.intensity

  this.ctx.globalCompositeOperation = 'screen'

  for (let layer = 0; layer < event.data.layers; layer++) {
    const layerAlpha = alpha * (0.3 + layer * 0.2)
    const waveOffset = layer * 20

    this.ctx.strokeStyle = `rgba(${r + layer * 20}, ${g}, ${b - layer * 30}, ${layerAlpha})`
    this.ctx.lineWidth = 3 + layer
    this.ctx.lineCap = 'round'

    this.ctx.beginPath()
    for (let x = event.x - event.size; x <= event.x + event.size; x += 5) {
      const y =
        event.y + Math.sin(x / 50 + event.data.wavePhase + waveOffset) * 8
      if (x === event.x - event.size) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    }
    this.ctx.stroke()
  }

  this.ctx.globalCompositeOperation = 'source-over'
}
