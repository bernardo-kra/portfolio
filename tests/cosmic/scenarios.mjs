const palettes = [
  'nebula',
  'aurora',
  'supernova',
  'cosmic',
  'galaxy',
  'stellar',
]
const creators = [
  'Supernova',
  'SolarFlare',
  'Comet',
  'Aurora',
  'Satellite',
  'SpaceDebris',
  'Pulsar',
  'Quasar',
  'GammaRayBurst',
  'StellarCollision',
  'BlackHoleFormation',
  'NeutronStarMerger',
  'StellarWind',
  'MagnetarFlare',
  'Nova',
  'WhiteDwarfIgnition',
]
const frames = (generator) => {
  for (const timestamp of [0, 16, 32, 96, 1000, 5000, 5020, 17000])
    generator.render(timestamp)
}

function eventRender(_, state) {
  for (const name of creators) state['create' + name]()
  for (let index = 0; index < creators.length; index++) {
    const event = state.spaceEvents[index]
    event.life = Math.floor(event.maxLife * 0.47)
    event.intensity = 0.81
    state['render' + creators[index]](event)
  }
  state.updateSpaceEvents()
  state.renderSpaceEvents()
}

function meteorRender(_, state) {
  state.startMeteorShower()
  for (const name of ['SporadicMeteor', 'ShowerMeteor', 'Fireball', 'Bolide'])
    state['create' + name]()
  for (let frame = 0; frame < 15; frame++) {
    state.handleMeteorEvents()
    state.updateMeteors()
    state.renderMeteors()
  }
}

function eventUpdates(_, state) {
  for (const name of creators) state['create' + name]()
  for (let phase = 0; phase < 4; phase++) {
    for (let index = 0; index < 6; index++) {
      const event = state.spaceEvents[index]
      event.life = Math.floor(event.maxLife * (0.05 + phase * 0.25))
      state['update' + creators[index]](event)
      state['render' + creators[index]](event)
    }
  }
  for (const event of state.spaceEvents) event.life = event.maxLife
  state.updateSpaceEvents()
}

function inheritance(_, state) {
  const first = state.elements[0]
  const second = state.elements[1]
  state.createCollisionEffect(first, second)
  // Internal helpers now group coordinates/indices; the public engine API is unchanged.
  if (state.createCollisionOffspring.length === 4) {
    state.createCollisionOffspring(first, second, 100, 120)
    state.createFusionElement(first, second, 100, 120, 0, 1)
  } else {
    state.createCollisionOffspring(first, second, { x: 100, y: 120 })
    state.createFusionElement(
      { first, second },
      { x: 100, y: 120 },
      { first: 0, second: 1 }
    )
  }
  state.updateElements()
  state.renderElements()
}

function drawPopulations(_, state) {
  state.renderStars()
  state.renderNebulae()
  state.renderCosmicDust()
  state.updateAndRenderStellarNurseries()
  state.updateAndRenderPlanetarySystems()
  state.updateAndRenderDarkMatter()
  state.updateAndRenderGalaxies()
  for (const type of ['spiral', 'elliptical', 'irregular']) {
    const galaxy = {
      x: 40,
      y: 80,
      type,
      size: 50,
      rotation: 0.2,
      arms: 3,
      merging: false,
    }
    state['render' + type[0].toUpperCase() + type.slice(1) + 'Galaxy'](galaxy)
  }
  state.renderQuasars()
  state.renderMagnetars()
}

function blackHoleLifecycle(_, state) {
  const blackHole = {
    x: 100,
    y: 100,
    mass: 30,
    eventHorizon: 15,
    accretionDisk: {
      innerRadius: 25,
      outerRadius: 60,
      temperature: 18000,
      rotation: 0.03,
    },
    gravitationalLensing: 100,
    absorbedMatter: 0,
    maxAbsorption: 10000,
    lifespan: 1000,
    age: 0,
    explosionPower: 0,
  }
  state.blackHoles = [blackHole]
  state.createSporadicMeteor()
  state.createSupernova()
  // Keep one body of every population near the horizon to exercise removal order.
  for (const key of [
    'elements',
    'stars',
    'cosmicDust',
    'meteors',
    'spaceEvents',
    'planetarySystems',
    'stellarNurseries',
    'galaxies',
    'nebulae',
  ]) {
    if (state[key][0]) Object.assign(state[key][0], { x: 101, y: 101 })
  }
  state.absorbNearbyElements(blackHole)
  state.renderBlackHoles()
  blackHole.absorbedMatter = 3
  blackHole.age = 1000
  state.renderBlackHoles()
  state.updateSpaceEvents()
  state.renderSpaceEvents()
}

function shapePaths(_, state) {
  state.time = 3.4
  for (let type = 0; type <= 24; type++) state.renderShape(type, 24)
  state.renderShape(999, 24)
}

function collisions(_, state) {
  for (const element of state.elements)
    Object.assign(element, { x: 200, y: 120, size: 18 })
  state.checkCollisions()
  state.elements = state.elements.slice(0, 5)
  state.checkCollisions()
  state.updateElements()
  state.renderElements()
}

function orbitalBoundaries(generator, state) {
  const asteroid = state.asteroids[0]
  const comet = state.comets[0]
  Object.assign(asteroid, {
    x: -60,
    y: 400,
    vx: -2,
    vy: 2,
    life: asteroid.maxLife,
  })
  Object.assign(comet, { life: comet.maxLife, orbitAngle: 8 })
  for (let frame = 0; frame < 40; frame++) generator.render(frame * 16)
}

export const scenarios = [
  { name: 'initial-state', run: () => {} },
  { name: 'public-frames', run: frames },
  {
    name: 'pause-remains-current-no-op',
    run(generator) {
      generator.render(96, true)
      generator.render(112, false)
    },
  },
  ...palettes.map((colorPalette) => ({
    name: 'palette-' + colorPalette,
    run(generator) {
      generator.updateSettings({ colorPalette })
      frames(generator)
    },
  })),
  {
    name: 'unknown-palette-fallback',
    run(generator) {
      generator.updateSettings({ colorPalette: 'unknown' })
      frames(generator)
    },
  },
  {
    name: 'zero-density',
    run(generator) {
      generator.updateSettings({
        starDensity: 0,
        nebulaDensity: 0,
        dustDensity: 0,
        asteroidDensity: 0,
        cometDensity: 0,
      })
      frames(generator)
    },
  },
  {
    name: 'high-density-fast-time',
    run(generator) {
      generator.updateSettings({
        starDensity: 1.2,
        nebulaDensity: 2,
        dustDensity: 1.5,
        asteroidDensity: 1,
        cometDensity: 1,
        timeSpeed: 2.5,
      })
      frames(generator)
    },
  },
  { name: 'reconstructed-resize', width: 1024, height: 768, run: frames },
  { name: 'all-event-renderers', run: eventRender },
  { name: 'event-update-phases-and-expiry', run: eventUpdates },
  { name: 'meteor-types-and-shower', run: meteorRender },
  { name: 'astronomical-populations', run: drawPopulations },
  { name: 'black-hole-absorption-explosion', run: blackHoleLifecycle },
  { name: 'all-25-shapes', run: shapePaths },
  { name: 'collision-both-limits-and-motion', run: collisions },
  { name: 'offspring-and-fusion', run: inheritance },
  { name: 'orbital-lifetimes-boundaries', run: orbitalBoundaries },
]
