import type { CosmicEngine } from './CosmicEngine'
import {
  drawCircle,
  drawRectangle,
  drawTriangle,
  drawStar,
  drawCross,
  drawHexagon,
  drawSpiral,
} from './basicShapePaths'
import {
  drawWaveOutline,
  drawBlob,
  drawLightning,
  drawFlower,
  drawCloud,
  drawCell,
  drawCrystal,
} from './organicShapePaths'
import {
  drawWave,
  drawWeb,
  drawLeaf,
  drawBranch,
  drawDrop,
  drawRandomCurve,
} from './biologicalShapePaths'
import {
  drawThought,
  drawEmotion,
  drawMemory,
  drawFoldedDimension,
  drawLucidDream,
} from './conceptualShapePaths'
const paths: Record<number, (this: CosmicEngine, size: number) => void> = {
  0: drawCircle,
  1: drawRectangle,
  2: drawTriangle,
  3: drawStar,
  4: drawCross,
  5: drawHexagon,
  6: drawSpiral,
  7: drawWaveOutline,
  8: drawBlob,
  9: drawLightning,
  10: drawFlower,
  11: drawCloud,
  12: drawCell,
  13: drawCrystal,
  14: drawWave,
  15: drawWeb,
  16: drawLeaf,
  17: drawBranch,
  18: drawDrop,
  19: drawRandomCurve,
  20: drawThought,
  21: drawEmotion,
  22: drawMemory,
  23: drawFoldedDimension,
  24: drawLucidDream,
}
export function renderShape(
  this: CosmicEngine,
  type: number,
  size: number
): void {
  this.ctx.beginPath()

  const sizeVariation = 0.8 + Math.random() * 0.4
  size = size * sizeVariation

  paths[type]?.call(this, size)

  if (Math.random() < 0.7) {
    this.ctx.fill()
  }
  if (Math.random() < 0.5) {
    this.ctx.stroke()
  }
}
