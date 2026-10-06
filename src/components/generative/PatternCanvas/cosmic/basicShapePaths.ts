import type { CosmicEngine } from './CosmicEngine'
export function drawCircle(this: CosmicEngine, size: number): void {
  if (Math.random() < 0.3) {
    this.ctx.ellipse(
      0,
      0,
      size,
      size * (0.4 + Math.random() * 0.8),
      0,
      0,
      Math.PI * 2
    )
  } else {
    this.ctx.arc(0, 0, size, 0, Math.PI * 2)
  }
}
export function drawRectangle(this: CosmicEngine, size: number): void {
  const width = size * (0.5 + Math.random() * 1.5)
  const height = size * (0.5 + Math.random() * 1.5)
  this.ctx.rect(-width / 2, -height / 2, width, height)
}
export function drawTriangle(this: CosmicEngine, size: number): void {
  this.ctx.moveTo(0, -size)
  this.ctx.lineTo(-size, size)
  this.ctx.lineTo(size, size)
  this.ctx.closePath()
}
export function drawStar(this: CosmicEngine, size: number): void {
  const starPoints = 5 + Math.floor(Math.random() * 3)
  for (let i = 0; i < starPoints * 2; i++) {
    const angle = (i / (starPoints * 2)) * Math.PI * 2
    const radius = i % 2 === 0 ? size : size * 0.5
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) this.ctx.moveTo(x, y)
    else this.ctx.lineTo(x, y)
  }
  this.ctx.closePath()
}
export function drawCross(this: CosmicEngine, size: number): void {
  this.ctx.rect(-size / 4, -size, size / 2, size * 2)
  this.ctx.rect(-size, -size / 4, size * 2, size / 2)
}
export function drawHexagon(this: CosmicEngine, size: number): void {
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const radius = size * (0.7 + Math.random() * 0.6)
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) this.ctx.moveTo(x, y)
    else this.ctx.lineTo(x, y)
  }
  this.ctx.closePath()
}
export function drawSpiral(this: CosmicEngine, size: number): void {
  for (let i = 0; i < 20; i++) {
    const angle = i * 0.5
    const radius = (i / 20) * size
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) this.ctx.moveTo(x, y)
    else this.ctx.lineTo(x, y)
  }
}
