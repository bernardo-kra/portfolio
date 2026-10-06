import type { CosmicEngine } from './CosmicEngine'
export function initializeAdvancedAstronomicalElements(
  this: CosmicEngine
): void {
  this.initializeStellarNurseries()
  this.initializeConstellations()
  this.initializePlanetarySystems()
  this.initializeDarkMatter()
  this.initializeBlackHoles()
  this.initializeGalaxies()
  this.initializeQuasars()
  this.initializeMagnetars()
}
export function initializeDarkMatter(this: CosmicEngine): void {
  for (let i = 0; i < 15; i++) {
    this.darkMatterParticles.push({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      mass: 0.5 + Math.random() * 2,
      influence: 5 + Math.random() * 15,
    })
  }
}
export function updateAndRenderDarkMatter(this: CosmicEngine): void {
  for (const particle of this.darkMatterParticles) {
    particle.x += particle.vx
    particle.y += particle.vy

    if (particle.x < 0 || particle.x > this.width) particle.vx *= -1
    if (particle.y < 0 || particle.y > this.height) particle.vy *= -1

    for (const element of this.elements) {
      const dx = particle.x - element.x
      const dy = particle.y - element.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < particle.influence) {
        const force = (particle.mass / (distance + 1)) * 0.001
        element.vx += (dx / distance) * force
        element.vy += (dy / distance) * force
      }
    }
  }
}
export function initializeQuasars(this: CosmicEngine): void {
  if (Math.random() < 0.15) {
    this.quasars.push({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      luminosity: 0.8 + Math.random() * 0.2,
      jetAngle: Math.random() * Math.PI * 2,
      jetLength: 100 + Math.random() * 150,
      jetWidth: 8 + Math.random() * 12,
      pulsation: 0.02 + Math.random() * 0.03,
    })
  }
}
export function renderQuasars(this: CosmicEngine): void {
  for (let i = this.quasars.length - 1; i >= 0; i--) {
    const quasar = this.quasars[i]

    if (Math.random() < 0.0005) {
      this.quasars.splice(i, 1)
      continue
    }
    const drawQuasarCore = () => {
      this.ctx.save()
      this.ctx.translate(quasar.x, quasar.y)
      const pulsation = 0.7 + Math.sin(this.time * quasar.pulsation) * 0.3
      const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 8)
      coreGradient.addColorStop(
        0,
        `rgba(255, 255, 255, ${quasar.luminosity * pulsation})`
      )
      coreGradient.addColorStop(
        0.5,
        `rgba(100, 200, 255, ${quasar.luminosity * 0.8})`
      )
      coreGradient.addColorStop(1, 'transparent')
      this.ctx.fillStyle = coreGradient
      this.ctx.beginPath()
      this.ctx.arc(0, 0, 8, 0, Math.PI * 2)
      this.ctx.fill()
    }
    drawQuasarCore()

    this.ctx.rotate(quasar.jetAngle)

    const jetGradient = this.ctx.createLinearGradient(
      0,
      -quasar.jetWidth / 2,
      0,
      quasar.jetWidth / 2
    )
    jetGradient.addColorStop(0, 'transparent')
    jetGradient.addColorStop(
      0.5,
      `rgba(255, 100, 255, ${quasar.luminosity * 0.6})`
    )
    jetGradient.addColorStop(1, 'transparent')

    this.ctx.fillStyle = jetGradient
    this.ctx.fillRect(
      0,
      -quasar.jetWidth / 2,
      quasar.jetLength,
      quasar.jetWidth
    )
    this.ctx.fillRect(
      -quasar.jetLength,
      -quasar.jetWidth / 2,
      quasar.jetLength,
      quasar.jetWidth
    )

    this.ctx.restore()
  }
}
export function initializeMagnetars(this: CosmicEngine): void {
  if (Math.random() < 0.1) {
    this.magnetars.push({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      magneticField: 1000 + Math.random() * 9000,
      pulsePeriod: 0.1 + Math.random() * 2,
      phaseOffset: Math.random() * Math.PI * 2,
      flareIntensity: 0.5 + Math.random() * 0.5,
      lastFlare: 0,
    })
  }
}
export function renderMagnetars(this: CosmicEngine): void {
  for (let i = this.magnetars.length - 1; i >= 0; i--) {
    const magnetar = this.magnetars[i]

    if (Math.random() < 0.0002) {
      this.magnetars.splice(i, 1)
      continue
    }
    this.ctx.save()
    this.ctx.translate(magnetar.x, magnetar.y)
    const pulsePhase =
      (this.time / magnetar.pulsePeriod + magnetar.phaseOffset) % (Math.PI * 2)
    const pulseBrightness = 0.3 + Math.sin(pulsePhase) * 0.7

    this.ctx.fillStyle = `rgba(0, 255, 255, ${pulseBrightness})`
    this.ctx.beginPath()
    this.ctx.arc(0, 0, 2, 0, Math.PI * 2)
    this.ctx.fill()
    const fieldLines = 8
    const drawMagneticField = () => {
      for (let i = 0; i < fieldLines; i++) {
        const angle = (i / fieldLines) * Math.PI * 2
        const fieldStrength = magnetar.magneticField / 10000

        this.ctx.strokeStyle = `rgba(255, 0, 255, ${fieldStrength * pulseBrightness * 0.3})`
        this.ctx.lineWidth = 1
        this.ctx.beginPath()

        for (let r = 5; r < 30; r += 2) {
          const fieldAngle = angle + Math.sin(r * 0.1) * 0.5
          const x = Math.cos(fieldAngle) * r
          const y = Math.sin(fieldAngle) * r

          if (r === 5) {
            this.ctx.moveTo(x, y)
          } else {
            this.ctx.lineTo(x, y)
          }
        }
        this.ctx.stroke()
      }
    }
    drawMagneticField()

    const drawMagnetarFlare = () => {
      if (this.time - magnetar.lastFlare > 100 && Math.random() < 0.001) {
        magnetar.lastFlare = this.time

        const flareGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 50)
        flareGradient.addColorStop(
          0,
          `rgba(255, 255, 255, ${magnetar.flareIntensity})`
        )
        flareGradient.addColorStop(
          0.3,
          `rgba(255, 100, 0, ${magnetar.flareIntensity * 0.7})`
        )
        flareGradient.addColorStop(1, 'transparent')

        this.ctx.fillStyle = flareGradient
        this.ctx.beginPath()
        this.ctx.arc(0, 0, 50, 0, Math.PI * 2)
        this.ctx.fill()
      }
    }
    drawMagnetarFlare()

    this.ctx.restore()
  }
}
