import type { CosmicEngine } from './CosmicEngine'
import type { SpaceEvent } from './eventState'
export function createStellarWind(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'stellar_wind',
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    life: 0,
    maxLife: 480,
    intensity: 0.6,
    size: 20 + Math.random() * 15,
    color: { r: 100, g: 200, b: 255 },
    data: {
      windDirection: Math.random() * Math.PI * 2,
      windSpeed: 2 + Math.random() * 3,
      particles: Array.from({ length: 30 }, () => ({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 50,
        speed: 1 + Math.random() * 2,
      })),
    },
  })
}
export function renderStellarWind(
  this: CosmicEngine,
  event: SpaceEvent<'stellar_wind'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.globalCompositeOperation = 'screen'

  const progress = event.life / event.maxLife
  const intensity = event.intensity * (1 - progress)

  const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, event.size)
  coreGradient.addColorStop(0, `rgba(100, 200, 255, ${intensity})`)
  coreGradient.addColorStop(0.5, `rgba(150, 200, 255, ${intensity * 0.8})`)
  coreGradient.addColorStop(1, 'transparent')

  this.ctx.fillStyle = coreGradient
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
  this.ctx.fill()

  event.data.particles.forEach((particle) => {
    particle.distance += particle.speed
    const x = Math.cos(particle.angle) * particle.distance
    const y = Math.sin(particle.angle) * particle.distance

    this.ctx.fillStyle = `rgba(100, 200, 255, ${intensity * 0.6})`
    this.ctx.beginPath()
    this.ctx.arc(x, y, 1 + Math.random(), 0, Math.PI * 2)
    this.ctx.fill()
  })

  this.ctx.restore()
}
export function createMagnetarFlare(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'magnetar_flare',
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    life: 0,
    maxLife: 180,
    intensity: 0.9,
    size: 4 + Math.random() * 2,
    color: { r: 255, g: 0, b: 255 },
    data: {
      magneticField: {
        strength: 0.5 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
      },
      flareIntensity: 0,
      particleStreams: Array.from({ length: 8 }, () => ({
        angle: Math.random() * Math.PI * 2,
        length: 0,
        speed: 3 + Math.random() * 2,
      })),
    },
  })
}
export function renderMagnetarFlare(
  this: CosmicEngine,
  event: SpaceEvent<'magnetar_flare'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.globalCompositeOperation = 'screen'

  const progress = event.life / event.maxLife
  const intensity = event.intensity * (1 - progress)

  event.data.flareIntensity += 0.1
  event.data.particleStreams.forEach((stream) => {
    stream.length += stream.speed
  })

  const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, event.size)
  coreGradient.addColorStop(0, `rgba(255, 0, 255, ${intensity})`)
  coreGradient.addColorStop(0.5, `rgba(255, 50, 255, ${intensity * 0.8})`)
  coreGradient.addColorStop(1, 'transparent')

  this.ctx.fillStyle = coreGradient
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
  this.ctx.fill()

  event.data.particleStreams.forEach((stream) => {
    this.ctx.strokeStyle = `rgba(255, 0, 255, ${intensity * 0.8})`
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(
      Math.cos(stream.angle) * stream.length,
      Math.sin(stream.angle) * stream.length
    )
    this.ctx.stroke()
  })

  this.ctx.restore()
}
