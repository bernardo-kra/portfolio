import type { CosmicEngine } from './CosmicEngine'
import type { SpaceEvent } from './eventState'
export function createGammaRayBurst(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'gamma_ray_burst',
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    life: 0,
    maxLife: 300,
    intensity: 1.0,
    size: 2 + Math.random() * 2,
    color: { r: 255, g: 255, b: 0 },
    data: {
      beamAngle: Math.random() * Math.PI * 2,
      beamWidth: 0.1 + Math.random() * 0.2,
      beamLength: 200 + Math.random() * 300,
      energy: 0.8 + Math.random() * 0.2,
    },
  })
}
export function renderGammaRayBurst(
  this: CosmicEngine,
  event: SpaceEvent<'gamma_ray_burst'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.globalCompositeOperation = 'screen'

  const progress = event.life / event.maxLife
  const intensity = event.intensity * (1 - progress)

  const beamLength = event.data.beamLength * (0.5 + progress * 0.5)
  const beamWidth = event.data.beamWidth * 100

  this.ctx.strokeStyle = `rgba(255, 255, 0, ${intensity})`
  this.ctx.lineWidth = beamWidth
  this.ctx.beginPath()
  this.ctx.moveTo(0, 0)
  this.ctx.lineTo(
    Math.cos(event.data.beamAngle) * beamLength,
    Math.sin(event.data.beamAngle) * beamLength
  )
  this.ctx.stroke()

  this.ctx.fillStyle = `rgba(255, 255, 0, ${intensity * 0.6})`
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
  this.ctx.fill()

  this.ctx.restore()
}
export function createStellarCollision(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'stellar_collision',
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    life: 0,
    maxLife: 900,
    intensity: 0.9,
    size: 15 + Math.random() * 10,
    color: { r: 255, g: 200, b: 0 },
    data: {
      explosionRadius: 0,
      shockwaveRadius: 0,
      debris: Array.from({ length: 20 }, () => ({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 100,
        speed: 1 + Math.random() * 3,
      })),
    },
  })
}
export function renderStellarCollision(
  this: CosmicEngine,
  event: SpaceEvent<'stellar_collision'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.globalCompositeOperation = 'screen'

  const progress = event.life / event.maxLife
  const intensity = event.intensity * (1 - progress)

  const drawCollisionCore = () => {
    event.data.explosionRadius += 2
    event.data.shockwaveRadius += 1.5
    const coreGradient = this.ctx.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      event.size
    )
    coreGradient.addColorStop(0, `rgba(255, 200, 0, ${intensity})`)
    coreGradient.addColorStop(0.5, `rgba(255, 150, 0, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
  }
  drawCollisionCore()
  this.ctx.strokeStyle = `rgba(255, 200, 0, ${intensity * 0.6})`
  this.ctx.lineWidth = 3
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.data.explosionRadius, 0, Math.PI * 2)
  this.ctx.stroke()
  this.ctx.strokeStyle = `rgba(255, 100, 0, ${intensity * 0.4})`
  this.ctx.lineWidth = 2
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.data.shockwaveRadius, 0, Math.PI * 2)
  this.ctx.stroke()
  event.data.debris.forEach((debris) => {
    debris.distance += debris.speed
    const x = Math.cos(debris.angle) * debris.distance
    const y = Math.sin(debris.angle) * debris.distance

    this.ctx.fillStyle = `rgba(255, 150, 0, ${intensity * 0.8})`
    this.ctx.beginPath()
    this.ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2)
    this.ctx.fill()
  })

  this.ctx.restore()
}
