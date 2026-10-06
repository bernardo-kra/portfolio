import type { CosmicEngine } from './CosmicEngine'
import type { SpaceEvent } from './eventState'
export function createBlackHoleFormation(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'black_hole_formation',
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    life: 0,
    maxLife: 1800,
    intensity: 0.7,
    size: 5 + Math.random() * 3,
    color: { r: 0, g: 0, b: 0 },
    data: {
      eventHorizon: 0,
      accretionDisk: {
        innerRadius: 0,
        outerRadius: 0,
        rotation: 0,
      },
      jets: {
        angle1: Math.random() * Math.PI * 2,
        angle2: Math.random() * Math.PI * 2,
        length: 0,
      },
    },
  })
}
export function renderBlackHoleFormation(
  this: CosmicEngine,
  event: SpaceEvent<'black_hole_formation'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.globalCompositeOperation = 'screen'

  const progress = event.life / event.maxLife
  const intensity = event.intensity * (1 - progress)

  const drawFormingAccretionDisk = () => {
    event.data.eventHorizon += 0.5
    event.data.accretionDisk.innerRadius += 0.3
    event.data.accretionDisk.outerRadius += 0.8
    event.data.accretionDisk.rotation += 0.05
    event.data.jets.length += 2
    const coreGradient = this.ctx.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      event.size
    )
    coreGradient.addColorStop(0, `rgba(0, 0, 0, ${intensity})`)
    coreGradient.addColorStop(0.8, `rgba(50, 0, 50, ${intensity * 0.6})`)
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
    diskGradient.addColorStop(0, `rgba(255, 100, 255, ${intensity * 0.8})`)
    diskGradient.addColorStop(0.5, `rgba(255, 50, 255, ${intensity * 0.6})`)
    diskGradient.addColorStop(1, 'transparent')
    this.ctx.save()
    this.ctx.rotate(event.data.accretionDisk.rotation)
    this.ctx.fillStyle = diskGradient
  }
  drawFormingAccretionDisk()
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.data.accretionDisk.outerRadius, 0, Math.PI * 2)
  this.ctx.fill()
  this.ctx.restore()

  this.ctx.strokeStyle = `rgba(255, 100, 255, ${intensity * 0.8})`
  this.ctx.lineWidth = 2
  this.ctx.beginPath()
  this.ctx.moveTo(0, 0)
  this.ctx.lineTo(
    Math.cos(event.data.jets.angle1) * event.data.jets.length,
    Math.sin(event.data.jets.angle1) * event.data.jets.length
  )
  this.ctx.moveTo(0, 0)
  this.ctx.lineTo(
    Math.cos(event.data.jets.angle2) * event.data.jets.length,
    Math.sin(event.data.jets.angle2) * event.data.jets.length
  )
  this.ctx.stroke()

  this.ctx.restore()
}
export function createNeutronStarMerger(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'neutron_star_merger',
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    life: 0,
    maxLife: 600,
    intensity: 0.95,
    size: 8 + Math.random() * 4,
    color: { r: 255, g: 100, b: 255 },
    data: {
      mergerRadius: 0,
      gravitationalWaves: Array.from({ length: 10 }, () => ({
        angle: Math.random() * Math.PI * 2,
        amplitude: Math.random() * 50,
        frequency: 0.1 + Math.random() * 0.3,
      })),
    },
  })
}
export function renderNeutronStarMerger(
  this: CosmicEngine,
  event: SpaceEvent<'neutron_star_merger'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.globalCompositeOperation = 'screen'
  const progress = event.life / event.maxLife
  const intensity = event.intensity * (1 - progress)
  const drawMergerCore = () => {
    event.data.mergerRadius += 1.2
    const coreGradient = this.ctx.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      event.size
    )
    coreGradient.addColorStop(0, `rgba(255, 100, 255, ${intensity})`)
    coreGradient.addColorStop(0.5, `rgba(255, 50, 255, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    this.ctx.fillStyle = coreGradient
  }
  drawMergerCore()
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
  this.ctx.fill()
  this.ctx.strokeStyle = `rgba(255, 100, 255, ${intensity * 0.6})`
  this.ctx.lineWidth = 2
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.data.mergerRadius, 0, Math.PI * 2)
  this.ctx.stroke()
  event.data.gravitationalWaves.forEach((wave) => {
    wave.angle += 0.1
    const x = Math.cos(wave.angle) * wave.amplitude
    const y = Math.sin(wave.angle) * wave.amplitude

    this.ctx.strokeStyle = `rgba(255, 100, 255, ${intensity * 0.4})`
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.arc(
      x,
      y,
      5 + Math.sin(wave.frequency * this.time) * 3,
      0,
      Math.PI * 2
    )
    this.ctx.stroke()
  })

  this.ctx.restore()
}
