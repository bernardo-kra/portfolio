import type { CosmicEngine } from './CosmicEngine'
import type { Element } from './particleState'
export function updateConsciousness(
  this: CosmicEngine,
  element: Element
): void {
  const lifeExperience = element.life / element.maxLife
  const socialInteraction = this.elements.length / 25

  element.consciousness += (lifeExperience + socialInteraction) * 0.001
  element.consciousness = Math.min(1, element.consciousness)

  if (element.consciousness > 0.7) {
    const consciousNearby = this.elements.filter(
      (other) =>
        other !== element &&
        other.consciousness > 0.5 &&
        Math.sqrt((other.x - element.x) ** 2 + (other.y - element.y) ** 2) < 100
    )

    if (consciousNearby.length > 0) {
      const target = consciousNearby[0]
      const dx = target.x - element.x
      const dy = target.y - element.y
      element.vx += dx * 0.001
      element.vy += dy * 0.001
    }
  }
}
export function updateEmotions(this: CosmicEngine, element: Element): void {
  const crowding = this.elements.length / 25
  const isolation = crowding < 0.3 ? 0.5 : 0
  const excitement = Math.sin(this.time * 2 + element.life * 0.01) * 0.1

  element.emotion += (isolation - crowding + excitement) * 0.01
  element.emotion = Math.max(-1, Math.min(1, element.emotion))

  const emotionalHueShift = element.emotion * 30
  element.hue = (element.hue + emotionalHueShift) % 360

  if (element.emotion > 0.5) {
    element.size += 0.1
  } else if (element.emotion < -0.5) {
    element.size -= 0.05
  }
}
export function processMemories(this: CosmicEngine, element: Element): void {
  const recentExperience = Math.sin(this.time + element.life * 0.1)
  element.memory[0] = (element.memory[0] + recentExperience) * 0.5

  if (element.life % 100 === 0) {
    element.memory.push(element.memory.shift()!)
  }

  const memoryInfluence =
    element.memory.reduce((sum: number, mem: number) => sum + mem, 0) /
    element.memory.length
  element.rotationSpeed += memoryInfluence * 0.001
}
export function quantumFluctuations(
  this: CosmicEngine,
  element: Element
): void {
  element.quantumState += (Math.random() - 0.5) * 0.1
  element.quantumState = Math.max(0, Math.min(1, element.quantumState))

  if (Math.random() < 0.001) {
    element.quantumState = Math.random()
    if (element.quantumState > 0.95) {
      element.x = Math.random() * this.width
      element.y = Math.random() * this.height
      element.vx *= -1
      element.vy *= -1
    }
  }

  element.dimension = 2 + element.quantumState * 3

  element.dreams.forEach(
    (dream: { x: number; y: number; intensity: number }) => {
      dream.x += (Math.random() - 0.5) * element.quantumState * 10
      dream.y += (Math.random() - 0.5) * element.quantumState * 10
      dream.intensity =
        element.quantumState * Math.sin(this.time + dream.x * 0.01)
    }
  )
}
export function drawConnections(this: CosmicEngine, element: Element): void {
  const nearbyElements = this.elements.filter((other) => {
    if (other === element) return false
    const dx = other.x - element.x
    const dy = other.y - element.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < 100 && Math.random() < 0.3
  })

  nearbyElements.forEach((other) => {
    const alpha = 0.1 + Math.random() * 0.2
    this.ctx.strokeStyle = `hsla(${(element.hue + other.hue) / 2}, 50%, 60%, ${alpha})`
    this.ctx.lineWidth = 0.5 + Math.random() * 1
    this.ctx.beginPath()
    this.ctx.moveTo(element.x, element.y)
    this.ctx.lineTo(other.x, other.y)
    this.ctx.stroke()
  })
}
