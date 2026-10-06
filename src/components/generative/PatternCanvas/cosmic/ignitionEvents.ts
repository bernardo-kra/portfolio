import type { CosmicEngine } from './CosmicEngine'
import type { SpaceEvent } from './eventState'
export function createNova(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'nova',
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    life: 0,
    maxLife: 360,
    intensity: 0.8,
    size: 6 + Math.random() * 3,
    color: { r: 255, g: 150, b: 0 },
    data: {
      explosionRadius: 0,
      brightness: 0,
      shell: {
        innerRadius: 0,
        outerRadius: 0,
      },
    },
  })
}
export function renderNova(
  this: CosmicEngine,
  event: SpaceEvent<'nova'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.globalCompositeOperation = 'screen'
  const progress = event.life / event.maxLife
  const intensity = event.intensity * (1 - progress)
  event.data.explosionRadius += 1.5
  event.data.brightness += 0.02
  event.data.shell.innerRadius += 0.8
  event.data.shell.outerRadius += 1.2

  const drawNovaCore = () => {
    const coreGradient = this.ctx.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      event.size
    )
    coreGradient.addColorStop(
      0,
      `rgba(255, 150, 0, ${intensity * event.data.brightness})`
    )
    coreGradient.addColorStop(0.5, `rgba(255, 100, 0, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
  }
  drawNovaCore()
  const drawNovaShell = () => {
    this.ctx.strokeStyle = `rgba(255, 150, 0, ${intensity * 0.6})`
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.data.explosionRadius, 0, Math.PI * 2)
    this.ctx.stroke()
    const shellGradient = this.ctx.createRadialGradient(
      0,
      0,
      event.data.shell.innerRadius,
      0,
      0,
      event.data.shell.outerRadius
    )
    shellGradient.addColorStop(0, `rgba(255, 200, 100, ${intensity * 0.4})`)
    shellGradient.addColorStop(1, 'transparent')
    this.ctx.fillStyle = shellGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.data.shell.outerRadius, 0, Math.PI * 2)
    this.ctx.fill()
  }
  drawNovaShell()

  this.ctx.restore()
}
export function createWhiteDwarfIgnition(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'white_dwarf_ignition',
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    life: 0,
    maxLife: 720,
    intensity: 0.7,
    size: 3 + Math.random() * 2,
    color: { r: 255, g: 255, b: 200 },
    data: {
      ignitionRadius: 0,
      temperature: 0,
      fusion: {
        intensity: 0,
        particles: Array.from({ length: 15 }, () => ({
          angle: Math.random() * Math.PI * 2,
          distance: Math.random() * 30,
          energy: Math.random(),
        })),
      },
    },
  })
}
export function renderWhiteDwarfIgnition(
  this: CosmicEngine,
  event: SpaceEvent<'white_dwarf_ignition'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.globalCompositeOperation = 'screen'

  const progress = event.life / event.maxLife
  const intensity = event.intensity * (1 - progress)
  const drawIgnitionCore = () => {
    event.data.ignitionRadius += 0.8
    event.data.temperature += 0.01
    event.data.fusion.intensity += 0.005
    const coreGradient = this.ctx.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      event.size
    )
    coreGradient.addColorStop(
      0,
      `rgba(255, 255, 200, ${intensity * event.data.temperature})`
    )
    coreGradient.addColorStop(0.5, `rgba(255, 255, 150, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    this.ctx.fillStyle = coreGradient
  }
  drawIgnitionCore()
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
  this.ctx.fill()
  this.ctx.strokeStyle = `rgba(255, 255, 200, ${intensity * 0.6})`
  this.ctx.lineWidth = 2
  this.ctx.beginPath()
  this.ctx.arc(0, 0, event.data.ignitionRadius, 0, Math.PI * 2)
  this.ctx.stroke()
  event.data.fusion.particles.forEach((particle) => {
    particle.distance += particle.energy * 0.5
    const x = Math.cos(particle.angle) * particle.distance
    const y = Math.sin(particle.angle) * particle.distance

    this.ctx.fillStyle = `rgba(255, 255, 200, ${intensity * particle.energy * event.data.fusion.intensity})`
    this.ctx.beginPath()
    this.ctx.arc(x, y, 1 + particle.energy, 0, Math.PI * 2)
    this.ctx.fill()
  })

  this.ctx.restore()
}
