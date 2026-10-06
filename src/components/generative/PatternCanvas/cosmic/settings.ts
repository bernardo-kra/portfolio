import type { CosmicEngine } from './CosmicEngine'
import type { CosmicSettings } from './particleState'
export function updateSettings(
  this: CosmicEngine,
  newSettings: Partial<CosmicSettings>
): void {
  this.settings = { ...this.settings, ...newSettings }
  this.regenerateElements()
}
export function regenerateElements(this: CosmicEngine): void {
  this.cosmicDust = []
  this.nebulae = []
  this.stars = []
  this.constellations = []
  this.asteroids = []
  this.comets = []
  this.initializeAmbientParticles()
  this.initElements()
  this.initializeAdvancedAstronomicalElements()
  this.initializeAsteroids()
  this.initializeComets()
}
export function getColorPalette(this: CosmicEngine): string[] {
  const palettes: Record<string, string[]> = {
    nebula: ['#ff6b9d', '#c44569', '#f8b500', '#4ecdc4'],
    aurora: ['#00d4aa', '#00a8cc', '#ff6b6b', '#4ecdc4'],
    supernova: ['#ff4757', '#ffa502', '#ff6348', '#ff7675'],
    cosmic: ['#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'],
    galaxy: ['#2d3436', '#636e72', '#74b9ff', '#0984e3'],
    stellar: ['#ffffff', '#f1c40f', '#e74c3c', '#9b59b6'],
  }
  return palettes[this.settings.colorPalette] || palettes.nebula
}
