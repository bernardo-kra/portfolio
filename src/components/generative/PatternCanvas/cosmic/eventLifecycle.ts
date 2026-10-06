import type { SpaceEvent } from './eventState'
import type { CosmicEngine } from './CosmicEngine'
export function handleSpaceEvents(this: CosmicEngine): void {
  const spawnTransients = () => {
    if (Math.random() < 0.0001) {
      this.createSupernova()
    }
    if (Math.random() < 0.0003) {
      this.createSolarFlare()
    }
    if (Math.random() < 0.0002) {
      this.createComet()
    }
    if (Math.random() < 0.0005) {
      this.createAurora()
    }
    if (Math.random() < 0.001) {
      this.createSatellite()
    }
    if (Math.random() < 0.0008) {
      this.createSpaceDebris()
    }
    if (Math.random() < 0.0001) {
      this.createPulsar()
    }
    if (Math.random() < 0.00005) {
      this.createQuasar()
    }
  }
  const spawnStellarPhenomena = () => {
    if (Math.random() < 0.00002) {
      this.createGammaRayBurst()
    }
    if (Math.random() < 0.0001) {
      this.createStellarCollision()
    }
    if (Math.random() < 0.00005) {
      this.createBlackHoleFormation()
    }
    if (Math.random() < 0.00008) {
      this.createNeutronStarMerger()
    }
    if (Math.random() < 0.0003) {
      this.createStellarWind()
    }
    if (Math.random() < 0.0001) {
      this.createMagnetarFlare()
    }
    if (Math.random() < 0.0002) {
      this.createNova()
    }
    if (Math.random() < 0.0001) {
      this.createWhiteDwarfIgnition()
    }
  }
  spawnTransients()
  spawnStellarPhenomena()
}
export function updateSpaceEvents(this: CosmicEngine): void {
  for (let i = this.spaceEvents.length - 1; i >= 0; i--) {
    const event = this.spaceEvents[i]
    event.life += 1

    if (event.life >= event.maxLife) {
      this.spaceEvents.splice(i, 1)
      continue
    }

    const progress = event.life / event.maxLife

    if (event.type === 'supernova') {
      event.data.shockwaveRadius = progress * 150
      event.intensity = Math.sin(progress * Math.PI) * 1.5

      if (event.data.vx !== undefined) {
        event.x += event.data.vx * (1 - progress * 0.8)
        event.y += event.data.vy * (1 - progress * 0.8)
      }
    }
  }
}
export function renderSpaceEvents(this: CosmicEngine): void {
  for (const event of this.spaceEvents) {
    renderSpaceEvent.call(this, event)
  }
}
function renderSpaceEvent(this: CosmicEngine, event: SpaceEvent): void {
  if (event.type === 'supernova') {
    this.renderSupernova(event)
  } else if (event.type === 'pulsar') {
    this.renderPulsar(event)
  } else if (event.type === 'quasar') {
    this.renderQuasar(event)
  } else if (event.type === 'gamma_ray_burst') {
    this.renderGammaRayBurst(event)
  } else if (event.type === 'stellar_collision') {
    this.renderStellarCollision(event)
  } else if (event.type === 'black_hole_formation') {
    this.renderBlackHoleFormation(event)
  } else if (event.type === 'neutron_star_merger') {
    this.renderNeutronStarMerger(event)
  } else if (event.type === 'stellar_wind') {
    this.renderStellarWind(event)
  } else if (event.type === 'magnetar_flare') {
    this.renderMagnetarFlare(event)
  } else if (event.type === 'nova') {
    this.renderNova(event)
  } else if (event.type === 'white_dwarf_ignition') {
    this.renderWhiteDwarfIgnition(event)
  }
}
