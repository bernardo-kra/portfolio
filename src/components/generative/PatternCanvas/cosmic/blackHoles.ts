import type { CosmicEngine } from './CosmicEngine'
import type { BlackHole } from './particleState'
export function initializeBlackHoles(this: CosmicEngine): void {
  if (Math.random() < 0.15 && this.blackHoleCooldown <= 0) {
    const blackHole = {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      mass: 10 + Math.random() * 40,
      eventHorizon: 8 + Math.random() * 15,
      accretionDisk: {
        innerRadius: 15 + Math.random() * 20,
        outerRadius: 40 + Math.random() * 60,
        temperature: 10000 + Math.random() * 50000,
        rotation: 0.01 + Math.random() * 0.03,
      },
      gravitationalLensing: 20 + Math.random() * 30,
      absorbedMatter: 0,
      maxAbsorption: 50 + Math.random() * 100,
      lifespan: 1000 + Math.random() * 2000,
      age: 0,
      explosionPower: 0,
    }
    this.blackHoles.push(blackHole)
  }
}
export function renderBlackHoles(this: CosmicEngine): void {
  for (let i = this.blackHoles.length - 1; i >= 0; i--) {
    const blackHole = this.blackHoles[i]

    blackHole.age += 1

    this.absorbNearbyElements(blackHole)

    if (
      blackHole.absorbedMatter >= blackHole.maxAbsorption ||
      blackHole.age >= blackHole.lifespan
    ) {
      this.explodeBlackHole(blackHole, i)
      continue
    }

    this.ctx.save()
    this.ctx.translate(blackHole.x, blackHole.y)
    blackHole.accretionDisk.rotation += 0.02
    this.ctx.globalCompositeOperation = 'screen'

    const drawAccretionDisk = () => {
      const diskLayers = 12
      for (let layer = 0; layer < diskLayers; layer++) {
        const layerRadius =
          blackHole.accretionDisk.innerRadius +
          (layer / diskLayers) *
            (blackHole.accretionDisk.outerRadius -
              blackHole.accretionDisk.innerRadius)
        const layerIntensity = 1 - layer / diskLayers
        const rotationOffset = layer * 0.1

        const drawDiskParticles = () => {
          for (let i = 0; i < 16; i++) {
            const angle =
              (i / 16) * Math.PI * 2 +
              blackHole.accretionDisk.rotation +
              rotationOffset
            const spiralOffset = Math.sin(layer * 0.5 + this.time * 2) * 5

            this.ctx.save()
            this.ctx.rotate(angle)
            this.ctx.translate(layerRadius + spiralOffset, 0)

            const temp = blackHole.accretionDisk.temperature * layerIntensity
            const r = Math.min(255, temp / 200)
            const g = Math.min(255, temp / 400)
            const b = Math.min(100, temp / 800)

            const particleGradient = this.ctx.createRadialGradient(
              0,
              0,
              0,
              0,
              0,
              3
            )
            particleGradient.addColorStop(
              0,
              `rgba(${r}, ${g}, ${b}, ${layerIntensity * 0.8})`
            )
            particleGradient.addColorStop(1, 'transparent')

            this.ctx.fillStyle = particleGradient
            this.ctx.beginPath()
            this.ctx.arc(0, 0, 2 + layerIntensity * 2, 0, Math.PI * 2)
            this.ctx.fill()

            this.ctx.restore()
          }
        }
        drawDiskParticles()
      }
    }
    drawAccretionDisk()

    const drawHawkingRadiation = () => {
      this.ctx.globalCompositeOperation = 'source-over'
      const shadowGradient = this.ctx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        blackHole.eventHorizon * 2
      )
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)')
      shadowGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.5)')
      shadowGradient.addColorStop(1, 'transparent')
      this.ctx.fillStyle = shadowGradient
      this.ctx.beginPath()
      this.ctx.arc(0, 0, blackHole.eventHorizon * 2, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      this.ctx.beginPath()
      this.ctx.arc(0, 0, blackHole.eventHorizon, 0, Math.PI * 2)
      this.ctx.fill()
      const hawkingGradient = this.ctx.createRadialGradient(
        0,
        0,
        blackHole.eventHorizon * 0.9,
        0,
        0,
        blackHole.eventHorizon * 1.2
      )
      hawkingGradient.addColorStop(0, 'transparent')
      hawkingGradient.addColorStop(1, 'rgba(150, 150, 255, 0.3)')
      this.ctx.fillStyle = hawkingGradient
      this.ctx.beginPath()
      this.ctx.arc(0, 0, blackHole.eventHorizon * 1.2, 0, Math.PI * 2)
      this.ctx.fill()
    }
    drawHawkingRadiation()
    const lensingRings = 3
    const drawLensingRings = () => {
      for (let ring = 0; ring < lensingRings; ring++) {
        const ringRadius = blackHole.eventHorizon * (1.5 + ring * 0.8)
        const ringIntensity = 0.1 - ring * 0.02

        this.ctx.strokeStyle = `rgba(100, 150, 255, ${ringIntensity})`
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2)
        this.ctx.stroke()
      }
    }
    drawLensingRings()

    this.ctx.restore()
  }
}
export function explodeBlackHole(
  this: CosmicEngine,
  blackHole: BlackHole,
  index: number
): void {
  const explosionSize = blackHole.absorbedMatter * 2

  for (let i = 0; i < explosionSize; i++) {
    const angle = (i / explosionSize) * Math.PI * 2
    const distance = 20 + Math.random() * 100
    const speed = 2 + Math.random() * 8

    this.spaceEvents.push({
      type: 'supernova',
      x: blackHole.x + Math.cos(angle) * distance,
      y: blackHole.y + Math.sin(angle) * distance,
      life: 0,
      maxLife: 100 + Math.random() * 200,
      intensity: 1,
      size: 15 + Math.random() * 25,
      color: { r: 255, g: 255, b: 255 },
      data: {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        phase: Math.random() * Math.PI * 2,
        rings: 3 + Math.floor(Math.random() * 4),
        shockwaveRadius: 0,
      },
    })
  }

  this.blackHoles.splice(index, 1)
  this.blackHoleCooldown = 18000
  this.lastBlackHoleExplosion = this.time
}
