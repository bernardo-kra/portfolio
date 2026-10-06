import type { CosmicEngine } from './CosmicEngine'
import type { RGB, Star, StellarNursery } from './particleState'
export function getRandomStarType(this: CosmicEngine): Star['starType'] {
  return 'giant'
}
export function getStarTemperature(this: CosmicEngine, type: string): number {
  void type

  return 5000 + Math.random() * 1000
}
export function temperatureToColor(this: CosmicEngine, temp: number): RGB {
  void temp

  return { r: 255, g: 255, b: 255 }
}
export function getStarSize(
  this: CosmicEngine,
  type: string,
  distance: number
): number {
  const baseSizes: Record<string, number> = {
    dwarf: 0.5,
    giant: 1.2,
    supergiant: 2.0,
    neutron: 0.3,
  }
  const distanceFactor = 0.3 + (1 - distance) * 0.7
  return baseSizes[type] * distanceFactor
}
export function getStarBrightness(
  this: CosmicEngine,
  type: string,
  distance: number
): number {
  const baseBrightness: Record<string, number> = {
    dwarf: 0.3,
    giant: 0.6,
    supergiant: 0.8,
    neutron: 0.9,
  }
  const distanceFactor = 0.2 + (1 - distance) * 0.8
  return baseBrightness[type] * distanceFactor
}
export function getTwinkleSpeed(this: CosmicEngine, distance: number): number {
  return 0.2 + distance * 0.8
}
export function getStellarLifecycleStage(
  this: CosmicEngine,
  age: number
): StellarNursery['stars'][number]['lifecycle'] {
  if (age < 50) return 'protostar'
  if (age < 400) return 'main_sequence'
  if (age < 600) return 'giant'
  if (age < 700) return 'supernova'
  if (age < 900) return 'white_dwarf'
  return 'neutron_star'
}
export function getStellarLifecycleColor(
  this: CosmicEngine,
  lifecycle: string
): RGB {
  switch (lifecycle) {
    case 'protostar':
      return { r: 255, g: 100, b: 100 }
    case 'main_sequence':
      return { r: 255, g: 255, b: 200 }
    case 'giant':
      return { r: 255, g: 150, b: 50 }
    case 'supernova':
      return { r: 255, g: 255, b: 255 }
    case 'white_dwarf':
      return { r: 200, g: 200, b: 255 }
    case 'neutron_star':
      return { r: 150, g: 255, b: 255 }
    default:
      return { r: 255, g: 255, b: 255 }
  }
}
export function getStellarLifecycleSize(
  this: CosmicEngine,
  lifecycle: string,
  mass: number
): number {
  const baseSizes: Record<string, number> = {
    protostar: 1.5,
    main_sequence: 1,
    giant: 3,
    supernova: 5,
    white_dwarf: 0.5,
    neutron_star: 0.3,
  }
  return (baseSizes[lifecycle] || 1) * mass
}
