import type { SpaceEvent } from './eventState'
import type {
  Asteroid,
  BlackHole,
  Comet,
  Constellation,
  CosmicSettings,
  DarkMatterParticle,
  Dust,
  Element,
  Galaxy,
  Magnetar,
  Meteor,
  Nebula,
  PlanetarySystem,
  Quasar,
  Star,
  StellarNursery,
} from './particleState'
export class CosmicState {
  time: number = 0
  settings: CosmicSettings = {
    starDensity: 0.8,
    nebulaDensity: 0.3,
    dustDensity: 0.4,
    asteroidDensity: 0.6,
    cometDensity: 0.4,
    timeSpeed: 1.0,
    colorPalette: 'nebula',
  }
  paletteTransitionTime: number = 0
  cosmicDust: Dust[] = []
  nebulae: Nebula[] = []
  stars: Star[] = []
  meteors: Meteor[] = []
  meteorShowerActive: boolean = false
  meteorShowerTimer: number = 0
  meteorShowerIntensity: number = 0
  radiant: { x: number; y: number } = { x: 0, y: 0 }
  spaceEvents: SpaceEvent[] = []
  asteroids: Asteroid[] = []
  comets: Comet[] = []
  stellarNurseries: StellarNursery[] = []
  constellations: Constellation[] = []
  planetarySystems: PlanetarySystem[] = []
  darkMatterParticles: DarkMatterParticle[] = []
  blackHoles: BlackHole[] = []
  galaxies: Galaxy[] = []
  quasars: Quasar[] = []
  magnetars: Magnetar[] = []
  blackHoleCooldown: number = 0
  lastBlackHoleExplosion: number = 0
  elements: Element[] = []
  constructor(
    public ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number
  ) {}
}
