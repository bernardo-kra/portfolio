import type { CosmicEngine } from './CosmicEngine'
export function renderLucidDream(this: CosmicEngine, size: number): void {
  const dimensions = 4
  const baseAlpha = this.ctx.globalAlpha
  const dreamIntensity = Math.sin(this.time * 1.2) * 0.5 + 0.5

  this.ctx.save()
  this.ctx.globalCompositeOperation = 'screen'

  const drawDimension = (dim: number) => {
    const dimAlpha = baseAlpha * (0.2 + dim * 0.15) * dreamIntensity
    this.ctx.globalAlpha = dimAlpha

    const phaseShift = dim * Math.PI * 0.5
    const dreamPhase = this.time * (0.8 + dim * 0.3) + phaseShift
    const morphSize = size * (0.6 + Math.sin(dreamPhase * 0.7) * 0.3)
    const dimensionalShift = dim * size * 0.08
    const waveforms = 3 + dim
    this.ctx.beginPath()
    const resolution = 32

    const drawDreamOutline = () => {
      for (let i = 0; i <= resolution; i++) {
        const t = i / resolution
        const angle = t * Math.PI * 2

        let radius = morphSize * 0.4
        for (let w = 1; w <= waveforms; w++) {
          const waveContrib =
            Math.sin(angle * w + dreamPhase + w * phaseShift) *
            ((morphSize * 0.1) / w)
          radius += waveContrib
        }

        const x =
          Math.cos(angle) * radius +
          Math.sin(dreamPhase * 0.6 + dim) * dimensionalShift
        const y =
          Math.sin(angle) * radius +
          Math.cos(dreamPhase * 0.8 + dim) * dimensionalShift

        if (i === 0) this.ctx.moveTo(x, y)
        else this.ctx.lineTo(x, y)
      }
      this.ctx.closePath()
      const hue = (dim * 60 + this.time * 20) % 360
      this.ctx.fillStyle = `hsla(${hue}, 70%, ${60 + dim * 10}%, ${dimAlpha})`
      this.ctx.fill()
    }
    drawDreamOutline()

    const drawDreamSparks = () => {
      if (dim < 2) {
        const sparkCount = 8 + dim * 4
        for (let s = 0; s < sparkCount; s++) {
          const sparkAngle = (s / sparkCount) * Math.PI * 2 + dreamPhase
          const sparkRadius = morphSize * (0.2 + Math.random() * 0.4)
          const sparkX = Math.cos(sparkAngle) * sparkRadius
          const sparkY = Math.sin(sparkAngle) * sparkRadius

          const sparkSize = 2 + Math.random() * 3
          const sparkGradient = this.ctx.createRadialGradient(
            sparkX,
            sparkY,
            0,
            sparkX,
            sparkY,
            sparkSize
          )
          sparkGradient.addColorStop(
            0,
            `rgba(255, 255, 255, ${dimAlpha * 0.8})`
          )
          sparkGradient.addColorStop(1, 'transparent')

          this.ctx.fillStyle = sparkGradient
          this.ctx.beginPath()
          this.ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
    }
    drawDreamSparks()
  }
  for (let dim = 0; dim < dimensions; dim++) {
    drawDimension(dim)
  }

  this.ctx.restore()
}
