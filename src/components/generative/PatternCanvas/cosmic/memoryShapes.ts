import type { CosmicEngine } from './CosmicEngine'
export function renderMemory(this: CosmicEngine, size: number): void {
  const dataPoints = 8 + Math.floor(Math.random() * 8)
  const rotationSpeed = this.time * 0.3
  const coreSize = size * 0.08

  this.ctx.save()

  const drawDimension = (i: number) => {
    const angle = (i / dataPoints) * Math.PI * 2 + rotationSpeed
    const orbitRadius = size * (0.3 + Math.sin(this.time * 1.2 + i) * 0.2)
    const pointSize = size * (0.03 + Math.random() * 0.06)
    const x = Math.cos(angle) * orbitRadius
    const y = Math.sin(angle) * orbitRadius

    const accessProbability = Math.sin(this.time * 1.5 + i * 0.7) * 0.5 + 0.5
    const drawMemoryPoint = () => {
      const pointAlpha = 0.3 + accessProbability * 0.7
      const pointGradient = this.ctx.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        pointSize * 3
      )
      pointGradient.addColorStop(0, `rgba(100, 200, 255, ${pointAlpha})`)
      pointGradient.addColorStop(
        0.6,
        `rgba(150, 150, 255, ${pointAlpha * 0.5})`
      )
      pointGradient.addColorStop(1, 'transparent')
      this.ctx.fillStyle = pointGradient
      this.ctx.beginPath()
      this.ctx.arc(x, y, pointSize * 3, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.fillStyle = `rgba(200, 220, 255, ${pointAlpha})`
    }
    drawMemoryPoint()
    this.ctx.beginPath()
    this.ctx.arc(x, y, pointSize, 0, Math.PI * 2)
    this.ctx.fill()

    const drawMemoryLinks = () => {
      if (accessProbability > 0.6) {
        const connectionAlpha = (accessProbability - 0.6) * 2.5
        this.ctx.strokeStyle = `rgba(150, 200, 255, ${connectionAlpha * 0.6})`
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        this.ctx.lineTo(x, y)
        this.ctx.stroke()

        const sparkles = 3
        for (let s = 0; s < sparkles; s++) {
          const sparkX = (x * s) / sparkles + (Math.random() - 0.5) * 3
          const sparkY = (y * s) / sparkles + (Math.random() - 0.5) * 3
          this.ctx.fillStyle = `rgba(255, 255, 255, ${connectionAlpha * 0.8})`
          this.ctx.beginPath()
          this.ctx.arc(sparkX, sparkY, 0.5, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
    }
    drawMemoryLinks()
  }
  for (let i = 0; i < dataPoints; i++) {
    drawDimension(i)
  }

  const coreGradient = this.ctx.createRadialGradient(
    0,
    0,
    0,
    0,
    0,
    coreSize * 2
  )
  coreGradient.addColorStop(0, `rgba(255, 255, 255, 0.9)`)
  coreGradient.addColorStop(0.5, `rgba(200, 220, 255, 0.6)`)
  coreGradient.addColorStop(1, 'transparent')
  this.ctx.fillStyle = coreGradient
  this.ctx.beginPath()
  this.ctx.arc(0, 0, coreSize * 2, 0, Math.PI * 2)
  this.ctx.fill()

  this.ctx.restore()
}
export function renderFoldedDimension(this: CosmicEngine, size: number): void {
  const dimensionalLayers = 5
  const complexity = 24
  const timePhase = this.time * 0.8

  this.ctx.save()
  this.ctx.globalCompositeOperation = 'screen'

  for (let layer = 0; layer < dimensionalLayers; layer++) {
    const layerDepth = layer / dimensionalLayers
    const layerAlpha = 0.4 * (1 - layerDepth * 0.6)
    const phaseOffset = layer * Math.PI * 0.4
    this.ctx.strokeStyle = `rgba(${100 + layer * 30}, ${150 + layer * 20}, 255, ${layerAlpha})`
    this.ctx.lineWidth = 2 - layer * 0.3
    this.ctx.beginPath()
    const drawFoldedFace = () => {
      for (let i = 0; i <= complexity; i++) {
        const t = i / complexity
        const spiralAngle = t * Math.PI * 6 + phaseOffset + timePhase

        const hyperX = Math.cos(spiralAngle) * size * (0.3 + t * 0.4)
        const hyperY = Math.sin(spiralAngle) * size * (0.3 + t * 0.4)
        const hyperZ = Math.sin(spiralAngle * 1.5 + timePhase) * size * 0.25
        const hyperW =
          Math.cos(spiralAngle * 0.7 + timePhase + layer) * size * 0.15

        const perspectiveScale = 1 + (hyperZ + hyperW) / (size * 3)
        const x =
          hyperX / perspectiveScale +
          Math.sin(timePhase + t * 4) * layerDepth * 5
        const y =
          hyperY / perspectiveScale +
          Math.cos(timePhase + t * 3) * layerDepth * 5

        if (i === 0) this.ctx.moveTo(x, y)
        else this.ctx.lineTo(x, y)
      }
    }
    drawFoldedFace()
    this.ctx.stroke()

    const drawFoldEnergy = () => {
      if (layer < 2) {
        const nodeCount = 6 + layer * 2
        for (let n = 0; n < nodeCount; n++) {
          const nodeAngle = (n / nodeCount) * Math.PI * 2 + timePhase + layer
          const nodeRadius = size * (0.2 + layer * 0.1)
          const nodeX = Math.cos(nodeAngle) * nodeRadius
          const nodeY = Math.sin(nodeAngle) * nodeRadius

          const nodeGradient = this.ctx.createRadialGradient(
            nodeX,
            nodeY,
            0,
            nodeX,
            nodeY,
            6
          )
          nodeGradient.addColorStop(
            0,
            `rgba(255, 255, 255, ${layerAlpha * 0.8})`
          )
          nodeGradient.addColorStop(1, 'transparent')

          this.ctx.fillStyle = nodeGradient
          this.ctx.beginPath()
          this.ctx.arc(nodeX, nodeY, 6, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
    }
    drawFoldEnergy()
  }

  this.ctx.restore()
}
