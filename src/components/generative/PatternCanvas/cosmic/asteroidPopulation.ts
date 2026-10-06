import type { Asteroid } from './particleState'
import type { CosmicEngine } from './CosmicEngine'
export function initializeAsteroids(this: CosmicEngine): void {
  const asteroidCount = Math.floor(20 * this.settings.asteroidDensity)
  for (let i = 0; i < asteroidCount; i++) {
    const types: Asteroid['type'][] = [
      'rocky',
      'metallic',
      'carbonaceous',
      'icy',
    ]
    const type = types[Math.floor(Math.random() * types.length)]

    let color = { r: 100, g: 100, b: 100 }
    switch (type) {
      case 'rocky':
        color = { r: 120, g: 100, b: 80 }
        break
      case 'metallic':
        color = { r: 150, g: 150, b: 160 }
        break
      case 'carbonaceous':
        color = { r: 80, g: 60, b: 40 }
        break
      case 'icy':
        color = { r: 200, g: 220, b: 240 }
        break
    }

    this.asteroids.push({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 2 + Math.random() * 6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      type: type,
      brightness: 0.3 + Math.random() * 0.4,
      color: color,
      trail: [],
      life: 0,
      maxLife: 3000 + Math.random() * 2000,
    })
  }
}
export function updateAsteroids(this: CosmicEngine): void {
  for (let i = this.asteroids.length - 1; i >= 0; i--) {
    const asteroid = this.asteroids[i]
    asteroid.life++

    if (asteroid.life >= asteroid.maxLife) {
      this.asteroids.splice(i, 1)
      continue
    }

    asteroid.x += asteroid.vx
    asteroid.y += asteroid.vy
    asteroid.rotation += asteroid.rotationSpeed

    if (
      asteroid.x < -50 ||
      asteroid.x > this.width + 50 ||
      asteroid.y < -50 ||
      asteroid.y > this.height + 50
    ) {
      asteroid.x = Math.random() * this.width
      asteroid.y = Math.random() * this.height
      asteroid.vx = (Math.random() - 0.5) * 0.5
      asteroid.vy = (Math.random() - 0.5) * 0.5
    }

    asteroid.trail.push({
      x: asteroid.x,
      y: asteroid.y,
      opacity: 1,
    })

    if (asteroid.trail.length > 10) {
      asteroid.trail.shift()
    }

    asteroid.trail.forEach((point) => {
      point.opacity *= 0.9
    })
  }
}
export function renderAsteroids(this: CosmicEngine): void {
  this.asteroids.forEach((asteroid) => {
    this.ctx.save()
    this.ctx.translate(asteroid.x, asteroid.y)
    this.ctx.rotate(asteroid.rotation)
    const { r, g, b } = asteroid.color
    const alpha = asteroid.brightness * (1 - asteroid.life / asteroid.maxLife)

    const drawAsteroidBody = () => {
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      this.ctx.strokeStyle = `rgba(${r * 0.7}, ${g * 0.7}, ${b * 0.7}, ${alpha * 0.8})`
      this.ctx.lineWidth = 1
      this.ctx.beginPath()
      this.ctx.moveTo(-asteroid.size, -asteroid.size * 0.5)
      this.ctx.lineTo(asteroid.size * 0.5, -asteroid.size)
      this.ctx.lineTo(asteroid.size, asteroid.size * 0.3)
      this.ctx.lineTo(asteroid.size * 0.3, asteroid.size)
      this.ctx.lineTo(-asteroid.size * 0.5, asteroid.size * 0.7)
      this.ctx.lineTo(-asteroid.size, asteroid.size * 0.2)
      this.ctx.closePath()
      this.ctx.fill()
      this.ctx.stroke()
      this.ctx.restore()
    }
    drawAsteroidBody()

    const drawAsteroidTrail = () => {
      if (asteroid.trail.length > 1) {
        this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`
        this.ctx.lineWidth = 1
        this.ctx.beginPath()

        for (let i = 0; i < asteroid.trail.length - 1; i++) {
          const point = asteroid.trail[i]
          const nextPoint = asteroid.trail[i + 1]

          if (point.opacity > 0.1) {
            this.ctx.globalAlpha = point.opacity * alpha * 0.3
            this.ctx.moveTo(point.x, point.y)
            this.ctx.lineTo(nextPoint.x, nextPoint.y)
          }
        }

        this.ctx.stroke()
        this.ctx.globalAlpha = 1
      }
    }
    drawAsteroidTrail()
  })
}
