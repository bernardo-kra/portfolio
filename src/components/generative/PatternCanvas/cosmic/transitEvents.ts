import type { CosmicEngine } from './CosmicEngine'
import type { SpaceEvent } from './eventState'
export function createComet(this: CosmicEngine): void {
  const side = Math.floor(Math.random() * 4)
  let x, y

  switch (side) {
    case 0:
      x = -50
      y = Math.random() * this.height
      break
    case 1:
      x = this.width + 50
      y = Math.random() * this.height
      break
    case 2:
      x = Math.random() * this.width
      y = -50
      break
    default:
      x = Math.random() * this.width
      y = this.height + 50
      break
  }

  this.spaceEvents.push({
    type: 'comet',
    x: x,
    y: y,
    life: 0,
    maxLife: 900,
    intensity: 0.7,
    size: 8,
    color: { r: 180, g: 220, b: 255 },
    data: {
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      tail: [],
    },
  })
}
export function updateComet(
  this: CosmicEngine,
  event: SpaceEvent<'comet'>
): void {
  event.x += event.data.vx
  event.y += event.data.vy

  event.data.tail.unshift({ x: event.x, y: event.y, opacity: event.intensity })
  if (event.data.tail.length > 30) {
    event.data.tail.pop()
  }

  event.data.tail.forEach((point) => {
    point.opacity *= 0.95
  })
}
export function renderComet(
  this: CosmicEngine,
  event: SpaceEvent<'comet'>
): void {
  if (event.data.tail.length > 1) {
    this.ctx.strokeStyle = `rgba(${event.color.r}, ${event.color.g}, ${event.color.b}, 0.6)`
    this.ctx.lineWidth = event.size
    this.ctx.lineCap = 'round'

    this.ctx.beginPath()
    this.ctx.moveTo(event.data.tail[0].x, event.data.tail[0].y)

    for (let i = 1; i < event.data.tail.length; i++) {
      const point = event.data.tail[i]
      this.ctx.globalAlpha = point.opacity
      this.ctx.lineTo(point.x, point.y)
    }

    this.ctx.stroke()
    this.ctx.globalAlpha = 1
  }

  this.ctx.fillStyle = `rgba(${event.color.r}, ${event.color.g}, ${event.color.b}, ${event.intensity})`
  this.ctx.beginPath()
  this.ctx.arc(event.x, event.y, event.size, 0, Math.PI * 2)
  this.ctx.fill()
}
export function createSatellite(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'satellite',
    x: -20,
    y: Math.random() * this.height * 0.4,
    life: 0,
    maxLife: 300,
    intensity: 0.8,
    size: 2,
    color: { r: 255, g: 255, b: 255 },
    data: {
      vx: 3 + Math.random() * 2,
      vy: 0.2 + Math.random() * 0.4,
      blinkPhase: Math.random() * Math.PI * 2,
    },
  })
}
export function updateSatellite(
  this: CosmicEngine,
  event: SpaceEvent<'satellite'>
): void {
  event.x += event.data.vx
  event.y += event.data.vy
  event.data.blinkPhase += 0.2
}
export function renderSatellite(
  this: CosmicEngine,
  event: SpaceEvent<'satellite'>
): void {
  const blink = Math.sin(event.data.blinkPhase) > 0.5 ? 1 : 0.3
  const alpha = event.intensity * blink

  this.ctx.fillStyle = `rgba(${event.color.r}, ${event.color.g}, ${event.color.b}, ${alpha})`
  this.ctx.beginPath()
  this.ctx.arc(event.x, event.y, event.size, 0, Math.PI * 2)
  this.ctx.fill()

  this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`
  this.ctx.lineWidth = 1
  this.ctx.beginPath()
  this.ctx.moveTo(event.x - 5, event.y)
  this.ctx.lineTo(event.x + 5, event.y)
  this.ctx.moveTo(event.x, event.y - 5)
  this.ctx.lineTo(event.x, event.y + 5)
  this.ctx.stroke()
}
export function createSpaceDebris(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'space_debris',
    x: Math.random() * this.width,
    y: -20,
    life: 0,
    maxLife: 240,
    intensity: 0.4,
    size: 1 + Math.random() * 3,
    color: { r: 150, g: 150, b: 150 },
    data: {
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 3,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
    },
  })
}
export function updateSpaceDebris(
  this: CosmicEngine,
  event: SpaceEvent<'space_debris'>
): void {
  event.x += event.data.vx
  event.y += event.data.vy
  event.data.rotation += event.data.rotationSpeed
}
export function renderSpaceDebris(
  this: CosmicEngine,
  event: SpaceEvent<'space_debris'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.rotate(event.data.rotation)

  this.ctx.fillStyle = `rgba(${event.color.r}, ${event.color.g}, ${event.color.b}, ${event.intensity})`
  this.ctx.fillRect(-event.size / 2, -event.size / 2, event.size, event.size)

  this.ctx.restore()
}
