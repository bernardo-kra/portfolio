import type { StellarNursery } from './particleState'
import type { CosmicEngine } from './CosmicEngine'
export function initializeStellarNurseries(this: CosmicEngine): void {
  if (Math.random() < 0.3) {
    for (let i = 0; i < 1; i++) {
      const nursery: StellarNursery = {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 80 + Math.random() * 120,
        density: 0.3 + Math.random() * 0.7,
        temperature: 10 + Math.random() * 40,
        age: Math.random() * 1000,
        stars: [],
      }

      const starCount = 8 + Math.floor(Math.random() * 15)
      for (let j = 0; j < starCount; j++) {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * nursery.size
        nursery.stars.push({
          x: nursery.x + Math.cos(angle) * distance,
          y: nursery.y + Math.sin(angle) * distance,
          mass: 0.1 + Math.random() * 2.5,
          age: Math.random() * nursery.age,
          lifecycle: this.getStellarLifecycleStage(Math.random() * nursery.age),
        })
      }
      this.stellarNurseries.push(nursery)
    }
  }
}
export function updateAndRenderStellarNurseries(this: CosmicEngine): void {
  for (let i = this.stellarNurseries.length - 1; i >= 0; i--) {
    const nursery = this.stellarNurseries[i]
    nursery.age += 0.1

    if (nursery.age > 2000) {
      this.stellarNurseries.splice(i, 1)
      continue
    }

    const drawNurseryCloud = () => {
      this.ctx.save()
      this.ctx.globalCompositeOperation = 'screen'
      const gradient = this.ctx.createRadialGradient(
        nursery.x,
        nursery.y,
        0,
        nursery.x,
        nursery.y,
        nursery.size
      )
      gradient.addColorStop(0, `rgba(255, 200, 150, ${nursery.density * 0.3})`)
      gradient.addColorStop(
        0.5,
        `rgba(200, 150, 255, ${nursery.density * 0.2})`
      )
      gradient.addColorStop(1, 'transparent')
      this.ctx.fillStyle = gradient
      this.ctx.beginPath()
      this.ctx.arc(nursery.x, nursery.y, nursery.size, 0, Math.PI * 2)
      this.ctx.fill()
    }
    drawNurseryCloud()

    for (const star of nursery.stars) {
      star.age += 0.05
      star.lifecycle = this.getStellarLifecycleStage(star.age)
      const color = this.getStellarLifecycleColor(star.lifecycle)
      const size = this.getStellarLifecycleSize(star.lifecycle, star.mass)

      this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`
      this.ctx.beginPath()
      this.ctx.arc(star.x, star.y, size, 0, Math.PI * 2)
      this.ctx.fill()
      const drawStellarExplosion = () => {
        if (star.lifecycle === 'supernova') {
          const explosionRadius = size * (2 + Math.sin(this.time * 10) * 0.5)
          const explosionGradient = this.ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            explosionRadius
          )
          explosionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
          explosionGradient.addColorStop(0.3, 'rgba(255, 150, 0, 0.7)')
          explosionGradient.addColorStop(0.6, 'rgba(255, 50, 50, 0.4)')
          explosionGradient.addColorStop(1, 'transparent')

          this.ctx.fillStyle = explosionGradient
          this.ctx.beginPath()
          this.ctx.arc(star.x, star.y, explosionRadius, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
      drawStellarExplosion()
    }

    this.ctx.restore()
  }
}
