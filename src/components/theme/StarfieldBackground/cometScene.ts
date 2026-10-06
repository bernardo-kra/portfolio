import type { Comet, SceneFrame } from './sceneTypes'
function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}
function moveComet(comet: Comet, width: number, height: number) {
  comet.x += comet.vx
  comet.y += comet.vy
  comet.life -= 0.005

  if (
    comet.life <= 0 ||
    comet.x < -100 ||
    comet.x > width + 100 ||
    comet.y < -100 ||
    comet.y > height + 100
  ) {
    comet.x = Math.random() * width
    comet.y = Math.random() * height
    comet.vx = randomBetween(-2, -0.5)
    comet.vy = randomBetween(-1, 1)
    comet.life = 1
    comet.tail = []
  }

  comet.tail.unshift({ x: comet.x, y: comet.y })
  if (comet.tail.length > 20) comet.tail.pop()
}
function drawCometTail(ctx: CanvasRenderingContext2D, comet: Comet) {
  if (comet.tail.length > 1) {
    ctx.globalAlpha = comet.life * 0.8
    for (let i = 0; i < comet.tail.length - 1; i++) {
      const point = comet.tail[i]
      const nextPoint = comet.tail[i + 1]
      const alpha = (1 - i / comet.tail.length) * comet.life * 0.8

      const gradient = ctx.createLinearGradient(
        point.x,
        point.y,
        nextPoint.x,
        nextPoint.y
      )
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
      gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.5})`)

      ctx.strokeStyle = gradient
      ctx.lineWidth = Math.max(1, 3 * (1 - i / comet.tail.length))
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(nextPoint.x, nextPoint.y)
      ctx.stroke()
    }
  }
}
function drawCometHead(ctx: CanvasRenderingContext2D, comet: Comet) {
  const headGlow = ctx.createRadialGradient(
    comet.x,
    comet.y,
    0,
    comet.x,
    comet.y,
    8
  )
  headGlow.addColorStop(0, `rgba(255, 255, 255, ${comet.life})`)
  headGlow.addColorStop(0.5, `rgba(255, 255, 255, ${comet.life * 0.5})`)
  headGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = headGlow
  ctx.beginPath()
  ctx.arc(comet.x, comet.y, 8, 0, 2 * Math.PI)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(comet.x, comet.y, 3, 0, 2 * Math.PI)
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = comet.life
  ctx.fill()
}
export function drawComet(frame: SceneFrame, comet: Comet) {
  const { ctx, width, height } = frame

  moveComet(comet, width, height)
  if (
    comet.x > -50 &&
    comet.x < width + 50 &&
    comet.y > -50 &&
    comet.y < height + 50
  ) {
    ctx.save()

    drawCometTail(ctx, comet)
    drawCometHead(ctx, comet)
    ctx.restore()
  }
}
