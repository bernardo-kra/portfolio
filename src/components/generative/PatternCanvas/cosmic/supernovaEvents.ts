import type { CosmicEngine } from './CosmicEngine'
import type { SpaceEvent } from './eventState'
export function createSupernova(this: CosmicEngine): void {
  this.spaceEvents.push({
    type: 'supernova',
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    life: 0,
    maxLife: 600,
    intensity: 0,
    size: 5,
    color: { r: 255, g: 255, b: 255 },
    data: {
      phase: 0,
      expansionRadius: 0,
      shockwaveRadius: 0,
    },
  })
}
export function updateSupernova(
  this: CosmicEngine,
  event: SpaceEvent<'supernova'>
): void {
  const progress = event.life / event.maxLife

  if (progress < 0.1) {
    event.intensity = progress * 10
  } else if (progress < 0.3) {
    event.intensity = 1
    event.data.expansionRadius = (progress - 0.1) * 200
  } else if (progress < 0.6) {
    event.intensity = 1 - (progress - 0.3) * 2
    event.data.shockwaveRadius = (progress - 0.3) * 400
  } else {
    event.intensity = Math.max(0, 0.4 - (progress - 0.6) * 1)
  }
}
export function renderSupernova(
  this: CosmicEngine,
  event: SpaceEvent<'supernova'>
): void {
  this.ctx.save()
  this.ctx.translate(event.x, event.y)
  this.ctx.globalCompositeOperation = 'screen'

  const progress = event.life / event.maxLife
  const coreSize = event.size * (0.5 + progress * 1.5)
  const intensity = event.intensity

  const drawSupernovaCore = () => {
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize)
    coreGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`)
    coreGradient.addColorStop(0.3, `rgba(255, 200, 100, ${intensity * 0.9})`)
    coreGradient.addColorStop(0.6, `rgba(255, 100, 50, ${intensity * 0.6})`)
    coreGradient.addColorStop(1, 'transparent')
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, coreSize, 0, Math.PI * 2)
    this.ctx.fill()
  }
  drawSupernovaCore()

  const drawExpansionLayers = () => {
    const layers = 6
    for (let layer = 0; layer < layers; layer++) {
      const layerProgress = Math.max(0, progress - layer * 0.1)
      if (layerProgress <= 0) continue

      const layerRadius = coreSize * (1 + layerProgress * 3)
      const layerIntensity = intensity * (1 - layer * 0.15) * layerProgress
      const layerGradient = this.ctx.createRadialGradient(
        0,
        0,
        layerRadius * 0.3,
        0,
        0,
        layerRadius
      )
      const drawSupernovaCoreColors = () => {
        if (layer < 2) {
          layerGradient.addColorStop(
            0,
            `rgba(255, 255, 200, ${layerIntensity * 0.8})`
          )
          layerGradient.addColorStop(
            0.5,
            `rgba(255, 150, 50, ${layerIntensity * 0.5})`
          )
        } else if (layer < 4) {
          layerGradient.addColorStop(
            0,
            `rgba(255, 120, 0, ${layerIntensity * 0.6})`
          )
          layerGradient.addColorStop(
            0.5,
            `rgba(255, 50, 0, ${layerIntensity * 0.4})`
          )
        } else {
          layerGradient.addColorStop(
            0,
            `rgba(100, 150, 255, ${layerIntensity * 0.4})`
          )
          layerGradient.addColorStop(
            0.5,
            `rgba(150, 100, 255, ${layerIntensity * 0.3})`
          )
        }
      }
      drawSupernovaCoreColors()
      layerGradient.addColorStop(1, 'transparent')
      this.ctx.fillStyle = layerGradient
      this.ctx.beginPath()
      this.ctx.arc(0, 0, layerRadius, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }
  drawExpansionLayers()

  const drawShockwaveRings = () => {
    if (event.data.shockwaveRadius > 0) {
      const rings = 4
      for (let ring = 0; ring < rings; ring++) {
        const ringRadius = event.data.shockwaveRadius * (0.7 + ring * 0.1)
        const ringIntensity =
          intensity *
          (0.5 - ring * 0.1) *
          Math.sin(progress * Math.PI * 4 + ring)

        if (ringIntensity > 0) {
          this.ctx.strokeStyle = `rgba(100, 200, 255, ${ringIntensity * 0.6})`
          this.ctx.lineWidth = 2 + ring
          this.ctx.beginPath()
          this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2)
          this.ctx.stroke()
        }
      }
    }
  }
  drawShockwaveRings()
  const drawSupernovaSparks = () => {
    if (progress > 0.2) {
      const sparkCount = 12 + Math.floor(progress * 20)
      for (let i = 0; i < sparkCount; i++) {
        const angle = (i / sparkCount) * Math.PI * 2 + this.time * 2
        const distance =
          coreSize * (1 + progress * 2) * (0.8 + Math.random() * 0.4)
        const sparkSize = 2 + Math.random() * 4

        const sparkX = Math.cos(angle) * distance
        const sparkY = Math.sin(angle) * distance

        const sparkGradient = this.ctx.createRadialGradient(
          sparkX,
          sparkY,
          0,
          sparkX,
          sparkY,
          sparkSize
        )
        sparkGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.8})`)
        sparkGradient.addColorStop(1, 'transparent')

        this.ctx.fillStyle = sparkGradient
        this.ctx.beginPath()
        this.ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2)
        this.ctx.fill()
      }
    }
  }
  drawSupernovaSparks()

  this.ctx.restore()
}
