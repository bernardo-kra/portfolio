import { CosmicSimulation } from './cosmic/CosmicSimulation'
import type { CosmicSettings } from './cosmic/particleState'
export type { CosmicSettings } from './cosmic/particleState'

export class InfiniteGenerator {
  private engine: CosmicSimulation
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.engine = new CosmicSimulation(ctx, width, height)
  }
  updateSettings(newSettings: Partial<CosmicSettings>) {
    this.engine.updateSettings(newSettings)
  }
  render(timestamp: number, pauseGeneration: boolean = false) {
    this.engine.render(timestamp, pauseGeneration)
  }
}
