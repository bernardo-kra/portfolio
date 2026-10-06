import type { CosmicEngine } from './CosmicEngine'
import type { SpaceEvent } from './eventState'
export function createPulsar(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'pulsar',
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    life: 0,
    maxLife: 600,
    intensity: 0.8,
    size: 3 + Math.random() * 2,
    color: { r: 0, g: 255, b: 255 },
    data: {
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.1 + Math.random() * 0.2,
      beamAngle: Math.random() * Math.PI * 2,
      beamLength: 50 + Math.random() * 100,
    },
  })
}
export function renderPulsar(
  this: CosmicEngine,
  event: SpaceEvent<'pulsar'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.globalCompositeOperation = 'screen'

  const progress = event.life / event.maxLife
  const intensity = event.intensity * (1 - progress)

  event.data.pulsePhase += event.data.pulseSpeed
  const pulse = Math.sin(event.data.pulsePhase) * 0.5 + 0.5

  this.ctx.fillStyle = `rgba(0, 255, 255, ${intensity * pulse})`
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
  this.ctx.fill()

  const beamLength = event.data.beamLength * pulse
  const beamWidth = 2 + pulse * 3

  this.ctx.strokeStyle = `rgba(0, 255, 255, ${intensity * 0.8})`
  this.ctx.lineWidth = beamWidth
  this.ctx.beginPath()
  this.ctx.moveTo(0, 0)
  this.ctx.lineTo(
    Math.cos(event.data.beamAngle) * beamLength,
    Math.sin(event.data.beamAngle) * beamLength
  )
  this.ctx.stroke()

  this.ctx.restore()
}
export function createQuasar(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'quasar',
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    life: 0,
    maxLife: 1200,
    intensity: 1.0,
    size: 8 + Math.random() * 4,
    color: { r: 255, g: 100, b: 0 },
    data: {
      jetAngle: Math.random() * Math.PI * 2,
      jetLength: 100 + Math.random() * 200,
      accretionDisk: {
        innerRadius: 10,
        outerRadius: 30 + Math.random() * 20,
        rotation: 0,
      },
    },
  })
}
export function renderQuasar(
  this: CosmicEngine,
  event: SpaceEvent<'quasar'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.globalCompositeOperation = 'screen'

  const progress = event.life / event.maxLife
  const intensity = event.intensity * (1 - progress)

  const drawQuasarAccretionDisk = () => {
    event.data.accretionDisk.rotation += 0.02
    const coreGradient = this.ctx.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      event.size
    )
    coreGradient.addColorStop(0, `rgba(255, 100, 0, ${intensity})`)
    coreGradient.addColorStop(0.5, `rgba(255, 150, 50, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
    const diskGradient = this.ctx.createRadialGradient(
      0,
      0,
      event.data.accretionDisk.innerRadius,
      0,
      0,
      event.data.accretionDisk.outerRadius
    )
    diskGradient.addColorStop(0, `rgba(255, 200, 100, ${intensity * 0.6})`)
    diskGradient.addColorStop(0.5, `rgba(255, 150, 50, ${intensity * 0.4})`)
    diskGradient.addColorStop(1, 'transparent')
    this.ctx.save()
    this.ctx.rotate(event.data.accretionDisk.rotation)
    this.ctx.fillStyle = diskGradient
  }

  drawQuasarAccretionDisk()
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.data.accretionDisk.outerRadius, 0, Math.PI * 2)
  this.ctx.fill()
  this.ctx.restore()
  const jetLength = event.data.jetLength * (0.5 + progress * 0.5)
  this.ctx.strokeStyle = `rgba(255, 100, 0, ${intensity * 0.8})`
  this.ctx.lineWidth = 3
  this.ctx.beginPath()
  this.ctx.moveTo(0, 0)
  this.ctx.lineTo(
    Math.cos(event.data.jetAngle) * jetLength,
    Math.sin(event.data.jetAngle) * jetLength
  )
  this.ctx.stroke()

  this.ctx.restore()
}
