import type { CosmicState } from './CosmicState'
import type { SpaceEvent } from './eventState'
import type {
  BlackHole,
  CosmicSettings,
  Element,
  Galaxy,
  Meteor,
  RGB,
  Star,
  StellarNursery,
} from './particleState'
export interface CosmicEngine extends CosmicState {
  updateSettings(newSettings: Partial<CosmicSettings>): void
  regenerateElements(): void
  getColorPalette(): string[]
  initializeAmbientParticles(): void
  initializeAsteroids(): void
  initializeComets(): void
  initializeAdvancedAstronomicalElements(): void
  initializeStellarNurseries(): void
  getStellarLifecycleStage(
    age: number
  ): StellarNursery['stars'][number]['lifecycle']
  initializeConstellations(): void
  initializePlanetarySystems(): void
  initializeDarkMatter(): void
  initializeBlackHoles(): void
  initializeGalaxies(): void
  initializeQuasars(): void
  initializeMagnetars(): void
  getRandomStarType(): Star['starType']
  getStarTemperature(type: string): number
  temperatureToColor(temp: number): RGB
  getStarSize(type: string, distance: number): number
  getStarBrightness(type: string, distance: number): number
  getTwinkleSpeed(distance: number): number
  initElements(): void
  renderAmbientParticles(): void
  renderAdvancedAstronomicalElements(): void
  renderNebulae(): void
  renderStars(): void
  renderConstellationStar(star: Star, intensity: number): void
  renderRegularStar(star: Star, intensity: number): void
  handleMeteorEvents(): void
  startMeteorShower(): void
  createSporadicMeteor(): void
  createShowerMeteor(): void
  createFireball(): void
  createBolide(): void
  createBaseMeteor(): Meteor
  getRandomMeteorColor(): RGB
  getShowerMeteorColor(): RGB
  renderCosmicDust(): void
  updateMeteors(): void
  renderMeteors(): void
  renderMeteorTrail(meteor: Meteor): void
  renderMeteorHead(meteor: Meteor): void
  renderMeteorGlow(meteor: Meteor): void
  handleSpaceEvents(): void
  createSupernova(): void
  createSolarFlare(): void
  createComet(): void
  createAurora(): void
  createSatellite(): void
  createSpaceDebris(): void
  createPulsar(): void
  createQuasar(): void
  createGammaRayBurst(): void
  createStellarCollision(): void
  createBlackHoleFormation(): void
  createNeutronStarMerger(): void
  createStellarWind(): void
  createMagnetarFlare(): void
  createNova(): void
  createWhiteDwarfIgnition(): void
  updateSupernova(event: SpaceEvent<'supernova'>): void
  updateSolarFlare(event: SpaceEvent<'solar_flare'>): void
  updateComet(event: SpaceEvent<'comet'>): void
  updateAurora(event: SpaceEvent<'aurora'>): void
  updateSatellite(event: SpaceEvent<'satellite'>): void
  updateSpaceDebris(event: SpaceEvent<'space_debris'>): void
  renderSolarFlare(event: SpaceEvent<'solar_flare'>): void
  renderComet(event: SpaceEvent<'comet'>): void
  renderAurora(event: SpaceEvent<'aurora'>): void
  renderSatellite(event: SpaceEvent<'satellite'>): void
  renderSpaceDebris(event: SpaceEvent<'space_debris'>): void
  updateAndRenderStellarNurseries(): void
  getStellarLifecycleColor(lifecycle: string): RGB
  getStellarLifecycleSize(lifecycle: string, mass: number): number
  renderConstellations(): void
  updateAndRenderPlanetarySystems(): void
  updateAndRenderDarkMatter(): void
  renderBlackHoles(): void
  updateAndRenderGalaxies(): void
  renderSpiralGalaxy(galaxy: Galaxy): void
  renderEllipticalGalaxy(galaxy: Galaxy): void
  renderIrregularGalaxy(galaxy: Galaxy): void
  renderQuasars(): void
  renderMagnetars(): void
  absorbNearbyElements(blackHole: BlackHole): void
  explodeBlackHole(blackHole: BlackHole, index: number): void
  updateSpaceEvents(): void
  renderSpaceEvents(): void
  renderSupernova(event: SpaceEvent<'supernova'>): void
  renderPulsar(event: SpaceEvent<'pulsar'>): void
  renderQuasar(event: SpaceEvent<'quasar'>): void
  renderGammaRayBurst(event: SpaceEvent<'gamma_ray_burst'>): void
  renderStellarCollision(event: SpaceEvent<'stellar_collision'>): void
  renderBlackHoleFormation(event: SpaceEvent<'black_hole_formation'>): void
  renderNeutronStarMerger(event: SpaceEvent<'neutron_star_merger'>): void
  renderStellarWind(event: SpaceEvent<'stellar_wind'>): void
  renderMagnetarFlare(event: SpaceEvent<'magnetar_flare'>): void
  renderNova(event: SpaceEvent<'nova'>): void
  renderWhiteDwarfIgnition(event: SpaceEvent<'white_dwarf_ignition'>): void
  updateAsteroids(): void
  updateComets(): void
  renderAsteroids(): void
  renderComets(): void
  generateDNA(): string
  addRandomElement(): void
  render(timestamp: number, pauseGeneration?: boolean): void
  updateElements(): void
  renderElements(): void
  renderShape(type: number, size: number): void
  renderThought(size: number): void
  renderEmotion(size: number): void
  renderMemory(size: number): void
  renderFoldedDimension(size: number): void
  renderLucidDream(size: number): void
  checkCollisions(): void
  createCollisionEffect(elem1: Element, elem2: Element): void
  handleCollision(
    elem1: Element,
    elem2: Element,
    indices: { first: number; second: number }
  ): void
  createCollisionOffspring(
    parent1: Element,
    parent2: Element,
    center: { x: number; y: number }
  ): void
  createFusionElement(
    pair: { first: Element; second: Element },
    center: { x: number; y: number },
    indices: { first: number; second: number }
  ): void
  crossoverDNA(dna1: string, dna2: string): string
  fuseDNA(dna1: string, dna2: string): string
  blendMemories(mem1: number[], mem2: number[]): number[]
  updateConsciousness(element: Element): void
  updateEmotions(element: Element): void
  processMemories(element: Element): void
  quantumFluctuations(element: Element): void
  drawConnections(element: Element): void
  createBurst(): void
  createBlackHole(): void
  createWormhole(): void
  createTimeDistortion(): void
  createMagneticField(): void
}
