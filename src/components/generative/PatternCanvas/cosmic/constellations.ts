import type { Constellation } from './particleState'
import type { CosmicEngine } from './CosmicEngine'
export function initializeConstellations(this: CosmicEngine): void {
  const constellationNames = [
    'Orion',
    'Ursa Major',
    'Cassiopeia',
    'Draco',
    'Cygnus',
  ]

  for (let i = 0; i < 1; i++) {
    const constellation: Constellation = {
      name: constellationNames[i] || `Constellation ${i}`,
      stars: [],
      connections: [],
      visibility: 0.3 + Math.random() * 0.7,
      mythologyHue: Math.random() * 360,
    }

    const starCount = 5 + Math.floor(Math.random() * 8)
    const centerX = Math.random() * this.width
    const centerY = Math.random() * this.height
    const spread = 100 + Math.random() * 150

    for (let j = 0; j < starCount; j++) {
      constellation.stars.push({
        x: centerX + (Math.random() - 0.5) * spread,
        y: centerY + (Math.random() - 0.5) * spread,
        brightness: 0.4 + Math.random() * 0.6,
      })
    }

    for (let j = 0; j < starCount - 1; j++) {
      if (Math.random() < 0.7) {
        constellation.connections.push({ from: j, to: j + 1 })
      }
    }

    this.constellations.push(constellation)
  }
}
export function renderConstellations(this: CosmicEngine): void {
  for (const constellation of this.constellations) {
    constellation.visibility = 0.3 + Math.sin(this.time * 0.5) * 0.4

    this.ctx.save()
    this.ctx.globalAlpha = constellation.visibility

    const drawConstellationLinks = () => {
      for (const connection of constellation.connections) {
        const starA = constellation.stars[connection.from]
        const starB = constellation.stars[connection.to]

        if (starA && starB) {
          this.ctx.strokeStyle = `hsla(${constellation.mythologyHue}, 60%, 70%, 0.4)`
          this.ctx.lineWidth = 1
          this.ctx.beginPath()
          this.ctx.moveTo(starA.x, starA.y)
          this.ctx.lineTo(starB.x, starB.y)
          this.ctx.stroke()
        }
      }
    }
    drawConstellationLinks()

    for (const star of constellation.stars) {
      const twinkle = 0.5 + Math.sin(this.time * 3 + star.x * 0.01) * 0.5
      this.ctx.fillStyle = `hsla(${constellation.mythologyHue}, 80%, 80%, ${star.brightness * twinkle})`
      this.ctx.beginPath()
      this.ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2)
      this.ctx.fill()
    }

    this.ctx.restore()
  }
}
