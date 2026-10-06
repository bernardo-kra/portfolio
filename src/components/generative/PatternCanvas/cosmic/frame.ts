import type { CosmicEngine } from './CosmicEngine'
export function render(
  this: CosmicEngine,
  timestamp: number,
  pauseGeneration: boolean = false
): void {
  void pauseGeneration
  this.time += (timestamp * 0.001 - this.time) * this.settings.timeSpeed
  if (this.blackHoleCooldown > 0) {
    this.blackHoleCooldown -= 1
  }
  this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
  this.ctx.fillRect(0, 0, this.width, this.height)
  this.renderAmbientParticles()
  this.renderAdvancedAstronomicalElements()
  this.handleMeteorEvents()
  this.handleSpaceEvents()
  this.updateAsteroids()
  this.updateComets()
  this.renderAsteroids()
  this.renderComets()
  this.updateSpaceEvents()
  this.renderSpaceEvents()
  spawnRarePhenomena.call(this)
}
function spawnRarePhenomena(this: CosmicEngine): void {
  if (this.time % 5 < 0.1) {
    if (Math.random() < 0.001) {
      this.createBurst()
    }
    if (Math.random() < 0.0005) {
      this.createBlackHole()
    }
    if (Math.random() < 0.0003) {
      this.createWormhole()
    }
    if (Math.random() < 0.0002) {
      this.createTimeDistortion()
    }
    if (Math.random() < 0.0001) {
      this.createMagneticField()
    }
  }
}
export function renderAdvancedAstronomicalElements(this: CosmicEngine): void {
  this.renderConstellations()
}
