import type { CosmicEngine } from './CosmicEngine'
import type { Star } from './particleState'
export function initializeAmbientParticles(this: CosmicEngine): void {
  const dustCount = Math.floor(80 * this.settings.dustDensity)
  for (let i = 0; i < dustCount; i++) {
    this.cosmicDust.push({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      size: 0.3 + Math.random() * 0.8,
      opacity: 0.05 + Math.random() * 0.2,
      twinkle: Math.random() * Math.PI * 2,
    })
  }

  const nebulaCount = Math.floor(3 * this.settings.nebulaDensity)
  for (let i = 0; i < nebulaCount; i++) {
    this.nebulae.push({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      size: 60 + Math.random() * 100,
      hue: Math.random() * 360,
      opacity: 0.02 + Math.random() * 0.08,
      pulsePhase: Math.random() * Math.PI * 2,
    })
  }

  const starCount = Math.floor(50 * this.settings.starDensity)
  for (let i = 0; i < starCount; i++) {
    const starType = this.getRandomStarType()
    const temperature = this.getStarTemperature(starType)
    const color = this.temperatureToColor(temperature)
    const distance = Math.random()

    this.stars.push({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: this.getStarSize(starType, distance),
      brightness: this.getStarBrightness(starType, distance),
      twinkleSpeed: this.getTwinkleSpeed(distance),
      twinklePhase: Math.random() * Math.PI * 2,
      temperature: temperature,
      starType: starType,
      color: color,
      distance: distance,
      depth: distance * 100,
    })
  }
}
export function renderAmbientParticles(this: CosmicEngine): void {
  this.renderStars()
}
export function renderNebulae(this: CosmicEngine): void {
  // Removido - não renderizar nebulosas
}
export function renderStars(this: CosmicEngine): void {
  this.ctx.save()

  this.stars.forEach((star) => {
    star.twinklePhase += star.twinkleSpeed * 0.008

    const atmosphericTwinkle = 0.7 + Math.sin(star.twinklePhase) * 0.3
    const scintillation = 0.9 + Math.sin(star.twinklePhase * 3.7) * 0.1
    const currentBrightness =
      star.brightness * atmosphericTwinkle * scintillation

    const intensity = Math.min(1, currentBrightness)

    this.renderConstellationStar(star, intensity)
  })

  this.ctx.restore()
}
export function renderConstellationStar(
  this: CosmicEngine,
  star: Star,
  intensity: number
): void {
  const { r, g, b } = star.color
  const alpha = intensity * (0.4 + star.distance * 0.6)

  this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
  this.ctx.beginPath()
  this.ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2)
  this.ctx.fill()
}
export function renderRegularStar(
  this: CosmicEngine,
  star: Star,
  intensity: number
): void {
  void star
  void intensity

  // Removido - não renderizar estrelas individuais
}
export function renderCosmicDust(this: CosmicEngine): void {
  // Removido - não renderizar poeira cósmica
}
