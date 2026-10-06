import type { CosmicEngine } from './CosmicEngine'
import type { Element } from './particleState'
export function checkCollisions(this: CosmicEngine): void {
  if (this.elements.length > 10) {
    const maxChecks = Math.min(50, this.elements.length * 2)
    let checks = 0

    const checkLimitedPairs = () => {
      for (let i = 0; i < this.elements.length && checks < maxChecks; i++) {
        for (
          let j = i + 1;
          j < this.elements.length && checks < maxChecks;
          j++
        ) {
          checks++
          const elem1 = this.elements[i]
          const elem2 = this.elements[j]

          const dx = elem1.x - elem2.x
          const dy = elem1.y - elem2.y
          const distance = dx * dx + dy * dy
          const minDistance = (elem1.size + elem2.size) * 0.8
          const minDistanceSquared = minDistance * minDistance

          if (distance < minDistanceSquared) {
            if (Math.random() < 0.5) {
              this.createCollisionEffect(elem1, elem2)
            }
            this.handleCollision(elem1, elem2, { first: i, second: j })
          }
        }
      }
    }
    checkLimitedPairs()
  } else {
    for (let i = 0; i < this.elements.length; i++) {
      for (let j = i + 1; j < this.elements.length; j++) {
        const elem1 = this.elements[i]
        const elem2 = this.elements[j]

        const dx = elem1.x - elem2.x
        const dy = elem1.y - elem2.y
        const distance = dx * dx + dy * dy
        const minDistance = (elem1.size + elem2.size) * 0.8
        const minDistanceSquared = minDistance * minDistance

        if (distance < minDistanceSquared) {
          this.createCollisionEffect(elem1, elem2)
          this.handleCollision(elem1, elem2, { first: i, second: j })
        }
      }
    }
  }
}
export function createCollisionEffect(
  this: CosmicEngine,
  elem1: Element,
  elem2: Element
): void {
  const centerX = (elem1.x + elem2.x) / 2
  const centerY = (elem1.y + elem2.y) / 2

  this.ctx.save()
  this.ctx.globalAlpha = 0.4
  this.ctx.globalCompositeOperation = 'screen'

  const sparkCount = 3 + Math.floor(Math.random() * 4)
  for (let i = 0; i < sparkCount; i++) {
    const angle = (i / sparkCount) * Math.PI * 2 + Math.random()
    const distance = 8 + Math.random() * 12
    const sparkX = centerX + Math.cos(angle) * distance
    const sparkY = centerY + Math.sin(angle) * distance

    this.ctx.fillStyle = `hsla(${(elem1.hue + elem2.hue) / 2}, 80%, 70%, 0.6)`
    this.ctx.beginPath()
    this.ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2)
    this.ctx.fill()
  }

  this.ctx.restore()
}
export function handleCollision(
  this: CosmicEngine,
  elem1: Element,
  elem2: Element,
  indices: { first: number; second: number }
): void {
  const centerX = (elem1.x + elem2.x) / 2
  const centerY = (elem1.y + elem2.y) / 2

  if (Math.random() < 0.1 && this.elements.length < 15) {
    this.createCollisionOffspring(elem1, elem2, { x: centerX, y: centerY })
  }

  if (Math.random() < 0.05 && this.elements.length > 8) {
    this.createFusionElement(
      { first: elem1, second: elem2 },
      { x: centerX, y: centerY },
      indices
    )
  } else {
    elem1.vx = -elem1.vx * 0.8 + (Math.random() - 0.5) * 0.5
    elem1.vy = -elem1.vy * 0.8 + (Math.random() - 0.5) * 0.5
    elem2.vx = -elem2.vx * 0.8 + (Math.random() - 0.5) * 0.5
    elem2.vy = -elem2.vy * 0.8 + (Math.random() - 0.5) * 0.5

    elem1.consciousness += 0.05
    elem2.consciousness += 0.05
    elem1.emotion += 0.1
    elem2.emotion += 0.1
  }
}
