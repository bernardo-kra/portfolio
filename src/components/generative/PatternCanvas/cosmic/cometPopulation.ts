import type { CosmicEngine } from './CosmicEngine'
export function initializeComets(this: CosmicEngine): void {
  const cometCount = Math.floor(3 * this.settings.cometDensity)
  for (let i = 0; i < cometCount; i++) {
    const orbitCenter = {
      x: this.width * 0.5 + (Math.random() - 0.5) * this.width * 0.3,
      y: this.height * 0.5 + (Math.random() - 0.5) * this.height * 0.3,
    }

    this.comets.push({
      x: orbitCenter.x + (Math.random() - 0.5) * 200,
      y: orbitCenter.y + (Math.random() - 0.5) * 200,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 3 + Math.random() * 4,
      nucleusSize: 1 + Math.random() * 2,
      tailLength: 50 + Math.random() * 100,
      tailAngle: Math.random() * Math.PI * 2,
      brightness: 0.4 + Math.random() * 0.4,
      color: { r: 200, g: 220, b: 255 },
      tail: [],
      life: 0,
      maxLife: 5000 + Math.random() * 3000,
      orbitCenter: orbitCenter,
      orbitRadius: 100 + Math.random() * 200,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitSpeed: 0.01 + Math.random() * 0.02,
    })
  }
}
export function updateComets(this: CosmicEngine): void {
  for (let i = this.comets.length - 1; i >= 0; i--) {
    const comet = this.comets[i]
    comet.life++

    if (comet.life >= comet.maxLife) {
      this.comets.splice(i, 1)
      continue
    }

    comet.orbitAngle += comet.orbitSpeed

    const orbitX =
      comet.orbitCenter.x + Math.cos(comet.orbitAngle) * comet.orbitRadius
    const orbitY =
      comet.orbitCenter.y + Math.sin(comet.orbitAngle) * comet.orbitRadius

    comet.x += (orbitX - comet.x) * 0.02
    comet.y += (orbitY - comet.y) * 0.02

    comet.vx = (orbitX - comet.x) * 0.1
    comet.vy = (orbitY - comet.y) * 0.1

    comet.tailAngle = Math.atan2(comet.vy, comet.vx) + Math.PI

    comet.tail.push({
      x: comet.x,
      y: comet.y,
      opacity: 1,
      size: comet.nucleusSize * (0.5 + Math.random() * 0.5),
    })

    if (comet.tail.length > 20) {
      comet.tail.shift()
    }

    comet.tail.forEach((point) => {
      point.opacity *= 0.95
      point.size *= 0.98
    })
  }
}
export function renderComets(this: CosmicEngine): void {
  this.comets.forEach((comet) => {
    this.ctx.save()
    this.ctx.translate(comet.x, comet.y)

    const { r, g, b } = comet.color
    const alpha = comet.brightness * (1 - comet.life / comet.maxLife)

    const drawCometNucleus = () => {
      const nucleusGradient = this.ctx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        comet.nucleusSize
      )
      nucleusGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
      nucleusGradient.addColorStop(
        0.5,
        `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`
      )
      nucleusGradient.addColorStop(
        1,
        `rgba(${r * 0.5}, ${g * 0.5}, ${b * 0.5}, ${alpha * 0.4})`
      )
      this.ctx.fillStyle = nucleusGradient
      this.ctx.beginPath()
      this.ctx.arc(0, 0, comet.nucleusSize, 0, Math.PI * 2)
      this.ctx.fill()
    }
    drawCometNucleus()

    const drawCometTail = () => {
      if (comet.tail.length > 1) {
        this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`
        this.ctx.lineWidth = 2
        this.ctx.beginPath()

        for (let i = 0; i < comet.tail.length - 1; i++) {
          const point = comet.tail[i]
          const nextPoint = comet.tail[i + 1]

          if (point.opacity > 0.1) {
            this.ctx.globalAlpha = point.opacity * alpha * 0.6
            this.ctx.lineWidth = point.size
            this.ctx.moveTo(point.x - comet.x, point.y - comet.y)
            this.ctx.lineTo(nextPoint.x - comet.x, nextPoint.y - comet.y)
          }
        }

        this.ctx.stroke()
        this.ctx.globalAlpha = 1
      }
    }
    drawCometTail()

    const comaGradient = this.ctx.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      comet.size
    )
    comaGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`)
    comaGradient.addColorStop(
      0.5,
      `rgba(${r * 0.7}, ${g * 0.7}, ${b * 0.7}, ${alpha * 0.2})`
    )
    comaGradient.addColorStop(1, 'transparent')

    this.ctx.fillStyle = comaGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, comet.size, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.restore()
  })
}
