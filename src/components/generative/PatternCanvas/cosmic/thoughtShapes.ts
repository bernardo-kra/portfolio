import type { CosmicEngine } from './CosmicEngine'
export function renderThought(this: CosmicEngine, size: number): void {
  const nodes = 4 + Math.floor(Math.random() * 6)
  const centerPulse = Math.sin(this.time * 4) * 0.3

  for (let i = 0; i < nodes; i++) {
    const angle = (i / nodes) * Math.PI * 2 + Math.sin(this.time * 2) * 0.4
    const distance = size * (0.4 + Math.sin(this.time * 1.5 + i) * 0.2)
    const nodeSize = size * (0.08 + Math.random() * 0.15) * (1 + centerPulse)
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance

    const drawThoughtNode = () => {
      const nodeGradient = this.ctx.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        nodeSize * 2
      )
      nodeGradient.addColorStop(0, `rgba(255, 255, 255, 0.8)`)
      nodeGradient.addColorStop(0.5, `rgba(150, 200, 255, 0.4)`)
      nodeGradient.addColorStop(1, 'transparent')
      this.ctx.fillStyle = nodeGradient
      this.ctx.beginPath()
      this.ctx.arc(x, y, nodeSize * 2, 0, Math.PI * 2)
      this.ctx.fill()
    }
    drawThoughtNode()
    this.ctx.fillStyle = `rgba(200, 220, 255, 0.9)`
    this.ctx.beginPath()
    this.ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
    this.ctx.fill()

    const drawThoughtLinks = () => {
      if (i > 0) {
        const prevAngle =
          ((i - 1) / nodes) * Math.PI * 2 + Math.sin(this.time * 2) * 0.4
        const prevDistance =
          size * (0.4 + Math.sin(this.time * 1.5 + (i - 1)) * 0.2)
        const prevX = Math.cos(prevAngle) * prevDistance
        const prevY = Math.sin(prevAngle) * prevDistance

        const connectionIntensity = 0.3 + Math.sin(this.time * 3 + i) * 0.2
        this.ctx.strokeStyle = `rgba(100, 150, 255, ${connectionIntensity})`
        this.ctx.lineWidth = 1.5
        this.ctx.beginPath()
        this.ctx.moveTo(prevX, prevY)
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
      }
    }
    drawThoughtLinks()
  }

  this.ctx.fillStyle = `rgba(255, 255, 255, 0.6)`
  this.ctx.beginPath()
  this.ctx.arc(0, 0, size * 0.05, 0, Math.PI * 2)
  this.ctx.fill()
}
export function renderEmotion(this: CosmicEngine, size: number): void {
  const energyLevel = Math.sin(this.time * 3) * 0.5 + 0.5
  const harmonics = 6 + Math.floor(energyLevel * 6)
  const coreRadius = size * 0.3

  this.ctx.save()
  this.ctx.globalCompositeOperation = 'screen'

  const drawEmotionOutline = () => {
    for (let layer = 0; layer < 3; layer++) {
      const layerIntensity = energyLevel * (1 - layer * 0.3)
      const layerRadius = coreRadius * (1.2 + layer * 0.4)

      this.ctx.beginPath()
      for (let i = 0; i <= harmonics; i++) {
        const angle = (i / harmonics) * Math.PI * 2
        const waveAmplitude =
          layerRadius *
          (0.1 +
            layerIntensity * Math.sin(angle * 4 + this.time * 4 + layer) * 0.2)
        const currentRadius = layerRadius + waveAmplitude
        const x = Math.cos(angle) * currentRadius
        const y = Math.sin(angle) * currentRadius

        if (i === 0) this.ctx.moveTo(x, y)
        else this.ctx.lineTo(x, y)
      }
      this.ctx.closePath()

      const layerAlpha = layerIntensity * (0.4 - layer * 0.1)
      this.ctx.fillStyle = `rgba(255, ${100 + layer * 50}, ${150 + layer * 30}, ${layerAlpha})`
      this.ctx.fill()
    }
  }
  drawEmotionOutline()

  const centerGradient = this.ctx.createRadialGradient(
    0,
    0,
    0,
    0,
    0,
    coreRadius
  )
  centerGradient.addColorStop(0, `rgba(255, 255, 255, ${energyLevel * 0.8})`)
  centerGradient.addColorStop(0.7, `rgba(255, 200, 150, ${energyLevel * 0.4})`)
  centerGradient.addColorStop(1, 'transparent')

  this.ctx.fillStyle = centerGradient
  this.ctx.beginPath()
  this.ctx.arc(0, 0, coreRadius, 0, Math.PI * 2)
  this.ctx.fill()

  this.ctx.restore()
}
