import type { CosmicEngine } from './CosmicEngine'
export function drawWaveOutline(this: CosmicEngine, size: number): void {
  const segments = 6 + Math.floor(Math.random() * 6)
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const radius = size * (0.5 + Math.sin(angle * 3 + this.time) * 0.3)
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) this.ctx.moveTo(x, y)
    else this.ctx.lineTo(x, y)
  }
  this.ctx.closePath()
}
export function drawBlob(this: CosmicEngine, size: number): void {
  const blobPoints = 8 + Math.floor(Math.random() * 8)
  for (let i = 0; i <= blobPoints; i++) {
    const angle = (i / blobPoints) * Math.PI * 2
    const randomRadius = size * (0.4 + Math.random() * 0.6)
    const x = Math.cos(angle) * randomRadius
    const y = Math.sin(angle) * randomRadius
    if (i === 0) this.ctx.moveTo(x, y)
    else this.ctx.lineTo(x, y)
  }
  this.ctx.closePath()
}
export function drawLightning(this: CosmicEngine, size: number): void {
  this.ctx.moveTo(0, -size)
  for (let i = 1; i <= 8; i++) {
    const x = (Math.random() - 0.5) * size * 0.8
    const y = -size + (i / 8) * size * 2
    this.ctx.lineTo(x, y)
  }
}
export function drawFlower(this: CosmicEngine, size: number): void {
  const petals = 4 + Math.floor(Math.random() * 8)
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2
    const petalLength = size * (0.5 + Math.random() * 0.8)
    const x = Math.cos(angle) * petalLength
    const y = Math.sin(angle) * petalLength
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(x, y)
    this.ctx.moveTo(x + size * 0.1, y)
    this.ctx.arc(x, y, size * 0.15, 0, Math.PI * 2)
  }
}
export function drawCloud(this: CosmicEngine, size: number): void {
  const cloudBumps = 5 + Math.floor(Math.random() * 6)
  for (let i = 0; i < cloudBumps; i++) {
    const angle = (i / cloudBumps) * Math.PI * 2
    const bumpSize = size * (0.3 + Math.random() * 0.4)
    const x = Math.cos(angle) * size * 0.5
    const y = Math.sin(angle) * size * 0.3
    this.ctx.moveTo(x + bumpSize, y)
    this.ctx.arc(x, y, bumpSize, 0, Math.PI * 2)
  }
}
export function drawCell(this: CosmicEngine, size: number): void {
  const cellPoints = 12 + Math.floor(Math.random() * 8)
  for (let i = 0; i <= cellPoints; i++) {
    const angle = (i / cellPoints) * Math.PI * 2
    const wobble = Math.sin(angle * 4 + this.time * 2) * 0.3
    const radius = size * (0.6 + wobble + Math.random() * 0.2)
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) this.ctx.moveTo(x, y)
    else this.ctx.lineTo(x, y)
  }
  this.ctx.closePath()
}
export function drawCrystal(this: CosmicEngine, size: number): void {
  const crystalFaces = 6 + Math.floor(Math.random() * 6)
  for (let i = 0; i < crystalFaces; i++) {
    const angle = (i / crystalFaces) * Math.PI * 2 + Math.random() * 0.5
    const faceLength = size * (0.4 + Math.random() * 0.6)
    const x = Math.cos(angle) * faceLength
    const y = Math.sin(angle) * faceLength
    if (i === 0) this.ctx.moveTo(x, y)
    else this.ctx.lineTo(x, y)
  }
  this.ctx.closePath()
}
