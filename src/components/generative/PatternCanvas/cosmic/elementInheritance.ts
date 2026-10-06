import type { CosmicEngine } from './CosmicEngine'
import type { Element } from './particleState'
export function createCollisionOffspring(
  this: CosmicEngine,
  parent1: Element,
  parent2: Element,
  center: { x: number; y: number }
): void {
  const { x, y } = center
  const hybridDNA = this.crossoverDNA(parent1.dna, parent2.dna)
  let hybridType = Math.random() < 0.5 ? parent1.type : parent2.type

  if (Math.random() < 0.2) {
    hybridType = Math.floor(Math.random() * 25)
  }

  this.elements.push({
    x: x + (Math.random() - 0.5) * 30,
    y: y + (Math.random() - 0.5) * 30,
    vx: (parent1.vx + parent2.vx) * 0.5 + (Math.random() - 0.5),
    vy: (parent1.vy + parent2.vy) * 0.5 + (Math.random() - 0.5),
    size: (parent1.size + parent2.size) * 0.4 + Math.random() * 10,
    hue: (parent1.hue + parent2.hue) / 2 + (Math.random() - 0.5) * 60,
    type: hybridType,
    life: 0,
    maxLife: Math.max(parent1.maxLife, parent2.maxLife) * 0.8,
    rotation: 0,
    rotationSpeed: (parent1.rotationSpeed + parent2.rotationSpeed) / 2,
    consciousness: (parent1.consciousness + parent2.consciousness) / 2 + 0.1,
    memory: this.blendMemories(parent1.memory, parent2.memory),
    dna: hybridDNA,
    emotion: (parent1.emotion + parent2.emotion) / 2,
    magnetism: (parent1.magnetism + parent2.magnetism) / 2,
    temperature: Math.max(parent1.temperature, parent2.temperature),
    dimension: (parent1.dimension + parent2.dimension) / 2,
    quantumState: Math.random(),
    dreams: [...parent1.dreams.slice(0, 2), ...parent2.dreams.slice(0, 2)],
    depth: Math.random() * 100,
  })
}
export function createFusionElement(
  this: CosmicEngine,
  pair: { first: Element; second: Element },
  center: { x: number; y: number },
  indices: { first: number; second: number }
): void {
  const { first: elem1, second: elem2 } = pair
  const { x, y } = center
  const { first: index1, second: index2 } = indices
  const fusedDNA = this.fuseDNA(elem1.dna, elem2.dna)

  const fusedElement = {
    x: x,
    y: y,
    vx: (elem1.vx + elem2.vx) / 2,
    vy: (elem1.vy + elem2.vy) / 2,
    size: Math.max(elem1.size, elem2.size) * 1.2,
    hue: (elem1.hue + elem2.hue) / 2,
    type: 20 + Math.floor(Math.random() * 5),
    life: 0,
    maxLife: elem1.maxLife + elem2.maxLife,
    rotation: 0,
    rotationSpeed: (elem1.rotationSpeed + elem2.rotationSpeed) / 2,
    consciousness: Math.min(1, elem1.consciousness + elem2.consciousness),
    memory: [...elem1.memory, ...elem2.memory].slice(0, 8),
    dna: fusedDNA,
    emotion: (elem1.emotion + elem2.emotion) / 2,
    magnetism: elem1.magnetism + elem2.magnetism,
    temperature: Math.max(elem1.temperature, elem2.temperature) * 1.2,
    dimension: Math.max(elem1.dimension, elem2.dimension),
    quantumState: (elem1.quantumState + elem2.quantumState) / 2,
    dreams: [...elem1.dreams, ...elem2.dreams],
    depth: Math.random() * 100,
  }

  this.elements.splice(Math.max(index1, index2), 1)
  this.elements.splice(Math.min(index1, index2), 1)
  this.elements.push(fusedElement)
}
export function crossoverDNA(
  this: CosmicEngine,
  dna1: string,
  dna2: string
): string {
  const result = []
  const minLength = Math.min(dna1.length, dna2.length)

  for (let i = 0; i < minLength; i++) {
    if (Math.random() < 0.5) {
      result.push(dna1[i])
    } else {
      result.push(dna2[i])
    }
  }

  if (Math.random() < 0.1) {
    const mutations = ['∞', '◊', '※', '⚡', '✧', '◈', '⟡', '◉']
    const mutationIndex = Math.floor(Math.random() * result.length)
    result[mutationIndex] =
      mutations[Math.floor(Math.random() * mutations.length)]
  }

  return result.join('')
}
export function fuseDNA(
  this: CosmicEngine,
  dna1: string,
  dna2: string
): string {
  void (dna1 + dna2)
  const transcendent = ['∞', '◊', '※', '⚡', '✧', '◈', '⟡', '◉', '⬟', '◎']
  return Array.from(
    { length: 15 },
    () => transcendent[Math.floor(Math.random() * transcendent.length)]
  ).join('')
}
export function blendMemories(
  this: CosmicEngine,
  mem1: number[],
  mem2: number[]
): number[] {
  const blended = []
  const maxLength = Math.max(mem1.length, mem2.length)

  for (let i = 0; i < maxLength; i++) {
    const val1 = mem1[i] || 0
    const val2 = mem2[i] || 0
    blended.push((val1 + val2) / 2 + (Math.random() - 0.5) * 0.1)
  }

  return blended.slice(0, 7)
}
