import type { CosmicEngine } from './CosmicEngine'
import type { Meteor, RGB } from './particleState'
export function handleMeteorEvents(this: CosmicEngine): void {
  if (!this.meteorShowerActive) {
    if (Math.random() < 0.0008) {
      this.startMeteorShower()
    } else if (Math.random() < 0.003) {
      this.createSporadicMeteor()
    }
  } else {
    this.meteorShowerTimer += 1

    if (this.meteorShowerTimer > 300) {
      this.meteorShowerActive = false
      this.meteorShowerTimer = 0
      this.meteorShowerIntensity = 0
    } else {
      const intensity =
        this.meteorShowerIntensity *
        Math.sin((this.meteorShowerTimer / 300) * Math.PI)
      if (Math.random() < intensity) {
        this.createShowerMeteor()
      }
    }
  }

  if (Math.random() < 0.0001) {
    this.createFireball()
  }

  if (Math.random() < 0.00005) {
    this.createBolide()
  }
}
export function startMeteorShower(this: CosmicEngine): void {
  this.meteorShowerActive = true
  this.meteorShowerTimer = 0
  this.meteorShowerIntensity = 0.05 + Math.random() * 0.1
  this.radiant = {
    x: Math.random() * this.width,
    y: Math.random() * this.height * 0.3,
  }
}
export function createSporadicMeteor(this: CosmicEngine): void {
  const meteor = this.createBaseMeteor()
  meteor.type = 'sporadic'
  meteor.size = 1 + Math.random() * 2
  meteor.brightness = 0.6 + Math.random() * 0.4
  meteor.color = this.getRandomMeteorColor()
  this.meteors.push(meteor)
}
export function createShowerMeteor(this: CosmicEngine): void {
  const meteor = this.createBaseMeteor()
  meteor.type = 'shower'

  const angle = Math.atan2(meteor.y - this.radiant.y, meteor.x - this.radiant.x)
  const speed = 8 + Math.random() * 6
  meteor.vx = Math.cos(angle) * speed
  meteor.vy = Math.sin(angle) * speed

  meteor.size = 0.8 + Math.random() * 1.5
  meteor.brightness = 0.5 + Math.random() * 0.3
  meteor.color = this.getShowerMeteorColor()
  this.meteors.push(meteor)
}
export function createFireball(this: CosmicEngine): void {
  const meteor = this.createBaseMeteor()
  meteor.type = 'fireball'
  meteor.size = 3 + Math.random() * 4
  meteor.brightness = 0.9 + Math.random() * 0.1
  meteor.maxLife = 180 + Math.random() * 120
  meteor.color = {
    r: 255,
    g: 150 + Math.random() * 105,
    b: 50 + Math.random() * 100,
  }

  const speed = 6 + Math.random() * 4
  const angle = Math.random() * Math.PI * 2
  meteor.vx = Math.cos(angle) * speed
  meteor.vy = Math.sin(angle) * speed

  this.meteors.push(meteor)
}
export function createBolide(this: CosmicEngine): void {
  const meteor = this.createBaseMeteor()
  meteor.type = 'bolide'
  meteor.size = 5 + Math.random() * 6
  meteor.brightness = 1
  meteor.maxLife = 240 + Math.random() * 180
  meteor.color = { r: 255, g: 255, b: 200 + Math.random() * 55 }

  const speed = 4 + Math.random() * 3
  const angle = Math.random() * Math.PI * 2
  meteor.vx = Math.cos(angle) * speed
  meteor.vy = Math.sin(angle) * speed

  this.meteors.push(meteor)
}
export function createBaseMeteor(this: CosmicEngine): Meteor {
  const side = Math.floor(Math.random() * 4)
  let x, y

  switch (side) {
    case 0:
      x = -20
      y = Math.random() * this.height
      break
    case 1:
      x = this.width + 20
      y = Math.random() * this.height
      break
    case 2:
      x = Math.random() * this.width
      y = -20
      break
    default:
      x = Math.random() * this.width
      y = this.height + 20
      break
  }

  const speed = 5 + Math.random() * 8
  const targetX = Math.random() * this.width
  const targetY = Math.random() * this.height
  const angle = Math.atan2(targetY - y, targetX - x)

  return {
    x: x,
    y: y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: 1,
    brightness: 0.8,
    color: { r: 255, g: 255, b: 255 },
    trail: [],
    life: 0,
    maxLife: 60 + Math.random() * 90,
    type: 'sporadic',
  }
}
export function getRandomMeteorColor(this: CosmicEngine): RGB {
  const colors = [
    { r: 255, g: 255, b: 255 },
    { r: 255, g: 200, b: 100 },
    { r: 100, g: 255, b: 100 },
    { r: 100, g: 150, b: 255 },
    { r: 255, g: 100, b: 150 },
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
export function getShowerMeteorColor(this: CosmicEngine): RGB {
  // Preserve the original RNG draw although its hue was unused.
  Math.random()
  return {
    r: 255,
    g: 180 + Math.random() * 75,
    b: 80 + Math.random() * 120,
  }
}
