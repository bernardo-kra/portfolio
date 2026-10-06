import type { CosmicEngine } from './CosmicEngine'
export function drawWave(this: CosmicEngine, size: number): void {
  this.ctx.moveTo(-size, 0)
  for (let i = 0; i <= 20; i++) {
    const x = -size + (i / 20) * size * 2
    const frequency = 2 + Math.random() * 4
    const amplitude = size * (0.3 + Math.random() * 0.4)
    const y = Math.sin(i * frequency * 0.1 + this.time) * amplitude
    this.ctx.lineTo(x, y)
  }
}
export function drawWeb(this: CosmicEngine, size: number): void {
  const webLines = 6 + Math.floor(Math.random() * 6)
  for (let i = 0; i < webLines; i++) {
    const angle = (i / webLines) * Math.PI * 2
    const length = size * (0.5 + Math.random() * 0.5)
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length)
  }
  for (let r = size * 0.2; r < size; r += size * 0.3) {
    this.ctx.moveTo(r, 0)
    this.ctx.arc(0, 0, r, 0, Math.PI * 2)
  }
}
export function drawLeaf(this: CosmicEngine, size: number): void {
  this.ctx.moveTo(0, -size)
  this.ctx.quadraticCurveTo(-size * 0.5, -size * 0.3, -size * 0.3, 0)
  this.ctx.quadraticCurveTo(-size * 0.2, size * 0.7, 0, size)
  this.ctx.quadraticCurveTo(size * 0.2, size * 0.7, size * 0.3, 0)
  this.ctx.quadraticCurveTo(size * 0.5, -size * 0.3, 0, -size)
  this.ctx.moveTo(0, -size)
  this.ctx.lineTo(0, size)
}
export function drawBranch(this: CosmicEngine, size: number): void {
  this.ctx.moveTo(0, 0)
  this.ctx.quadraticCurveTo(-size * 0.8, -size * 0.6, -size * 0.4, -size * 0.2)
  this.ctx.quadraticCurveTo(-size * 0.2, -size * 0.8, 0, -size * 0.3)
  this.ctx.moveTo(0, 0)
  this.ctx.quadraticCurveTo(-size * 0.6, size * 0.4, -size * 0.3, size * 0.2)
  this.ctx.quadraticCurveTo(-size * 0.1, size * 0.6, 0, size * 0.2)
  this.ctx.moveTo(0, 0)
  this.ctx.quadraticCurveTo(size * 0.8, -size * 0.6, size * 0.4, -size * 0.2)
  this.ctx.quadraticCurveTo(size * 0.2, -size * 0.8, 0, -size * 0.3)
  this.ctx.moveTo(0, 0)
  this.ctx.quadraticCurveTo(size * 0.6, size * 0.4, size * 0.3, size * 0.2)
  this.ctx.quadraticCurveTo(size * 0.1, size * 0.6, 0, size * 0.2)
  this.ctx.moveTo(0, -size * 0.3)
  this.ctx.lineTo(0, size * 0.8)
}
export function drawDrop(this: CosmicEngine, size: number): void {
  this.ctx.moveTo(0, -size)
  this.ctx.quadraticCurveTo(size * 0.6, -size * 0.3, size * 0.6, size * 0.3)
  this.ctx.quadraticCurveTo(size * 0.6, size * 0.8, 0, size)
  this.ctx.quadraticCurveTo(-size * 0.6, size * 0.8, -size * 0.6, size * 0.3)
  this.ctx.quadraticCurveTo(-size * 0.6, -size * 0.3, 0, -size)
}
export function drawRandomCurve(this: CosmicEngine, size: number): void {
  const randomPoints = 5 + Math.floor(Math.random() * 10)
  const points: Array<{ x: number; y: number }> = []
  for (let i = 0; i < randomPoints; i++) {
    const angle = (i / randomPoints) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
    const radius = size * (0.3 + Math.random() * 0.7)
    points.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    })
  }
  if (points.length > 0) {
    this.ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const next = points[(i + 1) % points.length]

      const cpX = curr.x + (next.x - prev.x) * 0.1
      const cpY = curr.y + (next.y - prev.y) * 0.1

      this.ctx.quadraticCurveTo(cpX, cpY, curr.x, curr.y)
    }
    this.ctx.closePath()
  }
}
