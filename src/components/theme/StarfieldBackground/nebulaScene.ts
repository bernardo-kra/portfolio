import type { Nebula, SceneFrame } from './sceneTypes'
function hexToRgba(hex: string, alpha: number): string {
  hex = hex.replace('#', '')

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  if (hex.length !== 6) {
    return `rgba(255, 255, 255, ${alpha})`
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function createNebulaGlow(
  ctx: CanvasRenderingContext2D,
  nebula: Nebula,
  x: number,
  y: number
) {
  const gradient = ctx.createRadialGradient(
    x,
    y,
    0,
    x,
    y,
    Math.max(nebula.width, nebula.height) / 2
  )
  const alpha1 = nebula.opacity
  const alpha2 = nebula.opacity * 0.5
  gradient.addColorStop(0, hexToRgba(nebula.color, alpha1))
  gradient.addColorStop(0.7, hexToRgba(nebula.color, alpha2))
  gradient.addColorStop(1, hexToRgba(nebula.color, 0))

  return gradient
}
export function drawNebula(frame: SceneFrame, nebula: Nebula) {
  const { ctx, width, mouse, disableParallax } = frame

  const parallaxX = (mouse.x - 0.5) * 20 * 0.3
  const parallaxY = (mouse.y - 0.5) * 10 * 0.3
  const x = nebula.x + (disableParallax ? 0 : parallaxX)
  const y = nebula.y + (disableParallax ? 0 : parallaxY)

  ctx.save()
  ctx.beginPath()
  ctx.ellipse(x, y, nebula.width / 2, nebula.height / 2, 0, 0, 2 * Math.PI)
  ctx.clip()

  const gradient = createNebulaGlow(ctx, nebula, x, y)
  ctx.fillStyle = gradient
  ctx.fillRect(
    x - nebula.width,
    y - nebula.height,
    nebula.width * 2,
    nebula.height * 2
  )
  ctx.restore()

  nebula.x += nebula.speed
  if (nebula.x > width + nebula.width) nebula.x = -nebula.width
}
