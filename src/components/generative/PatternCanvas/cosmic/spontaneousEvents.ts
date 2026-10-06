import type { CosmicEngine } from './CosmicEngine'
export function createBurst(this: CosmicEngine): void {
  const centerX = Math.random() * this.width
  const centerY = Math.random() * this.height
  const burstSize = 5 + Math.floor(Math.random() * 8)
  const burstHue = Math.random() * 360

  for (let i = 0; i < burstSize; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 3

    this.elements.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3 + Math.random() * 15,
      hue: burstHue + (Math.random() - 0.5) * 60,
      type: Math.floor(Math.random() * 20),
      life: 0,
      maxLife: 200 + Math.random() * 300,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.15,
      consciousness: Math.random() * 0.3,
      memory: Array.from({ length: 5 }, () => Math.random()),
      dna: this.generateDNA(),
      emotion: Math.random() * 2 - 1,
      magnetism: Math.random() * 2 - 1,
      temperature: Math.random(),
      dimension: 2 + Math.random() * 3,
      quantumState: Math.random(),
      dreams: Array.from({ length: 3 }, () => ({
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + (Math.random() - 0.5) * 100,
        intensity: Math.random(),
      })),
      depth: Math.random() * 100,
    })
  }
}
export function createBlackHole(this: CosmicEngine): void {
  const centerX = Math.random() * this.width
  const centerY = Math.random() * this.height

  this.elements.forEach((element) => {
    const dx = centerX - element.x
    const dy = centerY - element.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 150) {
      const gravity = 200 / (distance + 10)
      element.vx += (dx / distance) * gravity * 0.01
      element.vy += (dy / distance) * gravity * 0.01

      if (distance < 30) {
        element.consciousness += 0.5
        element.dimension += 1
        element.hue = (element.hue + 180) % 360
      }
    }
  })
}
export function createWormhole(this: CosmicEngine): void {
  const point1 = {
    x: Math.random() * this.width,
    y: Math.random() * this.height,
  }
  const point2 = {
    x: Math.random() * this.width,
    y: Math.random() * this.height,
  }

  this.elements.forEach((element) => {
    const dist1 = Math.sqrt(
      (element.x - point1.x) ** 2 + (element.y - point1.y) ** 2
    )
    const dist2 = Math.sqrt(
      (element.x - point2.x) ** 2 + (element.y - point2.y) ** 2
    )

    if (dist1 < 25) {
      element.x = point2.x + (Math.random() - 0.5) * 50
      element.y = point2.y + (Math.random() - 0.5) * 50
      element.quantumState = Math.random()
    } else if (dist2 < 25) {
      element.x = point1.x + (Math.random() - 0.5) * 50
      element.y = point1.y + (Math.random() - 0.5) * 50
      element.quantumState = Math.random()
    }
  })
}
export function createTimeDistortion(this: CosmicEngine): void {
  const affectedElements = this.elements.filter(() => Math.random() < 0.3)

  affectedElements.forEach((element) => {
    if (Math.random() < 0.5) {
      element.life += 50
      element.rotationSpeed *= 2
      element.consciousness += 0.1
    } else {
      element.life = Math.max(0, element.life - 30)
      element.memory = element.memory.map(() => Math.random())
    }
  })
}
export function createMagneticField(this: CosmicEngine): void {
  const fieldCenter = {
    x: Math.random() * this.width,
    y: Math.random() * this.height,
  }

  this.elements.forEach((element) => {
    const dx = fieldCenter.x - element.x
    const dy = fieldCenter.y - element.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 200) {
      const force = (200 - distance) / 200
      const magneticStrength = element.magnetism * force * 0.02

      if (element.magnetism > 0) {
        element.vx += (dx / distance) * magneticStrength
        element.vy += (dy / distance) * magneticStrength
      } else {
        element.vx -= (dx / distance) * magneticStrength
        element.vy -= (dy / distance) * magneticStrength
      }

      element.hue += Math.sin(this.time * 3 + distance * 0.01) * 10
      element.rotationSpeed += magneticStrength * 2
    }
  })
}
