export interface RGB {
  r: number
  g: number
  b: number
}

export interface CosmicSettings {
  starDensity: number
  nebulaDensity: number
  dustDensity: number
  asteroidDensity: number
  cometDensity: number
  timeSpeed: number
  colorPalette: string
}

export type Dust = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  twinkle: number
}

export type Nebula = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  hue: number
  opacity: number
  pulsePhase: number
}

export type Star = {
  x: number
  y: number
  size: number
  brightness: number
  twinkleSpeed: number
  twinklePhase: number
  temperature: number
  starType: 'dwarf' | 'giant' | 'supergiant' | 'neutron'
  color: { r: number; g: number; b: number }
  distance: number
  depth: number
}

export type Meteor = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  brightness: number
  color: { r: number; g: number; b: number }
  trail: Array<{ x: number; y: number; opacity: number }>
  life: number
  maxLife: number
  type: 'sporadic' | 'shower' | 'fireball' | 'bolide'
}

export type Asteroid = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  type: 'rocky' | 'metallic' | 'carbonaceous' | 'icy'
  brightness: number
  color: { r: number; g: number; b: number }
  trail: Array<{ x: number; y: number; opacity: number }>
  life: number
  maxLife: number
}

export type Comet = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  nucleusSize: number
  tailLength: number
  tailAngle: number
  brightness: number
  color: { r: number; g: number; b: number }
  tail: Array<{ x: number; y: number; opacity: number; size: number }>
  life: number
  maxLife: number
  orbitCenter: { x: number; y: number }
  orbitRadius: number
  orbitAngle: number
  orbitSpeed: number
}

export type StellarNursery = {
  x: number
  y: number
  size: number
  density: number
  temperature: number
  age: number
  stars: Array<{
    x: number
    y: number
    mass: number
    age: number
    lifecycle:
      | 'protostar'
      | 'main_sequence'
      | 'giant'
      | 'supernova'
      | 'white_dwarf'
      | 'neutron_star'
  }>
}

export type Constellation = {
  name: string
  stars: Array<{ x: number; y: number; brightness: number }>
  connections: Array<{ from: number; to: number }>
  visibility: number
  mythologyHue: number
}

export type PlanetarySystem = {
  x: number
  y: number
  star: { mass: number; temperature: number; age: number }
  protoplanetaryDisk: {
    innerRadius: number
    outerRadius: number
    density: number
    particles: Array<{ angle: number; distance: number; size: number }>
  }
  planets: Array<{
    distance: number
    size: number
    angle: number
    speed: number
  }>
}

export type DarkMatterParticle = {
  x: number
  y: number
  vx: number
  vy: number
  mass: number
  influence: number
}

export type BlackHole = {
  x: number
  y: number
  mass: number
  eventHorizon: number
  accretionDisk: {
    innerRadius: number
    outerRadius: number
    temperature: number
    rotation: number
  }
  gravitationalLensing: number
  absorbedMatter: number
  maxAbsorption: number
  lifespan: number
  age: number
  explosionPower: number
}

export type Galaxy = {
  x: number
  y: number
  type: 'spiral' | 'elliptical' | 'irregular'
  size: number
  rotation: number
  arms: number
  merging: boolean
  mergeTarget?: number
  mergeProgress?: number
}

export type Quasar = {
  x: number
  y: number
  luminosity: number
  jetAngle: number
  jetLength: number
  jetWidth: number
  pulsation: number
}

export type Magnetar = {
  x: number
  y: number
  magneticField: number
  pulsePeriod: number
  phaseOffset: number
  flareIntensity: number
  lastFlare: number
}

export type Element = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  hue: number
  type: number
  life: number
  maxLife: number
  rotation: number
  rotationSpeed: number
  consciousness: number
  memory: number[]
  dna: string
  emotion: number
  magnetism: number
  temperature: number
  dimension: number
  quantumState: number
  dreams: Array<{ x: number; y: number; intensity: number }>
  depth: number
}
