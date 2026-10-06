import type { PlanetarySystem } from './particleState'
import type { CosmicEngine } from './CosmicEngine'
export function initializePlanetarySystems(this: CosmicEngine): void {
  if (Math.random() < 0.4) {
    const system: PlanetarySystem = {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      star: {
        mass: 0.5 + Math.random() * 2,
        temperature: 3000 + Math.random() * 4000,
        age: Math.random() * 10000,
      },
      protoplanetaryDisk: {
        innerRadius: 20 + Math.random() * 30,
        outerRadius: 60 + Math.random() * 80,
        density: 0.2 + Math.random() * 0.6,
        particles: [],
      },
      planets: [],
    }

    const particleCount = 200 + Math.floor(Math.random() * 300)
    for (let j = 0; j < particleCount; j++) {
      system.protoplanetaryDisk.particles.push({
        angle: Math.random() * Math.PI * 2,
        distance:
          system.protoplanetaryDisk.innerRadius +
          Math.random() *
            (system.protoplanetaryDisk.outerRadius -
              system.protoplanetaryDisk.innerRadius),
        size: 0.5 + Math.random() * 2,
      })
    }

    const planetCount = 2 + Math.floor(Math.random() * 5)
    for (let j = 0; j < planetCount; j++) {
      const distance = system.protoplanetaryDisk.outerRadius + 20 + j * 30
      system.planets.push({
        distance: distance,
        size: 2 + Math.random() * 8,
        angle: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.003,
      })
    }

    this.planetarySystems.push(system)
  }
}
export function updateAndRenderPlanetarySystems(this: CosmicEngine): void {
  for (let i = this.planetarySystems.length - 1; i >= 0; i--) {
    const system = this.planetarySystems[i]
    system.star.age += 0.5

    if (system.star.age > 15000) {
      this.planetarySystems.splice(i, 1)
      continue
    }
    const drawHostStar = () => {
      this.ctx.save()
      this.ctx.fillStyle = `rgba(255, 255, 200, 0.8)`
      this.ctx.beginPath()
      this.ctx.arc(system.x, system.y, 3, 0, Math.PI * 2)
      this.ctx.fill()
    }
    drawHostStar()

    const advanceAndDrawDisk = () => {
      for (const particle of system.protoplanetaryDisk.particles) {
        particle.angle += 0.001 + (1 / particle.distance) * 0.0005

        const x = system.x + Math.cos(particle.angle) * particle.distance
        const y = system.y + Math.sin(particle.angle) * particle.distance

        this.ctx.fillStyle = `rgba(200, 150, 100, ${system.protoplanetaryDisk.density * 0.3})`
        this.ctx.beginPath()
        this.ctx.arc(x, y, particle.size * 0.5, 0, Math.PI * 2)
        this.ctx.fill()
      }
    }
    advanceAndDrawDisk()

    for (const planet of system.planets) {
      planet.angle += planet.speed

      const x = system.x + Math.cos(planet.angle) * planet.distance
      const y = system.y + Math.sin(planet.angle) * planet.distance

      this.ctx.fillStyle = 'rgba(100, 150, 200, 0.8)'
      this.ctx.beginPath()
      this.ctx.arc(x, y, planet.size, 0, Math.PI * 2)
      this.ctx.fill()
    }

    this.ctx.restore()
  }
}
