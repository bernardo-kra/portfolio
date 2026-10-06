import type { CosmicEngine } from './CosmicEngine'
export function initElements(this: CosmicEngine): void {
  for (let i = 0; i < 15; i++) {
    this.addRandomElement()
  }
}
export function generateDNA(this: CosmicEngine): string {
  const bases = ['A', 'T', 'G', 'C', '∞', '◊', '※', '⚡']
  return Array.from(
    { length: 12 },
    () => bases[Math.floor(Math.random() * bases.length)]
  ).join('')
}
export function addRandomElement(this: CosmicEngine): void {
  const dna = this.generateDNA()
  const consciousness = Math.random()

  this.elements.push({
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: 5 + Math.random() * 30,
    hue: Math.random() * 360,
    type: Math.floor(Math.random() * 25),
    life: 0,
    maxLife: 300 + Math.random() * 500,
    rotation: 0,
    rotationSpeed: (Math.random() - 0.5) * 0.1,
    consciousness: consciousness,
    memory: Array.from({ length: 5 }, () => Math.random()),
    dna: dna,
    emotion: Math.random() * 2 - 1,
    magnetism: Math.random() * 2 - 1,
    temperature: Math.random(),
    dimension: 2 + Math.random() * 3,
    quantumState: Math.random(),
    dreams: Array.from({ length: 3 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      intensity: Math.random(),
    })),
    depth: Math.random() * 100,
  })
}
export function updateElements(this: CosmicEngine): void {
  this.elements = this.elements.filter((element) => {
    const advanceElementState = () => {
      element.life++
      element.x += element.vx
      element.y += element.vy
      element.rotation += element.rotationSpeed
      this.updateConsciousness(element)
      this.updateEmotions(element)
      this.processMemories(element)
      this.quantumFluctuations(element)
      const consciousTurbulence = element.consciousness * 0.2
      element.vx += (Math.random() - 0.5) * consciousTurbulence
      element.vy += (Math.random() - 0.5) * consciousTurbulence
    }
    advanceElementState()

    const maxSpeed = 3
    const speed = Math.sqrt(element.vx * element.vx + element.vy * element.vy)
    if (speed > maxSpeed) {
      element.vx = (element.vx / speed) * maxSpeed
      element.vy = (element.vy / speed) * maxSpeed
    }

    const bounceHorizontalBoundary = () => {
      if (element.x < 0 || element.x > this.width) {
        element.vx *= -0.8
        element.vx += (Math.random() - 0.5) * 1
        element.x = Math.max(0, Math.min(this.width, element.x))
      }
    }
    bounceHorizontalBoundary()
    const bounceVerticalBoundary = () => {
      if (element.y < 0 || element.y > this.height) {
        element.vy *= -0.8
        element.vy += (Math.random() - 0.5) * 1
        element.y = Math.max(0, Math.min(this.height, element.y))
      }
    }
    bounceVerticalBoundary()

    element.hue += (Math.random() - 0.5) * 2
    if (element.hue < 0) element.hue += 360
    if (element.hue > 360) element.hue -= 360

    element.size += (Math.random() - 0.5) * 0.5
    element.size = Math.max(2, Math.min(50, element.size))

    return element.life < element.maxLife
  })
}
export function renderElements(this: CosmicEngine): void {
  this.elements.forEach((element) => {
    const alpha = 1 - element.life / element.maxLife

    this.ctx.save()
    this.ctx.translate(element.x, element.y)
    this.ctx.rotate(element.rotation)

    const saturation = 60 + Math.random() * 40
    const lightness = 40 + Math.random() * 40
    this.ctx.fillStyle = `hsla(${element.hue}, ${saturation}%, ${lightness}%, ${alpha})`
    this.ctx.strokeStyle = `hsla(${(element.hue + 60) % 360}, ${saturation + 20}%, ${lightness + 20}%, ${alpha})`
    this.ctx.lineWidth = 1 + Math.random() * 2

    this.renderShape(element.type, element.size)

    this.ctx.restore()

    if (Math.random() < 0.1) {
      this.drawConnections(element)
    }
  })
}
