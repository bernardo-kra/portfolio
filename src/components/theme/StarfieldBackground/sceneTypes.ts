export interface Nebula {
  x: number
  y: number
  width: number
  height: number
  color: string
  opacity: number
  speed: number
}

export interface Planet {
  x: number
  y: number
  radius: number
  color: string
  speed: number
  phase: number
}

export interface Comet {
  x: number
  y: number
  vx: number
  vy: number
  tail: { x: number; y: number }[]
  life: number
}

export interface Star {
  x: number
  y: number
  r: number
  speed: number
  color: string
  depth: number
}
export interface SceneFrame {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  mouse: { x: number; y: number }
  disableParallax: boolean
}
