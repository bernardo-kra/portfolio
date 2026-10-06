import type { RGB } from './particleState'
export interface EventPayloads {
  supernova: {
    phase: number
    expansionRadius?: number
    shockwaveRadius: number
    rings?: number
  } & ({ vx: number; vy: number } | { vx?: undefined; vy?: undefined })
  solar_flare: { angle: number; length: number }
  comet: {
    vx: number
    vy: number
    tail: Array<{ x: number; y: number; opacity: number }>
  }
  aurora: { wavePhase: number; waveSpeed: number; layers: number }
  satellite: { vx: number; vy: number; blinkPhase: number }
  space_debris: {
    vx: number
    vy: number
    rotation: number
    rotationSpeed: number
  }
  pulsar: {
    pulsePhase: number
    pulseSpeed: number
    beamAngle: number
    beamLength: number
  }
  quasar: {
    jetAngle: number
    jetLength: number
    accretionDisk: {
      innerRadius: number
      outerRadius: number
      rotation: number
    }
  }
  gamma_ray_burst: {
    beamAngle: number
    beamWidth: number
    beamLength: number
    energy: number
  }
  stellar_collision: {
    explosionRadius: number
    shockwaveRadius: number
    debris: { angle: number; distance: number; speed: number }[]
  }
  black_hole_formation: {
    eventHorizon: number
    accretionDisk: {
      innerRadius: number
      outerRadius: number
      rotation: number
    }
    jets: { angle1: number; angle2: number; length: number }
  }
  neutron_star_merger: {
    mergerRadius: number
    gravitationalWaves: {
      angle: number
      amplitude: number
      frequency: number
    }[]
  }
  stellar_wind: {
    windDirection: number
    windSpeed: number
    particles: { angle: number; distance: number; speed: number }[]
  }
  magnetar_flare: {
    magneticField: { strength: number; angle: number }
    flareIntensity: number
    particleStreams: { angle: number; length: number; speed: number }[]
  }
  nova: {
    explosionRadius: number
    brightness: number
    shell: { innerRadius: number; outerRadius: number }
  }
  white_dwarf_ignition: {
    ignitionRadius: number
    temperature: number
    fusion: {
      intensity: number
      particles: { angle: number; distance: number; energy: number }[]
    }
  }
}
export type EventKind = keyof EventPayloads
export type SpaceEvent<K extends EventKind = EventKind> = {
  [P in K]: {
    type: P
    x: number
    y: number
    life: number
    maxLife: number
    intensity: number
    size: number
    color: RGB
    data: EventPayloads[P]
  }
}[K]
