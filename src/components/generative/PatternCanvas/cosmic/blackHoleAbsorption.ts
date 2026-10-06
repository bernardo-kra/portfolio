import type { CosmicEngine } from './CosmicEngine'
import type { BlackHole } from './particleState'
export function absorbNearbyElements(
  this: CosmicEngine,
  blackHole: BlackHole
): void {
  const absorptionRadius = blackHole.gravitationalLensing
  absorbElements.call(this, blackHole, absorptionRadius)
  absorbStars.call(this, blackHole, absorptionRadius)
  absorbCosmicDust.call(this, blackHole, absorptionRadius)
  absorbMeteors.call(this, blackHole, absorptionRadius)
  absorbSpaceEvents.call(this, blackHole, absorptionRadius)
  absorbPlanetarySystems.call(this, blackHole, absorptionRadius)
  absorbStellarNurseries.call(this, blackHole, absorptionRadius)
  absorbGalaxies.call(this, blackHole, absorptionRadius)
  absorbNebulae.call(this, blackHole, absorptionRadius)
}
function absorbElements(
  this: CosmicEngine,
  blackHole: BlackHole,
  absorptionRadius: number
): void {
  for (let i = this.elements.length - 1; i >= 0; i--) {
    const element = this.elements[i]
    const dx = element.x - blackHole.x
    const dy = element.y - blackHole.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < absorptionRadius) {
      const force = (blackHole.mass / (distance + 1)) * 0.1
      element.vx += (dx / distance) * -force
      element.vy += (dy / distance) * -force

      if (distance < blackHole.eventHorizon) {
        blackHole.absorbedMatter += element.size || 1
        this.elements.splice(i, 1)
      }
    }
  }
}
function absorbStars(
  this: CosmicEngine,
  blackHole: BlackHole,
  absorptionRadius: number
): void {
  void absorptionRadius
  for (let i = this.stars.length - 1; i >= 0; i--) {
    const star = this.stars[i]
    const dx = star.x - blackHole.x
    const dy = star.y - blackHole.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < blackHole.eventHorizon * 2) {
      blackHole.absorbedMatter += 2
      this.stars.splice(i, 1)
    }
  }
}
function absorbCosmicDust(
  this: CosmicEngine,
  blackHole: BlackHole,
  absorptionRadius: number
): void {
  for (let i = this.cosmicDust.length - 1; i >= 0; i--) {
    const dust = this.cosmicDust[i]
    const dx = dust.x - blackHole.x
    const dy = dust.y - blackHole.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < absorptionRadius) {
      dust.vx += (dx / distance) * -0.02
      dust.vy += (dy / distance) * -0.02

      if (distance < blackHole.eventHorizon * 1.5) {
        blackHole.absorbedMatter += 0.1
        this.cosmicDust.splice(i, 1)
      }
    }
  }
}
function absorbMeteors(
  this: CosmicEngine,
  blackHole: BlackHole,
  absorptionRadius: number
): void {
  for (let i = this.meteors.length - 1; i >= 0; i--) {
    const meteor = this.meteors[i]
    const dx = meteor.x - blackHole.x
    const dy = meteor.y - blackHole.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < absorptionRadius) {
      const force = (blackHole.mass / (distance + 1)) * 0.2
      meteor.vx += (dx / distance) * -force
      meteor.vy += (dy / distance) * -force

      if (distance < blackHole.eventHorizon * 1.5) {
        blackHole.absorbedMatter += 1
        this.meteors.splice(i, 1)
      }
    }
  }
}
function absorbSpaceEvents(
  this: CosmicEngine,
  blackHole: BlackHole,
  absorptionRadius: number
): void {
  for (let i = this.spaceEvents.length - 1; i >= 0; i--) {
    const event = this.spaceEvents[i]
    const dx = event.x - blackHole.x
    const dy = event.y - blackHole.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < absorptionRadius * 0.8) {
      if (distance < blackHole.eventHorizon * 2) {
        blackHole.absorbedMatter += event.size || 2
        this.spaceEvents.splice(i, 1)
      }
    }
  }
}
function absorbPlanetarySystems(
  this: CosmicEngine,
  blackHole: BlackHole,
  absorptionRadius: number
): void {
  for (let i = this.planetarySystems.length - 1; i >= 0; i--) {
    const system = this.planetarySystems[i]
    const dx = system.x - blackHole.x
    const dy = system.y - blackHole.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < absorptionRadius * 0.6) {
      if (distance < blackHole.eventHorizon * 3) {
        blackHole.absorbedMatter += 5 + system.planets.length * 2
        this.planetarySystems.splice(i, 1)
      }
    }
  }
}
function absorbStellarNurseries(
  this: CosmicEngine,
  blackHole: BlackHole,
  absorptionRadius: number
): void {
  for (let i = this.stellarNurseries.length - 1; i >= 0; i--) {
    const nursery = this.stellarNurseries[i]
    const dx = nursery.x - blackHole.x
    const dy = nursery.y - blackHole.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < absorptionRadius * 0.7) {
      if (distance < blackHole.eventHorizon * 4) {
        blackHole.absorbedMatter += 10 + nursery.stars.length
        this.stellarNurseries.splice(i, 1)
      }
    }
  }
}
function absorbGalaxies(
  this: CosmicEngine,
  blackHole: BlackHole,
  absorptionRadius: number
): void {
  for (let i = this.galaxies.length - 1; i >= 0; i--) {
    const galaxy = this.galaxies[i]
    const dx = galaxy.x - blackHole.x
    const dy = galaxy.y - blackHole.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < absorptionRadius * 0.4) {
      if (distance < blackHole.eventHorizon * 5) {
        blackHole.absorbedMatter += 50
        this.galaxies.splice(i, 1)
      }
    }
  }
}
function absorbNebulae(
  this: CosmicEngine,
  blackHole: BlackHole,
  absorptionRadius: number
): void {
  for (let i = this.nebulae.length - 1; i >= 0; i--) {
    const nebula = this.nebulae[i]
    const dx = nebula.x - blackHole.x
    const dy = nebula.y - blackHole.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < absorptionRadius) {
      nebula.vx += (dx / distance) * -0.01
      nebula.vy += (dy / distance) * -0.01

      if (distance < blackHole.eventHorizon * 2) {
        blackHole.absorbedMatter += 1
        this.nebulae.splice(i, 1)
      }
    }
  }
}
