import type { CosmicEngine } from './CosmicEngine'
import type { Meteor } from './particleState'
export function updateMeteors(this: CosmicEngine): void {
  this.meteors = this.meteors.filter((meteor) => {
    meteor.x += meteor.vx
    meteor.y += meteor.vy
    meteor.life++

    meteor.trail.unshift({
      x: meteor.x,
      y: meteor.y,
      opacity: meteor.brightness,
    })

    if (meteor.trail.length > 20) {
      meteor.trail.pop()
    }

    meteor.trail.forEach((point) => {
      point.opacity *= 0.92
    })

    const isOutOfBounds =
      meteor.x < -50 ||
      meteor.x > this.width + 50 ||
      meteor.y < -50 ||
      meteor.y > this.height + 50
    const isExpired = meteor.life > meteor.maxLife

    return !isOutOfBounds && !isExpired
  })
}
export function renderMeteors(this: CosmicEngine): void {
  this.ctx.save()

  this.meteors.forEach((meteor) => {
    this.renderMeteorTrail(meteor)
    this.renderMeteorHead(meteor)

    if (meteor.type === 'fireball' || meteor.type === 'bolide') {
      this.renderMeteorGlow(meteor)
    }
  })

  this.ctx.restore()
}
export function renderMeteorTrail(this: CosmicEngine, meteor: Meteor): void {
  if (meteor.trail.length < 2) return

  this.ctx.strokeStyle = `rgba(${meteor.color.r}, ${meteor.color.g}, ${meteor.color.b}, 0.6)`
  this.ctx.lineWidth = meteor.size * 0.8
  this.ctx.lineCap = 'round'

  const gradient = this.ctx.createLinearGradient(
    meteor.trail[0].x,
    meteor.trail[0].y,
    meteor.trail[meteor.trail.length - 1].x,
    meteor.trail[meteor.trail.length - 1].y
  )

  for (let i = 0; i < meteor.trail.length; i++) {
    const alpha = meteor.trail[i].opacity * (1 - i / meteor.trail.length)
    const stop = i / (meteor.trail.length - 1)
    gradient.addColorStop(
      stop,
      `rgba(${meteor.color.r}, ${meteor.color.g}, ${meteor.color.b}, ${alpha})`
    )
  }

  this.ctx.strokeStyle = gradient
  this.ctx.beginPath()
  this.ctx.moveTo(meteor.trail[0].x, meteor.trail[0].y)

  for (let i = 1; i < meteor.trail.length; i++) {
    this.ctx.lineTo(meteor.trail[i].x, meteor.trail[i].y)
  }

  this.ctx.stroke()
}
export function renderMeteorHead(this: CosmicEngine, meteor: Meteor): void {
  const { r, g, b } = meteor.color
  const alpha = meteor.brightness * (1 - meteor.life / meteor.maxLife)

  this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
  this.ctx.beginPath()
  this.ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2)
  this.ctx.fill()

  if (meteor.type === 'fireball' || meteor.type === 'bolide') {
    const coreGradient = this.ctx.createRadialGradient(
      meteor.x,
      meteor.y,
      0,
      meteor.x,
      meteor.y,
      meteor.size
    )
    coreGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
    coreGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`)
    coreGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`)

    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2)
    this.ctx.fill()
  }
}
export function renderMeteorGlow(this: CosmicEngine, meteor: Meteor): void {
  const { r, g, b } = meteor.color
  const alpha = meteor.brightness * 0.3 * (1 - meteor.life / meteor.maxLife)
  const glowSize = meteor.size * (meteor.type === 'bolide' ? 6 : 4)

  const glowGradient = this.ctx.createRadialGradient(
    meteor.x,
    meteor.y,
    0,
    meteor.x,
    meteor.y,
    glowSize
  )
  glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`)
  glowGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`)
  glowGradient.addColorStop(1, 'transparent')

  this.ctx.fillStyle = glowGradient
  this.ctx.beginPath()
  this.ctx.arc(meteor.x, meteor.y, glowSize, 0, Math.PI * 2)
  this.ctx.fill()
}
