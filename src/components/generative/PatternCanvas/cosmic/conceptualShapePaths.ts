import type { CosmicEngine } from './CosmicEngine'
export function drawThought(this: CosmicEngine, size: number): void {
  this.renderThought(size)
}
export function drawEmotion(this: CosmicEngine, size: number): void {
  this.renderEmotion(size)
}
export function drawMemory(this: CosmicEngine, size: number): void {
  this.renderMemory(size)
}
export function drawFoldedDimension(this: CosmicEngine, size: number): void {
  this.renderFoldedDimension(size)
}
export function drawLucidDream(this: CosmicEngine, size: number): void {
  this.renderLucidDream(size)
}
