export interface Cloud {
  x: number
  y: number
  speed: number
  size: number
  opacity: number
}
function traceCloud(
  ctx: CanvasRenderingContext2D,
  { cx, cy, size }: { cx: number; cy: number; size: number }
) {
  ctx.beginPath()
  ctx.arc(cx, cy, size * 0.4, Math.PI * 0.5, Math.PI * 1.5)
  ctx.arc(
    cx + size * 0.3,
    cy - size * 0.3,
    size * 0.35,
    Math.PI * 1,
    Math.PI * 1.8
  )
  ctx.arc(
    cx + size * 0.6,
    cy - size * 0.1,
    size * 0.3,
    Math.PI * 1.2,
    Math.PI * 1.9
  )
  ctx.arc(
    cx + size * 0.8,
    cy + size * 0.1,
    size * 0.25,
    Math.PI * 1.4,
    Math.PI * 0.6
  )
  ctx.arc(
    cx + size * 0.5,
    cy + size * 0.2,
    size * 0.2,
    Math.PI * 0.8,
    Math.PI * 1.6
  )
  ctx.closePath()
}
function drawCloud(ctx: CanvasRenderingContext2D, cloud: Cloud) {
  const { x: cx, y: cy, size, opacity } = cloud
  ctx.save()
  ctx.globalAlpha = opacity

  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2

  traceCloud(ctx, { cx, cy, size })
  const cloudColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--cloud-color')
      .trim() || '#ffffff'
  ctx.fillStyle = cloudColor
  ctx.fill()

  ctx.shadowColor = 'transparent'
  ctx.globalAlpha = opacity * 0.3
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  ctx.restore()
}
function drawSky(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Enable smooth rendering
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // Clear with smooth background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
  ctx.fillRect(0, 0, width, height)

  const grad = ctx.createLinearGradient(0, 0, 0, height)
  const grad1 =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--day-gradient-1')
      .trim() || '#87CEEB'
  const grad2 =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--day-gradient-2')
      .trim() || '#E0F6FF'
  const grad3 =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--day-gradient-3')
      .trim() || '#F0F8FF'
  grad.addColorStop(0, grad1)
  grad.addColorStop(0.3, grad2)
  grad.addColorStop(0.7, grad3)
  grad.addColorStop(1, '#ffffff')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)
}
function drawSun(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save()
  const sunX = width * 0.8
  const sunY = height * 0.2
  const sunRadius = 40

  const sunGradient = ctx.createRadialGradient(
    sunX,
    sunY,
    0,
    sunX,
    sunY,
    sunRadius * 2
  )
  sunGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
  sunGradient.addColorStop(0.3, 'rgba(255, 255, 200, 0.6)')
  sunGradient.addColorStop(0.7, 'rgba(255, 255, 150, 0.3)')
  sunGradient.addColorStop(1, 'rgba(255, 255, 100, 0)')
  ctx.fillStyle = sunGradient
  ctx.fillRect(
    sunX - sunRadius * 2,
    sunY - sunRadius * 2,
    sunRadius * 4,
    sunRadius * 4
  )

  ctx.beginPath()
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  ctx.restore()
}
function moveClouds(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  clouds: Cloud[]
) {
  for (const cloud of clouds) {
    // Only render clouds that are visible or close to viewport
    if (
      cloud.x > -cloud.size &&
      cloud.x < width + cloud.size &&
      cloud.y > -cloud.size &&
      cloud.y < height + cloud.size
    ) {
      drawCloud(ctx, cloud)
    }
    cloud.x += cloud.speed
    if (cloud.x - cloud.size > width + 50) cloud.x = -cloud.size - 50
  }
}
function drawBirds(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.save()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'

  for (let i = 0; i < 3; i++) {
    const birdX =
      width * 0.1 + i * width * 0.3 + ((Date.now() * 0.0001) % (width * 0.3))
    const birdY = height * 0.3 + Math.sin(Date.now() * 0.001 + i) * 20

    // Only render birds that are visible
    if (birdX >= 0 && birdX <= width && birdY >= 0 && birdY <= height) {
      ctx.beginPath()
      ctx.moveTo(birdX, birdY)
      ctx.lineTo(birdX + 10, birdY - 5)
      ctx.moveTo(birdX, birdY)
      ctx.lineTo(birdX + 10, birdY + 5)
      ctx.stroke()
    }
  }
  ctx.restore()
}
export function drawDayScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  clouds: Cloud[]
) {
  drawSky(ctx, width, height)
  drawSun(ctx, width, height)
  moveClouds(ctx, width, height, clouds)
  drawBirds(ctx, width, height)
}
