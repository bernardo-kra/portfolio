import type { Planet, Star, SceneFrame } from './sceneTypes'
export function drawPlanet(frame: SceneFrame, planet: Planet) {
  const { ctx, width, height, mouse, disableParallax } = frame

  const parallaxX = (mouse.x - 0.5) * 40 * 0.5
  const parallaxY = (mouse.y - 0.5) * 20 * 0.5
  const x = planet.x + (disableParallax ? 0 : parallaxX)
  const y = planet.y + (disableParallax ? 0 : parallaxY)

  if (x >= 0 && x <= width && y >= 0 && y <= height) {
    ctx.beginPath()
    ctx.arc(x, y, planet.radius, 0, 2 * Math.PI)
    ctx.fillStyle = planet.color
    ctx.globalAlpha = 0.3
    ctx.fill()
    ctx.globalAlpha = 1
  }

  planet.x += planet.speed * 0.5
  if (planet.x > width + planet.radius) planet.x = -planet.radius
}
export function drawStar(frame: SceneFrame, star: Star) {
  const { ctx, width, height, mouse, disableParallax } = frame

  const parallaxX = (mouse.x - 0.5) * 60 * (1 - star.depth)
  const parallaxY = (mouse.y - 0.5) * 30 * (1 - star.depth)
  const x = star.x + (disableParallax ? 0 : parallaxX)
  const y = star.y + (disableParallax ? 0 : parallaxY)

  if (x >= 0 && x <= width && y >= 0 && y <= height) {
    ctx.beginPath()
    ctx.arc(x, y, star.r, 0, 2 * Math.PI)
    ctx.fillStyle = star.color
    ctx.globalAlpha = 0.4 + 0.3 * star.depth
    ctx.fill()
    ctx.globalAlpha = 1
  }

  star.x += star.speed * star.depth
  if (star.x > width + 20) star.x = -20
}
function drawMoonGlow(
  ctx: CanvasRenderingContext2D,
  moonX: number,
  moonY: number,
  moonRadius: number
) {
  const moonGlow = ctx.createRadialGradient(
    moonX,
    moonY,
    0,
    moonX,
    moonY,
    moonRadius * 2
  )
  moonGlow.addColorStop(0, 'rgba(255, 255, 200, 0.3)')
  moonGlow.addColorStop(0.5, 'rgba(255, 255, 200, 0.1)')
  moonGlow.addColorStop(1, 'rgba(255, 255, 200, 0)')
  ctx.fillStyle = moonGlow
  ctx.fillRect(
    moonX - moonRadius * 2,
    moonY - moonRadius * 2,
    moonRadius * 4,
    moonRadius * 4
  )
}
function drawMoonCraters(
  ctx: CanvasRenderingContext2D,
  moonX: number,
  moonY: number
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.beginPath()
  ctx.arc(moonX - 8, moonY - 5, 3, 0, 2 * Math.PI)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(moonX + 5, moonY + 8, 2, 0, 2 * Math.PI)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(moonX - 3, moonY + 10, 1.5, 0, 2 * Math.PI)
  ctx.fill()
}
export function drawMoon(frame: SceneFrame) {
  const { ctx, width, height } = frame
  const moonX = width * 0.15
  const moonY = height * 0.2
  const moonRadius = 30

  drawMoonGlow(ctx, moonX, moonY, moonRadius)
  ctx.beginPath()
  ctx.arc(moonX, moonY, moonRadius, 0, 2 * Math.PI)
  ctx.fillStyle = '#F5F5DC'
  ctx.fill()

  drawMoonCraters(ctx, moonX, moonY)
}
