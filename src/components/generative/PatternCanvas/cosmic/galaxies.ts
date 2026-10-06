import type { CosmicEngine } from './CosmicEngine'
import type { Galaxy } from './particleState'
export function initializeGalaxies(this: CosmicEngine): void {
  if (Math.random() < 0.2) {
    this.galaxies.push({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      type:
        Math.random() < 0.6
          ? 'spiral'
          : Math.random() < 0.8
            ? 'elliptical'
            : 'irregular',
      size: 150 + Math.random() * 200,
      rotation: 0.001 + Math.random() * 0.005,
      arms: 2 + Math.floor(Math.random() * 4),
      merging: Math.random() < 0.2,
      mergeProgress: 0,
    })
  }

  if (this.galaxies.length >= 2 && this.galaxies[0].merging) {
    this.galaxies[0].mergeTarget = 1
  }
}
export function updateAndRenderGalaxies(this: CosmicEngine): void {
  for (let i = this.galaxies.length - 1; i >= 0; i--) {
    const galaxy = this.galaxies[i]
    galaxy.rotation += 0.001

    if (Math.random() < 0.0001) {
      this.galaxies.splice(i, 1)
      continue
    }

    const advanceGalaxyMerger = () => {
      if (galaxy.merging && galaxy.mergeTarget !== undefined) {
        const target = this.galaxies[galaxy.mergeTarget]
        if (target) {
          galaxy.mergeProgress = (galaxy.mergeProgress || 0) + 0.001
          const dx = target.x - galaxy.x
          const dy = target.y - galaxy.y
          galaxy.x += dx * galaxy.mergeProgress * 0.1
          galaxy.y += dy * galaxy.mergeProgress * 0.1
        }
      }
    }
    advanceGalaxyMerger()

    this.ctx.save()
    this.ctx.translate(galaxy.x, galaxy.y)
    this.ctx.rotate(galaxy.rotation)

    if (galaxy.type === 'spiral') {
      this.renderSpiralGalaxy(galaxy)
    } else if (galaxy.type === 'elliptical') {
      this.renderEllipticalGalaxy(galaxy)
    } else {
      this.renderIrregularGalaxy(galaxy)
    }

    this.ctx.restore()
  }
}
export function renderSpiralGalaxy(this: CosmicEngine, galaxy: Galaxy): void {
  const coreGradient = this.ctx.createRadialGradient(
    0,
    0,
    0,
    0,
    0,
    galaxy.size * 0.3
  )
  coreGradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)')
  coreGradient.addColorStop(1, 'rgba(255, 200, 100, 0.2)')
  this.ctx.fillStyle = coreGradient
  this.ctx.beginPath()
  this.ctx.arc(0, 0, galaxy.size * 0.3, 0, Math.PI * 2)
  this.ctx.fill()

  const drawSpiralArms = () => {
    for (let arm = 0; arm < galaxy.arms; arm++) {
      const armAngle = (arm / galaxy.arms) * Math.PI * 2
      this.ctx.strokeStyle = `rgba(150, 150, 255, 0.3)`
      this.ctx.lineWidth = 3
      this.ctx.beginPath()

      for (let r = galaxy.size * 0.3; r < galaxy.size; r += 5) {
        const angle = armAngle + (r / galaxy.size) * Math.PI * 4
        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r

        if (r === galaxy.size * 0.3) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }

        if (Math.random() < 0.1) {
          this.ctx.fillStyle = `rgba(200, 200, 255, ${0.3 + Math.random() * 0.4})`
          this.ctx.beginPath()
          this.ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
      this.ctx.stroke()
    }
  }
  drawSpiralArms()
}
export function renderEllipticalGalaxy(
  this: CosmicEngine,
  galaxy: Galaxy
): void {
  const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size)
  gradient.addColorStop(0, 'rgba(255, 200, 100, 0.6)')
  gradient.addColorStop(0.5, 'rgba(200, 150, 100, 0.3)')
  gradient.addColorStop(1, 'transparent')

  this.ctx.fillStyle = gradient
  this.ctx.save()
  this.ctx.scale(1, 0.6)
  this.ctx.beginPath()
  this.ctx.arc(0, 0, galaxy.size, 0, Math.PI * 2)
  this.ctx.fill()
  this.ctx.restore()
}
export function renderIrregularGalaxy(
  this: CosmicEngine,
  galaxy: Galaxy
): void {
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * galaxy.size
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance

    this.ctx.fillStyle = `rgba(150, 200, 255, ${0.2 + Math.random() * 0.4})`
    this.ctx.beginPath()
    this.ctx.arc(x, y, 1 + Math.random() * 3, 0, Math.PI * 2)
    this.ctx.fill()
  }
}
