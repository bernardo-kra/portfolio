export interface CosmicSettings {
  starDensity: number
  nebulaDensity: number
  dustDensity: number
  asteroidDensity: number
  cometDensity: number
  timeSpeed: number
  colorPalette: string
}

export class InfiniteGenerator {
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number
  private time: number = 0
  private settings: CosmicSettings = {
    starDensity: 0.8,
    nebulaDensity: 0.3,
    dustDensity: 0.4,
    asteroidDensity: 0.6,
    cometDensity: 0.4,
    timeSpeed: 1.0,
    colorPalette: 'nebula'
  }

  private paletteTransitionTime: number = 0
  private cosmicDust: Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    twinkle: number
  }> = []
  private nebulae: Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    hue: number
    opacity: number
    pulsePhase: number
  }> = []
  private stars: Array<{
    x: number
    y: number
    size: number
    brightness: number
    twinkleSpeed: number
    twinklePhase: number
    temperature: number
    starType: 'dwarf' | 'giant' | 'supergiant' | 'neutron'
    color: {r: number, g: number, b: number}
    distance: number
    depth: number
  }> = []
  private meteors: Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    brightness: number
    color: {r: number, g: number, b: number}
    trail: Array<{x: number, y: number, opacity: number}>
    life: number
    maxLife: number
    type: 'sporadic' | 'shower' | 'fireball' | 'bolide'
  }> = []
  private meteorShowerActive: boolean = false
  private meteorShowerTimer: number = 0
  private meteorShowerIntensity: number = 0
  private radiant: {x: number, y: number} = {x: 0, y: 0}
  private spaceEvents: Array<{
    type: 'supernova' | 'solar_flare' | 'comet' | 'aurora' | 'satellite' | 'space_debris' | 'pulsar' | 'quasar' | 'gamma_ray_burst' | 'stellar_collision' | 'black_hole_formation' | 'neutron_star_merger' | 'stellar_wind' | 'magnetar_flare' | 'nova' | 'white_dwarf_ignition'
    x: number
    y: number
    life: number
    maxLife: number
    intensity: number
    size: number
    color: {r: number, g: number, b: number}
    data?: any
  }> = []

  private asteroids: Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    rotation: number
    rotationSpeed: number
    type: 'rocky' | 'metallic' | 'carbonaceous' | 'icy'
    brightness: number
    color: {r: number, g: number, b: number}
    trail: Array<{x: number, y: number, opacity: number}>
    life: number
    maxLife: number
  }> = []

  private comets: Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    nucleusSize: number
    tailLength: number
    tailAngle: number
    brightness: number
    color: {r: number, g: number, b: number}
    tail: Array<{x: number, y: number, opacity: number, size: number}>
    life: number
    maxLife: number
    orbitCenter: {x: number, y: number}
    orbitRadius: number
    orbitAngle: number
    orbitSpeed: number
  }> = []

  private stellarNurseries: Array<{
    x: number
    y: number
    size: number
    density: number
    temperature: number
    age: number
    stars: Array<{x: number, y: number, mass: number, age: number, lifecycle: 'protostar' | 'main_sequence' | 'giant' | 'supernova' | 'white_dwarf' | 'neutron_star'}>
  }> = []

  private constellations: Array<{
    name: string
    stars: Array<{x: number, y: number, brightness: number}>
    connections: Array<{from: number, to: number}>
    visibility: number
    mythologyHue: number
  }> = []

  private planetarySystems: Array<{
    x: number
    y: number
    star: {mass: number, temperature: number, age: number}
    protoplanetaryDisk: {innerRadius: number, outerRadius: number, density: number, particles: Array<{angle: number, distance: number, size: number}>}
    planets: Array<{distance: number, size: number, angle: number, speed: number}>
  }> = []

  private darkMatterParticles: Array<{
    x: number
    y: number
    vx: number
    vy: number
    mass: number
    influence: number
  }> = []

  private blackHoles: Array<{
    x: number
    y: number
    mass: number
    eventHorizon: number
    accretionDisk: {innerRadius: number, outerRadius: number, temperature: number, rotation: number}
    gravitationalLensing: number
    absorbedMatter: number
    maxAbsorption: number
    lifespan: number
    age: number
    explosionPower: number
  }> = []

  private galaxies: Array<{
    x: number
    y: number
    type: 'spiral' | 'elliptical' | 'irregular'
    size: number
    rotation: number
    arms: number
    merging: boolean
    mergeTarget?: number
    mergeProgress?: number
  }> = []

  private quasars: Array<{
    x: number
    y: number
    luminosity: number
    jetAngle: number
    jetLength: number
    jetWidth: number
    pulsation: number
  }> = []

  private magnetars: Array<{
    x: number
    y: number
    magneticField: number
    pulsePeriod: number
    phaseOffset: number
    flareIntensity: number
    lastFlare: number
  }> = []

  private blackHoleCooldown: number = 0
  private lastBlackHoleExplosion: number = 0
  private elements: Array<{
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
    dreams: Array<{x: number, y: number, intensity: number}>
    depth: number
  }> = []

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.width = width
    this.height = height
    this.initializeAmbientParticles()
    this.initElements()
    this.initializeAdvancedAstronomicalElements()
    this.initializeAsteroids()
    this.initializeComets()
  }

  updateSettings(newSettings: Partial<CosmicSettings>) {
    this.settings = { ...this.settings, ...newSettings }
    this.regenerateElements()
  }

  private regenerateElements() {
    this.cosmicDust = []
    this.nebulae = []
    this.stars = []
    this.constellations = []
    this.asteroids = []
    this.comets = []
    this.initializeAmbientParticles()
    this.initElements()
    this.initializeAdvancedAstronomicalElements()
    this.initializeAsteroids()
    this.initializeComets()
  }

  private getColorPalette() {
    const palettes = {
      nebula: ['#ff6b9d', '#c44569', '#f8b500', '#4ecdc4'],
      aurora: ['#00d4aa', '#00a8cc', '#ff6b6b', '#4ecdc4'],
      supernova: ['#ff4757', '#ffa502', '#ff6348', '#ff7675'],
      cosmic: ['#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'],
      galaxy: ['#2d3436', '#636e72', '#74b9ff', '#0984e3'],
      stellar: ['#ffffff', '#f1c40f', '#e74c3c', '#9b59b6']
    }
    return palettes[this.settings.colorPalette as keyof typeof palettes] || palettes.nebula
  }


  private initializeAmbientParticles() {
    const dustCount = Math.floor(80 * this.settings.dustDensity)
    for (let i = 0; i < dustCount; i++) {
      this.cosmicDust.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        size: 0.3 + Math.random() * 0.8,
        opacity: 0.05 + Math.random() * 0.2,
        twinkle: Math.random() * Math.PI * 2
      })
    }

    const nebulaCount = Math.floor(3 * this.settings.nebulaDensity)
    for (let i = 0; i < nebulaCount; i++) {
      this.nebulae.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        size: 60 + Math.random() * 100,
        hue: Math.random() * 360,
        opacity: 0.02 + Math.random() * 0.08,
        pulsePhase: Math.random() * Math.PI * 2
      })
    }

    const starCount = Math.floor(50 * this.settings.starDensity)
    for (let i = 0; i < starCount; i++) {
      const starType = this.getRandomStarType()
      const temperature = this.getStarTemperature(starType)
      const color = this.temperatureToColor(temperature)
      const distance = Math.random()
      
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: this.getStarSize(starType, distance),
        brightness: this.getStarBrightness(starType, distance),
        twinkleSpeed: this.getTwinkleSpeed(distance),
        twinklePhase: Math.random() * Math.PI * 2,
        temperature: temperature,
        starType: starType,
        color: color,
        distance: distance,
        depth: distance * 100
      })
    }
  }

  private initializeAsteroids() {
    const asteroidCount = Math.floor(20 * this.settings.asteroidDensity)
    for (let i = 0; i < asteroidCount; i++) {
      const types = ['rocky', 'metallic', 'carbonaceous', 'icy'] as const
      const type = types[Math.floor(Math.random() * types.length)]
      
      let color = {r: 100, g: 100, b: 100}
      switch (type) {
        case 'rocky':
          color = {r: 120, g: 100, b: 80}
          break
        case 'metallic':
          color = {r: 150, g: 150, b: 160}
          break
        case 'carbonaceous':
          color = {r: 80, g: 60, b: 40}
          break
        case 'icy':
          color = {r: 200, g: 220, b: 240}
          break
      }
      
      this.asteroids.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 2 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        type: type,
        brightness: 0.3 + Math.random() * 0.4,
        color: color,
        trail: [],
        life: 0,
        maxLife: 3000 + Math.random() * 2000
      })
    }
  }

  private initializeComets() {
    const cometCount = Math.floor(3 * this.settings.cometDensity)
    for (let i = 0; i < cometCount; i++) {
      const orbitCenter = {
        x: this.width * 0.5 + (Math.random() - 0.5) * this.width * 0.3,
        y: this.height * 0.5 + (Math.random() - 0.5) * this.height * 0.3
      }
      
      this.comets.push({
        x: orbitCenter.x + (Math.random() - 0.5) * 200,
        y: orbitCenter.y + (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 3 + Math.random() * 4,
        nucleusSize: 1 + Math.random() * 2,
        tailLength: 50 + Math.random() * 100,
        tailAngle: Math.random() * Math.PI * 2,
        brightness: 0.4 + Math.random() * 0.4,
        color: {r: 200, g: 220, b: 255},
        tail: [],
        life: 0,
        maxLife: 5000 + Math.random() * 3000,
        orbitCenter: orbitCenter,
        orbitRadius: 100 + Math.random() * 200,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: 0.01 + Math.random() * 0.02
      })
    }
  }

  private initializeAdvancedAstronomicalElements() {
    this.initializeStellarNurseries()
    this.initializeConstellations()
    this.initializePlanetarySystems()
    this.initializeDarkMatter()
    this.initializeBlackHoles()
    this.initializeGalaxies()
    this.initializeQuasars()
    this.initializeMagnetars()
  }

  private initializeStellarNurseries() {
    if (Math.random() < 0.3) {
      for (let i = 0; i < 1; i++) {
      const nursery = {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 80 + Math.random() * 120,
        density: 0.3 + Math.random() * 0.7,
        temperature: 10 + Math.random() * 40,
        age: Math.random() * 1000,
        stars: [] as Array<{x: number, y: number, mass: number, age: number, lifecycle: 'protostar' | 'main_sequence' | 'giant' | 'supernova' | 'white_dwarf' | 'neutron_star'}>
      }

      const starCount = 8 + Math.floor(Math.random() * 15)
      for (let j = 0; j < starCount; j++) {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * nursery.size
        nursery.stars.push({
          x: nursery.x + Math.cos(angle) * distance,
          y: nursery.y + Math.sin(angle) * distance,
          mass: 0.1 + Math.random() * 2.5,
          age: Math.random() * nursery.age,
          lifecycle: this.getStellarLifecycleStage(Math.random() * nursery.age)
        })
      }
      this.stellarNurseries.push(nursery)
      }
    }
  }

  private getStellarLifecycleStage(age: number): 'protostar' | 'main_sequence' | 'giant' | 'supernova' | 'white_dwarf' | 'neutron_star' {
    if (age < 50) return 'protostar'
    if (age < 400) return 'main_sequence'
    if (age < 600) return 'giant'
    if (age < 700) return 'supernova'
    if (age < 900) return 'white_dwarf'
    return 'neutron_star'
  }

  private initializeConstellations() {
    const constellationNames = ['Orion', 'Ursa Major', 'Cassiopeia', 'Draco', 'Cygnus']
    
    for (let i = 0; i < 1; i++) {
      const constellation = {
        name: constellationNames[i] || `Constellation ${i}`,
        stars: [] as Array<{x: number, y: number, brightness: number}>,
        connections: [] as Array<{from: number, to: number}>,
        visibility: 0.3 + Math.random() * 0.7,
        mythologyHue: Math.random() * 360
      }

      const starCount = 5 + Math.floor(Math.random() * 8)
      const centerX = Math.random() * this.width
      const centerY = Math.random() * this.height
      const spread = 100 + Math.random() * 150

      for (let j = 0; j < starCount; j++) {
        constellation.stars.push({
          x: centerX + (Math.random() - 0.5) * spread,
          y: centerY + (Math.random() - 0.5) * spread,
          brightness: 0.4 + Math.random() * 0.6
        })
      }

      for (let j = 0; j < starCount - 1; j++) {
        if (Math.random() < 0.7) {
          constellation.connections.push({from: j, to: j + 1})
        }
      }

      this.constellations.push(constellation)
    }
  }

  private initializePlanetarySystems() {
    if (Math.random() < 0.4) {
      const system = {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        star: {
          mass: 0.5 + Math.random() * 2,
          temperature: 3000 + Math.random() * 4000,
          age: Math.random() * 10000
        },
        protoplanetaryDisk: {
          innerRadius: 20 + Math.random() * 30,
          outerRadius: 60 + Math.random() * 80,
          density: 0.2 + Math.random() * 0.6,
          particles: [] as Array<{angle: number, distance: number, size: number}>
        },
        planets: [] as Array<{distance: number, size: number, angle: number, speed: number}>
      }

      const particleCount = 200 + Math.floor(Math.random() * 300)
      for (let j = 0; j < particleCount; j++) {
        system.protoplanetaryDisk.particles.push({
          angle: Math.random() * Math.PI * 2,
          distance: system.protoplanetaryDisk.innerRadius + Math.random() * (system.protoplanetaryDisk.outerRadius - system.protoplanetaryDisk.innerRadius),
          size: 0.5 + Math.random() * 2
        })
      }

      const planetCount = 2 + Math.floor(Math.random() * 5)
      for (let j = 0; j < planetCount; j++) {
        const distance = system.protoplanetaryDisk.outerRadius + 20 + j * 30
        system.planets.push({
          distance: distance,
          size: 2 + Math.random() * 8,
          angle: Math.random() * Math.PI * 2,
          speed: 0.001 + Math.random() * 0.003
        })
      }

      this.planetarySystems.push(system)
    }
  }

  private initializeDarkMatter() {
    for (let i = 0; i < 15; i++) {
      this.darkMatterParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        mass: 0.5 + Math.random() * 2,
        influence: 5 + Math.random() * 15
      })
    }
  }

  private initializeBlackHoles() {
    if (Math.random() < 0.15 && this.blackHoleCooldown <= 0) {
      const blackHole = {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        mass: 10 + Math.random() * 40,
        eventHorizon: 8 + Math.random() * 15,
        accretionDisk: {
          innerRadius: 15 + Math.random() * 20,
          outerRadius: 40 + Math.random() * 60,
          temperature: 10000 + Math.random() * 50000,
          rotation: 0.01 + Math.random() * 0.03
        },
        gravitationalLensing: 20 + Math.random() * 30,
        absorbedMatter: 0,
        maxAbsorption: 50 + Math.random() * 100,
        lifespan: 1000 + Math.random() * 2000,
        age: 0,
        explosionPower: 0
      }
      this.blackHoles.push(blackHole)
    }
  }

  private initializeGalaxies() {
    if (Math.random() < 0.2) {
      this.galaxies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        type: Math.random() < 0.6 ? 'spiral' : Math.random() < 0.8 ? 'elliptical' : 'irregular',
        size: 150 + Math.random() * 200,
        rotation: 0.001 + Math.random() * 0.005,
        arms: 2 + Math.floor(Math.random() * 4),
        merging: Math.random() < 0.2,
        mergeProgress: 0
      })
    }

    if (this.galaxies.length >= 2 && this.galaxies[0].merging) {
      this.galaxies[0].mergeTarget = 1
    }
  }

  private initializeQuasars() {
    if (Math.random() < 0.15) {
      this.quasars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        luminosity: 0.8 + Math.random() * 0.2,
        jetAngle: Math.random() * Math.PI * 2,
        jetLength: 100 + Math.random() * 150,
        jetWidth: 8 + Math.random() * 12,
        pulsation: 0.02 + Math.random() * 0.03
      })
    }
  }

  private initializeMagnetars() {
    if (Math.random() < 0.1) {
      this.magnetars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        magneticField: 1000 + Math.random() * 9000,
        pulsePeriod: 0.1 + Math.random() * 2,
        phaseOffset: Math.random() * Math.PI * 2,
        flareIntensity: 0.5 + Math.random() * 0.5,
        lastFlare: 0
      })
    }
  }

  private getRandomStarType(): 'dwarf' | 'giant' | 'supergiant' | 'neutron' {
    return 'giant'
  }

  private getStarTemperature(type: string): number {
    return 5000 + Math.random() * 1000
  }

  private temperatureToColor(temp: number): {r: number, g: number, b: number} {
    return {r: 255, g: 255, b: 255}
  }

  private getStarSize(type: string, distance: number): number {
    const baseSizes = {
      dwarf: 0.5,
      giant: 1.2,
      supergiant: 2.0,
      neutron: 0.3
    }
    const distanceFactor = 0.3 + (1 - distance) * 0.7
    return baseSizes[type as keyof typeof baseSizes] * distanceFactor
  }

  private getStarBrightness(type: string, distance: number): number {
    const baseBrightness = {
      dwarf: 0.3,
      giant: 0.6,
      supergiant: 0.8,
      neutron: 0.9
    }
    const distanceFactor = 0.2 + (1 - distance) * 0.8
    return baseBrightness[type as keyof typeof baseBrightness] * distanceFactor
  }

  private getTwinkleSpeed(distance: number): number {
    return 0.2 + distance * 0.8
  }

  private initElements() {
    for (let i = 0; i < 15; i++) {
      this.addRandomElement()
    }
  }

  private renderAmbientParticles() {
    this.renderStars()
  }

  private renderAdvancedAstronomicalElements() {
    this.renderConstellations()
  }

  private renderNebulae() {
    // Removido - não renderizar nebulosas
  }

  private renderStars() {
    this.ctx.save()
    
    this.stars.forEach(star => {
      star.twinklePhase += star.twinkleSpeed * 0.008
      
      const atmosphericTwinkle = 0.7 + Math.sin(star.twinklePhase) * 0.3
      const scintillation = 0.9 + Math.sin(star.twinklePhase * 3.7) * 0.1
      const currentBrightness = star.brightness * atmosphericTwinkle * scintillation
      
      const intensity = Math.min(1, currentBrightness)
      
      this.renderConstellationStar(star, intensity)
    })
    
    this.ctx.restore()
  }

  private renderConstellationStar(star: any, intensity: number) {
    const {r, g, b} = star.color
    const alpha = intensity * (0.4 + star.distance * 0.6)
    
    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
    this.ctx.beginPath()
    this.ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2)
    this.ctx.fill()
  }

  private renderRegularStar(star: any, intensity: number) {
    // Removido - não renderizar estrelas individuais
  }


  private handleMeteorEvents() {
    if (!this.meteorShowerActive) {
      if (Math.random() < 0.0008) {
        this.startMeteorShower()
      } else if (Math.random() < 0.003) {
        this.createSporadicMeteor()
      }
    } else {
      this.meteorShowerTimer += 1
      
      if (this.meteorShowerTimer > 300) {
        this.meteorShowerActive = false
        this.meteorShowerTimer = 0
        this.meteorShowerIntensity = 0
      } else {
        const intensity = this.meteorShowerIntensity * Math.sin((this.meteorShowerTimer / 300) * Math.PI)
        if (Math.random() < intensity) {
          this.createShowerMeteor()
        }
      }
    }
    
    if (Math.random() < 0.0001) {
      this.createFireball()
    }
    
    if (Math.random() < 0.00005) {
      this.createBolide()
    }
  }

  private startMeteorShower() {
    this.meteorShowerActive = true
    this.meteorShowerTimer = 0
    this.meteorShowerIntensity = 0.05 + Math.random() * 0.1
    this.radiant = {
      x: Math.random() * this.width,
      y: Math.random() * this.height * 0.3
    }
  }

  private createSporadicMeteor() {
    const meteor = this.createBaseMeteor()
    meteor.type = 'sporadic'
    meteor.size = 1 + Math.random() * 2
    meteor.brightness = 0.6 + Math.random() * 0.4
    meteor.color = this.getRandomMeteorColor()
    this.meteors.push(meteor)
  }

  private createShowerMeteor() {
    const meteor = this.createBaseMeteor()
    ;(meteor as any).type = 'shower'
    
    const angle = Math.atan2(meteor.y - this.radiant.y, meteor.x - this.radiant.x)
    const speed = 8 + Math.random() * 6
    meteor.vx = Math.cos(angle) * speed
    meteor.vy = Math.sin(angle) * speed
    
    meteor.size = 0.8 + Math.random() * 1.5
    meteor.brightness = 0.5 + Math.random() * 0.3
    meteor.color = this.getShowerMeteorColor()
    this.meteors.push(meteor)
  }

  private createFireball() {
    const meteor = this.createBaseMeteor()
    ;(meteor as any).type = 'fireball'
    meteor.size = 3 + Math.random() * 4
    meteor.brightness = 0.9 + Math.random() * 0.1
    meteor.maxLife = 180 + Math.random() * 120
    meteor.color = {r: 255, g: 150 + Math.random() * 105, b: 50 + Math.random() * 100}
    
    const speed = 6 + Math.random() * 4
    const angle = Math.random() * Math.PI * 2
    meteor.vx = Math.cos(angle) * speed
    meteor.vy = Math.sin(angle) * speed
    
    this.meteors.push(meteor)
  }

  private createBolide() {
    const meteor = this.createBaseMeteor()
    ;(meteor as any).type = 'bolide'
    meteor.size = 5 + Math.random() * 6
    meteor.brightness = 1
    meteor.maxLife = 240 + Math.random() * 180
    meteor.color = {r: 255, g: 255, b: 200 + Math.random() * 55}
    
    const speed = 4 + Math.random() * 3
    const angle = Math.random() * Math.PI * 2
    meteor.vx = Math.cos(angle) * speed
    meteor.vy = Math.sin(angle) * speed
    
    this.meteors.push(meteor)
  }

  private createBaseMeteor() {
    const side = Math.floor(Math.random() * 4)
    let x, y
    
    switch (side) {
      case 0: x = -20; y = Math.random() * this.height; break
      case 1: x = this.width + 20; y = Math.random() * this.height; break
      case 2: x = Math.random() * this.width; y = -20; break
      default: x = Math.random() * this.width; y = this.height + 20; break
    }
    
    const speed = 5 + Math.random() * 8
    const targetX = Math.random() * this.width
    const targetY = Math.random() * this.height
    const angle = Math.atan2(targetY - y, targetX - x)
    
    return {
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 1,
      brightness: 0.8,
      color: {r: 255, g: 255, b: 255},
      trail: [],
      life: 0,
      maxLife: 60 + Math.random() * 90,
      type: 'sporadic' as 'sporadic' | 'shower' | 'fireball' | 'bolide'
    }
  }

  private getRandomMeteorColor() {
    const colors = [
      {r: 255, g: 255, b: 255},
      {r: 255, g: 200, b: 100},
      {r: 100, g: 255, b: 100},
      {r: 100, g: 150, b: 255},
      {r: 255, g: 100, b: 150}
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  private getShowerMeteorColor() {
    const hue = 40 + Math.random() * 20
    return {
      r: 255,
      g: 180 + Math.random() * 75,
      b: 80 + Math.random() * 120
    }
  }

    private renderCosmicDust() {
    // Removido - não renderizar poeira cósmica
  }

  private updateMeteors() {
    this.meteors = this.meteors.filter(meteor => {
      meteor.x += meteor.vx
      meteor.y += meteor.vy
      meteor.life++

      meteor.trail.unshift({x: meteor.x, y: meteor.y, opacity: meteor.brightness})
      
      if (meteor.trail.length > 20) {
        meteor.trail.pop()
      }

      meteor.trail.forEach((point, index) => {
        point.opacity *= 0.92
      })

      const isOutOfBounds = meteor.x < -50 || meteor.x > this.width + 50 || 
                           meteor.y < -50 || meteor.y > this.height + 50
      const isExpired = meteor.life > meteor.maxLife

      return !isOutOfBounds && !isExpired
    })
  }

  private renderMeteors() {
    this.ctx.save()
    
    this.meteors.forEach(meteor => {
      this.renderMeteorTrail(meteor)
      this.renderMeteorHead(meteor)
      
      if (meteor.type === 'fireball' || meteor.type === 'bolide') {
        this.renderMeteorGlow(meteor)
      }
    })
    
    this.ctx.restore()
  }

  private renderMeteorTrail(meteor: any) {
    if (meteor.trail.length < 2) return

    this.ctx.strokeStyle = `rgba(${meteor.color.r}, ${meteor.color.g}, ${meteor.color.b}, 0.6)`
    this.ctx.lineWidth = meteor.size * 0.8
    this.ctx.lineCap = 'round'

    const gradient = this.ctx.createLinearGradient(
      meteor.trail[0].x, meteor.trail[0].y,
      meteor.trail[meteor.trail.length - 1].x, meteor.trail[meteor.trail.length - 1].y
    )

    for (let i = 0; i < meteor.trail.length; i++) {
      const alpha = meteor.trail[i].opacity * (1 - i / meteor.trail.length)
      const stop = i / (meteor.trail.length - 1)
      gradient.addColorStop(stop, `rgba(${meteor.color.r}, ${meteor.color.g}, ${meteor.color.b}, ${alpha})`)
    }

    this.ctx.strokeStyle = gradient
    this.ctx.beginPath()
    this.ctx.moveTo(meteor.trail[0].x, meteor.trail[0].y)
    
    for (let i = 1; i < meteor.trail.length; i++) {
      this.ctx.lineTo(meteor.trail[i].x, meteor.trail[i].y)
    }
    
    this.ctx.stroke()
  }

  private renderMeteorHead(meteor: any) {
    const {r, g, b} = meteor.color
    const alpha = meteor.brightness * (1 - meteor.life / meteor.maxLife)

    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
    this.ctx.beginPath()
    this.ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2)
    this.ctx.fill()

    if (meteor.type === 'fireball' || meteor.type === 'bolide') {
      const coreGradient = this.ctx.createRadialGradient(
        meteor.x, meteor.y, 0,
        meteor.x, meteor.y, meteor.size
      )
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
      coreGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`)
      coreGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`)

      this.ctx.fillStyle = coreGradient
      this.ctx.beginPath()
      this.ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }

  private renderMeteorGlow(meteor: any) {
    const {r, g, b} = meteor.color
    const alpha = meteor.brightness * 0.3 * (1 - meteor.life / meteor.maxLife)
    const glowSize = meteor.size * (meteor.type === 'bolide' ? 6 : 4)

    const glowGradient = this.ctx.createRadialGradient(
      meteor.x, meteor.y, 0,
      meteor.x, meteor.y, glowSize
    )
    glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`)
    glowGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`)
    glowGradient.addColorStop(1, 'transparent')

    this.ctx.fillStyle = glowGradient
    this.ctx.beginPath()
    this.ctx.arc(meteor.x, meteor.y, glowSize, 0, Math.PI * 2)
    this.ctx.fill()
  }

  private handleSpaceEvents() {
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

  private createSupernova() {
    this.spaceEvents.push({
      type: 'supernova',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      life: 0,
      maxLife: 600,
      intensity: 0,
      size: 5,
      color: {r: 255, g: 255, b: 255},
      data: {
        phase: 0,
        expansionRadius: 0,
        shockwaveRadius: 0
      }
    })
  }

  private createSolarFlare() {
    this.spaceEvents.push({
      type: 'solar_flare',
      x: Math.random() * this.width,
      y: Math.random() * this.height * 0.3,
      life: 0,
      maxLife: 180,
      intensity: 0.8,
      size: 15,
      color: {r: 255, g: 150, b: 50},
      data: {
        angle: Math.random() * Math.PI * 2,
        length: 50 + Math.random() * 100
      }
    })
  }

  private createComet() {
    const side = Math.floor(Math.random() * 4)
    let x, y
    
    switch (side) {
      case 0: x = -50; y = Math.random() * this.height; break
      case 1: x = this.width + 50; y = Math.random() * this.height; break
      case 2: x = Math.random() * this.width; y = -50; break
      default: x = Math.random() * this.width; y = this.height + 50; break
    }

    this.spaceEvents.push({
      type: 'comet',
      x: x,
      y: y,
      life: 0,
      maxLife: 900,
      intensity: 0.7,
      size: 8,
      color: {r: 180, g: 220, b: 255},
      data: {
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        tail: []
      }
    })
  }

  private createAurora() {
    this.spaceEvents.push({
      type: 'aurora',
      x: Math.random() * this.width,
      y: this.height * 0.7 + Math.random() * this.height * 0.3,
      life: 0,
      maxLife: 480,
      intensity: 0.6,
      size: 200,
      color: {r: 100, g: 255, b: 150},
      data: {
        wavePhase: Math.random() * Math.PI * 2,
        waveSpeed: 0.02 + Math.random() * 0.03,
        layers: Math.floor(3 + Math.random() * 4)
      }
    })
  }

  private createSatellite() {
    this.spaceEvents.push({
      type: 'satellite',
      x: -20,
      y: Math.random() * this.height * 0.4,
      life: 0,
      maxLife: 300,
      intensity: 0.8,
      size: 2,
      color: {r: 255, g: 255, b: 255},
      data: {
        vx: 3 + Math.random() * 2,
        vy: 0.2 + Math.random() * 0.4,
        blinkPhase: Math.random() * Math.PI * 2
      }
    })
  }

  private createSpaceDebris() {
    this.spaceEvents.push({
      type: 'space_debris',
      x: Math.random() * this.width,
      y: -20,
      life: 0,
      maxLife: 240,
      intensity: 0.4,
      size: 1 + Math.random() * 3,
      color: {r: 150, g: 150, b: 150},
      data: {
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 3,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.3
      }
    })
  }

  private createPulsar() {
    this.spaceEvents.push({
      type: 'pulsar',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      life: 0,
      maxLife: 600,
      intensity: 0.8,
      size: 3 + Math.random() * 2,
      color: {r: 0, g: 255, b: 255},
      data: {
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.1 + Math.random() * 0.2,
        beamAngle: Math.random() * Math.PI * 2,
        beamLength: 50 + Math.random() * 100
      }
    })
  }

  private createQuasar() {
    this.spaceEvents.push({
      type: 'quasar',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      life: 0,
      maxLife: 1200,
      intensity: 1.0,
      size: 8 + Math.random() * 4,
      color: {r: 255, g: 100, b: 0},
      data: {
        jetAngle: Math.random() * Math.PI * 2,
        jetLength: 100 + Math.random() * 200,
        accretionDisk: {
          innerRadius: 10,
          outerRadius: 30 + Math.random() * 20,
          rotation: 0
        }
      }
    })
  }

  private createGammaRayBurst() {
    this.spaceEvents.push({
      type: 'gamma_ray_burst',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      life: 0,
      maxLife: 300,
      intensity: 1.0,
      size: 2 + Math.random() * 2,
      color: {r: 255, g: 255, b: 0},
      data: {
        beamAngle: Math.random() * Math.PI * 2,
        beamWidth: 0.1 + Math.random() * 0.2,
        beamLength: 200 + Math.random() * 300,
        energy: 0.8 + Math.random() * 0.2
      }
    })
  }

  private createStellarCollision() {
    this.spaceEvents.push({
      type: 'stellar_collision',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      life: 0,
      maxLife: 900,
      intensity: 0.9,
      size: 15 + Math.random() * 10,
      color: {r: 255, g: 200, b: 0},
      data: {
        explosionRadius: 0,
        shockwaveRadius: 0,
        debris: Array.from({length: 20}, () => ({
          angle: Math.random() * Math.PI * 2,
          distance: Math.random() * 100,
          speed: 1 + Math.random() * 3
        }))
      }
    })
  }

  private createBlackHoleFormation() {
    this.spaceEvents.push({
      type: 'black_hole_formation',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      life: 0,
      maxLife: 1800,
      intensity: 0.7,
      size: 5 + Math.random() * 3,
      color: {r: 0, g: 0, b: 0},
      data: {
        eventHorizon: 0,
        accretionDisk: {
          innerRadius: 0,
          outerRadius: 0,
          rotation: 0
        },
        jets: {
          angle1: Math.random() * Math.PI * 2,
          angle2: Math.random() * Math.PI * 2,
          length: 0
        }
      }
    })
  }

  private createNeutronStarMerger() {
    this.spaceEvents.push({
      type: 'neutron_star_merger',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      life: 0,
      maxLife: 600,
      intensity: 0.95,
      size: 8 + Math.random() * 4,
      color: {r: 255, g: 100, b: 255},
      data: {
        mergerRadius: 0,
        gravitationalWaves: Array.from({length: 10}, () => ({
          angle: Math.random() * Math.PI * 2,
          amplitude: Math.random() * 50,
          frequency: 0.1 + Math.random() * 0.3
        }))
      }
    })
  }

  private createStellarWind() {
    this.spaceEvents.push({
      type: 'stellar_wind',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      life: 0,
      maxLife: 480,
      intensity: 0.6,
      size: 20 + Math.random() * 15,
      color: {r: 100, g: 200, b: 255},
      data: {
        windDirection: Math.random() * Math.PI * 2,
        windSpeed: 2 + Math.random() * 3,
        particles: Array.from({length: 30}, () => ({
          angle: Math.random() * Math.PI * 2,
          distance: Math.random() * 50,
          speed: 1 + Math.random() * 2
        }))
      }
    })
  }

  private createMagnetarFlare() {
    this.spaceEvents.push({
      type: 'magnetar_flare',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      life: 0,
      maxLife: 180,
      intensity: 0.9,
      size: 4 + Math.random() * 2,
      color: {r: 255, g: 0, b: 255},
      data: {
        magneticField: {
          strength: 0.5 + Math.random() * 0.5,
          angle: Math.random() * Math.PI * 2
        },
        flareIntensity: 0,
        particleStreams: Array.from({length: 8}, () => ({
          angle: Math.random() * Math.PI * 2,
          length: 0,
          speed: 3 + Math.random() * 2
        }))
      }
    })
  }

  private createNova() {
    this.spaceEvents.push({
      type: 'nova',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      life: 0,
      maxLife: 360,
      intensity: 0.8,
      size: 6 + Math.random() * 3,
      color: {r: 255, g: 150, b: 0},
      data: {
        explosionRadius: 0,
        brightness: 0,
        shell: {
          innerRadius: 0,
          outerRadius: 0
        }
      }
    })
  }

  private createWhiteDwarfIgnition() {
    this.spaceEvents.push({
      type: 'white_dwarf_ignition',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      life: 0,
      maxLife: 720,
      intensity: 0.7,
      size: 3 + Math.random() * 2,
      color: {r: 255, g: 255, b: 200},
      data: {
        ignitionRadius: 0,
        temperature: 0,
        fusion: {
          intensity: 0,
          particles: Array.from({length: 15}, () => ({
            angle: Math.random() * Math.PI * 2,
            distance: Math.random() * 30,
            energy: Math.random()
          }))
        }
      }
    })
  }



  private updateSupernova(event: any) {
    const progress = event.life / event.maxLife
    
    if (progress < 0.1) {
      event.intensity = progress * 10
    } else if (progress < 0.3) {
      event.intensity = 1
      event.data.expansionRadius = (progress - 0.1) * 200
    } else if (progress < 0.6) {
      event.intensity = 1 - (progress - 0.3) * 2
      event.data.shockwaveRadius = (progress - 0.3) * 400
    } else {
      event.intensity = Math.max(0, 0.4 - (progress - 0.6) * 1)
    }
  }

  private updateSolarFlare(event: any) {
    const progress = event.life / event.maxLife
    event.intensity = Math.sin(progress * Math.PI) * 0.8
    event.data.length = (50 + Math.random() * 100) * (1 + Math.sin(event.life * 0.1))
  }

  private updateComet(event: any) {
    event.x += event.data.vx
    event.y += event.data.vy
    
    event.data.tail.unshift({x: event.x, y: event.y, opacity: event.intensity})
    if (event.data.tail.length > 30) {
      event.data.tail.pop()
    }
    
    event.data.tail.forEach((point: any) => {
      point.opacity *= 0.95
    })
  }

  private updateAurora(event: any) {
    event.data.wavePhase += event.data.waveSpeed
    const progress = event.life / event.maxLife
    event.intensity = Math.sin(progress * Math.PI) * 0.6
  }

  private updateSatellite(event: any) {
    event.x += event.data.vx
    event.y += event.data.vy
    event.data.blinkPhase += 0.2
  }

  private updateSpaceDebris(event: any) {
    event.x += event.data.vx
    event.y += event.data.vy
    event.data.rotation += event.data.rotationSpeed
  }





  private renderSolarFlare(event: any) {
    const {r, g, b} = event.color
    const alpha = event.intensity

    this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
    this.ctx.lineWidth = event.size
    this.ctx.lineCap = 'round'

    for (let i = 0; i < 3; i++) {
      const angle = event.data.angle + (i - 1) * 0.3
      const length = event.data.length * (0.7 + i * 0.15)
      
      this.ctx.beginPath()
      this.ctx.moveTo(event.x, event.y)
      this.ctx.lineTo(
        event.x + Math.cos(angle) * length,
        event.y + Math.sin(angle) * length
      )
      this.ctx.stroke()
    }
  }

  private renderComet(event: any) {
    if (event.data.tail.length > 1) {
      this.ctx.strokeStyle = `rgba(${event.color.r}, ${event.color.g}, ${event.color.b}, 0.6)`
      this.ctx.lineWidth = event.size
      this.ctx.lineCap = 'round'

      this.ctx.beginPath()
      this.ctx.moveTo(event.data.tail[0].x, event.data.tail[0].y)
      
      for (let i = 1; i < event.data.tail.length; i++) {
        const point = event.data.tail[i]
        this.ctx.globalAlpha = point.opacity
        this.ctx.lineTo(point.x, point.y)
      }
      
      this.ctx.stroke()
      this.ctx.globalAlpha = 1
    }

    this.ctx.fillStyle = `rgba(${event.color.r}, ${event.color.g}, ${event.color.b}, ${event.intensity})`
    this.ctx.beginPath()
    this.ctx.arc(event.x, event.y, event.size, 0, Math.PI * 2)
    this.ctx.fill()
  }

  private renderAurora(event: any) {
    const {r, g, b} = event.color
    const alpha = event.intensity

    this.ctx.globalCompositeOperation = 'screen'
    
    for (let layer = 0; layer < event.data.layers; layer++) {
      const layerAlpha = alpha * (0.3 + layer * 0.2)
      const waveOffset = layer * 20
      
      this.ctx.strokeStyle = `rgba(${r + layer * 20}, ${g}, ${b - layer * 30}, ${layerAlpha})`
      this.ctx.lineWidth = 3 + layer
      this.ctx.lineCap = 'round'

      this.ctx.beginPath()
      for (let x = event.x - event.size; x <= event.x + event.size; x += 5) {
        const y = event.y + Math.sin((x / 50) + event.data.wavePhase + waveOffset) * 8
        if (x === event.x - event.size) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      }
      this.ctx.stroke()
    }
    
    this.ctx.globalCompositeOperation = 'source-over'
  }

  private renderSatellite(event: any) {
    const blink = Math.sin(event.data.blinkPhase) > 0.5 ? 1 : 0.3
    const alpha = event.intensity * blink

    this.ctx.fillStyle = `rgba(${event.color.r}, ${event.color.g}, ${event.color.b}, ${alpha})`
    this.ctx.beginPath()
    this.ctx.arc(event.x, event.y, event.size, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.moveTo(event.x - 5, event.y)
    this.ctx.lineTo(event.x + 5, event.y)
    this.ctx.moveTo(event.x, event.y - 5)
    this.ctx.lineTo(event.x, event.y + 5)
    this.ctx.stroke()
  }

  private renderSpaceDebris(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.rotate(event.data.rotation)

    this.ctx.fillStyle = `rgba(${event.color.r}, ${event.color.g}, ${event.color.b}, ${event.intensity})`
    this.ctx.fillRect(-event.size/2, -event.size/2, event.size, event.size)

    this.ctx.restore()
  }

  private updateAndRenderStellarNurseries() {
    for (let i = this.stellarNurseries.length - 1; i >= 0; i--) {
      const nursery = this.stellarNurseries[i]
      nursery.age += 0.1
      
      if (nursery.age > 2000) {
        this.stellarNurseries.splice(i, 1)
        continue
      }

      this.ctx.save()
      this.ctx.globalCompositeOperation = 'screen'
      
      const gradient = this.ctx.createRadialGradient(nursery.x, nursery.y, 0, nursery.x, nursery.y, nursery.size)
      gradient.addColorStop(0, `rgba(255, 200, 150, ${nursery.density * 0.3})`)
      gradient.addColorStop(0.5, `rgba(200, 150, 255, ${nursery.density * 0.2})`)
      gradient.addColorStop(1, 'transparent')
      
      this.ctx.fillStyle = gradient
      this.ctx.beginPath()
      this.ctx.arc(nursery.x, nursery.y, nursery.size, 0, Math.PI * 2)
      this.ctx.fill()

      for (const star of nursery.stars) {
        star.age += 0.05
        star.lifecycle = this.getStellarLifecycleStage(star.age)
        
        const color = this.getStellarLifecycleColor(star.lifecycle)
        const size = this.getStellarLifecycleSize(star.lifecycle, star.mass)
        
        this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`
        this.ctx.beginPath()
        this.ctx.arc(star.x, star.y, size, 0, Math.PI * 2)
        this.ctx.fill()
        
        if (star.lifecycle === 'supernova') {
          const explosionRadius = size * (2 + Math.sin(this.time * 10) * 0.5)
          const explosionGradient = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, explosionRadius)
          explosionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
          explosionGradient.addColorStop(0.3, 'rgba(255, 150, 0, 0.7)')
          explosionGradient.addColorStop(0.6, 'rgba(255, 50, 50, 0.4)')
          explosionGradient.addColorStop(1, 'transparent')
          
          this.ctx.fillStyle = explosionGradient
          this.ctx.beginPath()
          this.ctx.arc(star.x, star.y, explosionRadius, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
      
      this.ctx.restore()
    }
  }

  private getStellarLifecycleColor(lifecycle: string): {r: number, g: number, b: number} {
    switch (lifecycle) {
      case 'protostar': return {r: 255, g: 100, b: 100}
      case 'main_sequence': return {r: 255, g: 255, b: 200}
      case 'giant': return {r: 255, g: 150, b: 50}
      case 'supernova': return {r: 255, g: 255, b: 255}
      case 'white_dwarf': return {r: 200, g: 200, b: 255}
      case 'neutron_star': return {r: 150, g: 255, b: 255}
      default: return {r: 255, g: 255, b: 255}
    }
  }

  private getStellarLifecycleSize(lifecycle: string, mass: number): number {
    const baseSizes = {
      'protostar': 1.5,
      'main_sequence': 1,
      'giant': 3,
      'supernova': 5,
      'white_dwarf': 0.5,
      'neutron_star': 0.3
    }
    return (baseSizes[lifecycle as keyof typeof baseSizes] || 1) * mass
  }

  private renderConstellations() {
    for (const constellation of this.constellations) {
      constellation.visibility = 0.3 + Math.sin(this.time * 0.5) * 0.4
      
      this.ctx.save()
      this.ctx.globalAlpha = constellation.visibility
      
      for (const connection of constellation.connections) {
        const starA = constellation.stars[connection.from]
        const starB = constellation.stars[connection.to]
        
        if (starA && starB) {
          this.ctx.strokeStyle = `hsla(${constellation.mythologyHue}, 60%, 70%, 0.4)`
          this.ctx.lineWidth = 1
          this.ctx.beginPath()
          this.ctx.moveTo(starA.x, starA.y)
          this.ctx.lineTo(starB.x, starB.y)
          this.ctx.stroke()
        }
      }
      
      for (const star of constellation.stars) {
        const twinkle = 0.5 + Math.sin(this.time * 3 + star.x * 0.01) * 0.5
        this.ctx.fillStyle = `hsla(${constellation.mythologyHue}, 80%, 80%, ${star.brightness * twinkle})`
        this.ctx.beginPath()
        this.ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2)
        this.ctx.fill()
      }
      
      this.ctx.restore()
    }
  }

  private updateAndRenderPlanetarySystems() {
    for (let i = this.planetarySystems.length - 1; i >= 0; i--) {
      const system = this.planetarySystems[i]
      system.star.age += 0.5
      
      if (system.star.age > 15000) {
        this.planetarySystems.splice(i, 1)
        continue
      }
      this.ctx.save()
      
      this.ctx.fillStyle = `rgba(255, 255, 200, 0.8)`
      this.ctx.beginPath()
      this.ctx.arc(system.x, system.y, 3, 0, Math.PI * 2)
      this.ctx.fill()
      
      for (const particle of system.protoplanetaryDisk.particles) {
        particle.angle += 0.001 + (1 / particle.distance) * 0.0005
        
        const x = system.x + Math.cos(particle.angle) * particle.distance
        const y = system.y + Math.sin(particle.angle) * particle.distance
        
        this.ctx.fillStyle = `rgba(200, 150, 100, ${system.protoplanetaryDisk.density * 0.3})`
        this.ctx.beginPath()
        this.ctx.arc(x, y, particle.size * 0.5, 0, Math.PI * 2)
        this.ctx.fill()
      }
      
      for (const planet of system.planets) {
        planet.angle += planet.speed
        
        const x = system.x + Math.cos(planet.angle) * planet.distance
        const y = system.y + Math.sin(planet.angle) * planet.distance
        
        this.ctx.fillStyle = 'rgba(100, 150, 200, 0.8)'
        this.ctx.beginPath()
        this.ctx.arc(x, y, planet.size, 0, Math.PI * 2)
        this.ctx.fill()
      }
      
      this.ctx.restore()
    }
  }

  private updateAndRenderDarkMatter() {
    for (const particle of this.darkMatterParticles) {
      particle.x += particle.vx
      particle.y += particle.vy
      
      if (particle.x < 0 || particle.x > this.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > this.height) particle.vy *= -1
      
      for (const element of this.elements) {
        const dx = particle.x - element.x
        const dy = particle.y - element.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < particle.influence) {
          const force = (particle.mass / (distance + 1)) * 0.001
          element.vx += (dx / distance) * force
          element.vy += (dy / distance) * force
        }
      }
    }
  }

  private renderBlackHoles() {
    for (let i = this.blackHoles.length - 1; i >= 0; i--) {
      const blackHole = this.blackHoles[i]
      
      blackHole.age += 1
      
      this.absorbNearbyElements(blackHole)
      
      if (blackHole.absorbedMatter >= blackHole.maxAbsorption || blackHole.age >= blackHole.lifespan) {
        this.explodeBlackHole(blackHole, i)
        continue
      }
      
      this.ctx.save()
      this.ctx.translate(blackHole.x, blackHole.y)
      
      blackHole.accretionDisk.rotation += 0.02
      
      this.ctx.globalCompositeOperation = 'screen'
      
      const diskLayers = 12
      for (let layer = 0; layer < diskLayers; layer++) {
        const layerRadius = blackHole.accretionDisk.innerRadius + (layer / diskLayers) * (blackHole.accretionDisk.outerRadius - blackHole.accretionDisk.innerRadius)
        const layerIntensity = 1 - (layer / diskLayers)
        const rotationOffset = layer * 0.1
        
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * Math.PI * 2 + blackHole.accretionDisk.rotation + rotationOffset
          const spiralOffset = Math.sin(layer * 0.5 + this.time * 2) * 5
          
          this.ctx.save()
          this.ctx.rotate(angle)
          this.ctx.translate(layerRadius + spiralOffset, 0)
          
          const temp = blackHole.accretionDisk.temperature * layerIntensity
          const r = Math.min(255, temp / 200)
          const g = Math.min(255, temp / 400)
          const b = Math.min(100, temp / 800)
          
          const particleGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 3)
          particleGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${layerIntensity * 0.8})`)
          particleGradient.addColorStop(1, 'transparent')
          
          this.ctx.fillStyle = particleGradient
          this.ctx.beginPath()
          this.ctx.arc(0, 0, 2 + layerIntensity * 2, 0, Math.PI * 2)
          this.ctx.fill()
          
          this.ctx.restore()
        }
      }
      
      this.ctx.globalCompositeOperation = 'source-over'
      
      const shadowGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, blackHole.eventHorizon * 2)
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)')
      shadowGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.5)')
      shadowGradient.addColorStop(1, 'transparent')
      
      this.ctx.fillStyle = shadowGradient
      this.ctx.beginPath()
      this.ctx.arc(0, 0, blackHole.eventHorizon * 2, 0, Math.PI * 2)
      this.ctx.fill()
      
      this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      this.ctx.beginPath()
      this.ctx.arc(0, 0, blackHole.eventHorizon, 0, Math.PI * 2)
      this.ctx.fill()
      
      const hawkingGradient = this.ctx.createRadialGradient(0, 0, blackHole.eventHorizon * 0.9, 0, 0, blackHole.eventHorizon * 1.2)
      hawkingGradient.addColorStop(0, 'transparent')
      hawkingGradient.addColorStop(1, 'rgba(150, 150, 255, 0.3)')
      
      this.ctx.fillStyle = hawkingGradient
      this.ctx.beginPath()
      this.ctx.arc(0, 0, blackHole.eventHorizon * 1.2, 0, Math.PI * 2)
      this.ctx.fill()
      
      const lensingRings = 3
      for (let ring = 0; ring < lensingRings; ring++) {
        const ringRadius = blackHole.eventHorizon * (1.5 + ring * 0.8)
        const ringIntensity = 0.1 - ring * 0.02
        
        this.ctx.strokeStyle = `rgba(100, 150, 255, ${ringIntensity})`
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2)
        this.ctx.stroke()
      }
      
      this.ctx.restore()
    }
  }

  private updateAndRenderGalaxies() {
    for (let i = this.galaxies.length - 1; i >= 0; i--) {
      const galaxy = this.galaxies[i]
      galaxy.rotation += 0.001
      
      if (Math.random() < 0.0001) {
        this.galaxies.splice(i, 1)
        continue
      }
      
      if (galaxy.merging && galaxy.mergeTarget !== undefined) {
        const target = this.galaxies[galaxy.mergeTarget]
        if (target) {
          galaxy.mergeProgress = (galaxy.mergeProgress || 0) + 0.001
          const dx = target.x - galaxy.x
          const dy = target.y - galaxy.y
          galaxy.x += dx * galaxy.mergeProgress * 0.1
          galaxy.y += dy * galaxy.mergeProgress * 0.1
        }
      }
      
      this.ctx.save()
      this.ctx.translate(galaxy.x, galaxy.y)
      this.ctx.rotate(galaxy.rotation)
      
      if (galaxy.type === 'spiral') {
        this.renderSpiralGalaxy(galaxy)
      } else if (galaxy.type === 'elliptical') {
        this.renderEllipticalGalaxy(galaxy)
      } else {
        this.renderIrregularGalaxy(galaxy)
      }
      
      this.ctx.restore()
    }
  }

  private renderSpiralGalaxy(galaxy: any) {
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size * 0.3)
    coreGradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)')
    coreGradient.addColorStop(1, 'rgba(255, 200, 100, 0.2)')
    
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, galaxy.size * 0.3, 0, Math.PI * 2)
    this.ctx.fill()
    
    for (let arm = 0; arm < galaxy.arms; arm++) {
      const armAngle = (arm / galaxy.arms) * Math.PI * 2
      this.ctx.strokeStyle = `rgba(150, 150, 255, 0.3)`
      this.ctx.lineWidth = 3
      this.ctx.beginPath()
      
      for (let r = galaxy.size * 0.3; r < galaxy.size; r += 5) {
        const angle = armAngle + (r / galaxy.size) * Math.PI * 4
        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r
        
        if (r === galaxy.size * 0.3) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
        
        if (Math.random() < 0.1) {
          this.ctx.fillStyle = `rgba(200, 200, 255, ${0.3 + Math.random() * 0.4})`
          this.ctx.beginPath()
          this.ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
      this.ctx.stroke()
    }
  }

  private renderEllipticalGalaxy(galaxy: any) {
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size)
    gradient.addColorStop(0, 'rgba(255, 200, 100, 0.6)')
    gradient.addColorStop(0.5, 'rgba(200, 150, 100, 0.3)')
    gradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = gradient
    this.ctx.save()
    this.ctx.scale(1, 0.6)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, galaxy.size, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
  }

  private renderIrregularGalaxy(galaxy: any) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * galaxy.size
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance
      
      this.ctx.fillStyle = `rgba(150, 200, 255, ${0.2 + Math.random() * 0.4})`
      this.ctx.beginPath()
      this.ctx.arc(x, y, 1 + Math.random() * 3, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }

  private renderQuasars() {
    for (let i = this.quasars.length - 1; i >= 0; i--) {
      const quasar = this.quasars[i]
      
      if (Math.random() < 0.0005) {
        this.quasars.splice(i, 1)
        continue
      }
      this.ctx.save()
      this.ctx.translate(quasar.x, quasar.y)
      
      const pulsation = 0.7 + Math.sin(this.time * quasar.pulsation) * 0.3
      const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 8)
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${quasar.luminosity * pulsation})`)
      coreGradient.addColorStop(0.5, `rgba(100, 200, 255, ${quasar.luminosity * 0.8})`)
      coreGradient.addColorStop(1, 'transparent')
      
      this.ctx.fillStyle = coreGradient
      this.ctx.beginPath()
      this.ctx.arc(0, 0, 8, 0, Math.PI * 2)
      this.ctx.fill()
      
      this.ctx.rotate(quasar.jetAngle)
      
      const jetGradient = this.ctx.createLinearGradient(0, -quasar.jetWidth/2, 0, quasar.jetWidth/2)
      jetGradient.addColorStop(0, 'transparent')
      jetGradient.addColorStop(0.5, `rgba(255, 100, 255, ${quasar.luminosity * 0.6})`)
      jetGradient.addColorStop(1, 'transparent')
      
      this.ctx.fillStyle = jetGradient
      this.ctx.fillRect(0, -quasar.jetWidth/2, quasar.jetLength, quasar.jetWidth)
      this.ctx.fillRect(-quasar.jetLength, -quasar.jetWidth/2, quasar.jetLength, quasar.jetWidth)
      
      this.ctx.restore()
    }
  }

  private renderMagnetars() {
    for (let i = this.magnetars.length - 1; i >= 0; i--) {
      const magnetar = this.magnetars[i]
      
      if (Math.random() < 0.0002) {
        this.magnetars.splice(i, 1)
        continue
      }
      this.ctx.save()
      this.ctx.translate(magnetar.x, magnetar.y)
      
      const pulsePhase = (this.time / magnetar.pulsePeriod + magnetar.phaseOffset) % (Math.PI * 2)
      const pulseBrightness = 0.3 + Math.sin(pulsePhase) * 0.7
      
      this.ctx.fillStyle = `rgba(0, 255, 255, ${pulseBrightness})`
      this.ctx.beginPath()
      this.ctx.arc(0, 0, 2, 0, Math.PI * 2)
      this.ctx.fill()
      
      const fieldLines = 8
      for (let i = 0; i < fieldLines; i++) {
        const angle = (i / fieldLines) * Math.PI * 2
        const fieldStrength = magnetar.magneticField / 10000
        
        this.ctx.strokeStyle = `rgba(255, 0, 255, ${fieldStrength * pulseBrightness * 0.3})`
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        
        for (let r = 5; r < 30; r += 2) {
          const fieldAngle = angle + Math.sin(r * 0.1) * 0.5
          const x = Math.cos(fieldAngle) * r
          const y = Math.sin(fieldAngle) * r
          
          if (r === 5) {
            this.ctx.moveTo(x, y)
          } else {
            this.ctx.lineTo(x, y)
          }
        }
        this.ctx.stroke()
      }
      
      if (this.time - magnetar.lastFlare > 100 && Math.random() < 0.001) {
        magnetar.lastFlare = this.time
        
        const flareGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 50)
        flareGradient.addColorStop(0, `rgba(255, 255, 255, ${magnetar.flareIntensity})`)
        flareGradient.addColorStop(0.3, `rgba(255, 100, 0, ${magnetar.flareIntensity * 0.7})`)
        flareGradient.addColorStop(1, 'transparent')
        
        this.ctx.fillStyle = flareGradient
        this.ctx.beginPath()
        this.ctx.arc(0, 0, 50, 0, Math.PI * 2)
        this.ctx.fill()
      }
      
      this.ctx.restore()
    }
  }

  private absorbNearbyElements(blackHole: any) {
    const absorptionRadius = blackHole.gravitationalLensing
    
    for (let i = this.elements.length - 1; i >= 0; i--) {
      const element = this.elements[i]
      const dx = element.x - blackHole.x
      const dy = element.y - blackHole.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < absorptionRadius) {
        const force = (blackHole.mass / (distance + 1)) * 0.1
        element.vx += (dx / distance) * -force
        element.vy += (dy / distance) * -force
        
        if (distance < blackHole.eventHorizon) {
          blackHole.absorbedMatter += element.size || 1
          this.elements.splice(i, 1)
        }
      }
    }
    
    for (let i = this.stars.length - 1; i >= 0; i--) {
      const star = this.stars[i]
      const dx = star.x - blackHole.x
      const dy = star.y - blackHole.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < blackHole.eventHorizon * 2) {
        blackHole.absorbedMatter += 2
        this.stars.splice(i, 1)
      }
    }
    
    for (let i = this.cosmicDust.length - 1; i >= 0; i--) {
      const dust = this.cosmicDust[i]
      const dx = dust.x - blackHole.x
      const dy = dust.y - blackHole.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < absorptionRadius) {
        dust.vx += (dx / distance) * -0.02
        dust.vy += (dy / distance) * -0.02
        
        if (distance < blackHole.eventHorizon * 1.5) {
          blackHole.absorbedMatter += 0.1
          this.cosmicDust.splice(i, 1)
        }
      }
    }
    
    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const meteor = this.meteors[i]
      const dx = meteor.x - blackHole.x
      const dy = meteor.y - blackHole.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < absorptionRadius) {
        const force = (blackHole.mass / (distance + 1)) * 0.2
        meteor.vx += (dx / distance) * -force
        meteor.vy += (dy / distance) * -force
        
        if (distance < blackHole.eventHorizon * 1.5) {
          blackHole.absorbedMatter += 1
          this.meteors.splice(i, 1)
        }
      }
    }
    
  
    for (let i = this.spaceEvents.length - 1; i >= 0; i--) {
      const event = this.spaceEvents[i]
      const dx = event.x - blackHole.x
      const dy = event.y - blackHole.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < absorptionRadius * 0.8) {
        if (distance < blackHole.eventHorizon * 2) {
          blackHole.absorbedMatter += event.size || 2
          this.spaceEvents.splice(i, 1)
        }
      }
    }
    
  
    for (let i = this.planetarySystems.length - 1; i >= 0; i--) {
      const system = this.planetarySystems[i]
      const dx = system.x - blackHole.x
      const dy = system.y - blackHole.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < absorptionRadius * 0.6) {
        if (distance < blackHole.eventHorizon * 3) {
          blackHole.absorbedMatter += 5 + system.planets.length * 2
          this.planetarySystems.splice(i, 1)
        }
      }
    }
    
  
    for (let i = this.stellarNurseries.length - 1; i >= 0; i--) {
      const nursery = this.stellarNurseries[i]
      const dx = nursery.x - blackHole.x
      const dy = nursery.y - blackHole.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < absorptionRadius * 0.7) {
        if (distance < blackHole.eventHorizon * 4) {
          blackHole.absorbedMatter += 10 + nursery.stars.length
          this.stellarNurseries.splice(i, 1)
        }
      }
    }
    
  
    for (let i = this.galaxies.length - 1; i >= 0; i--) {
      const galaxy = this.galaxies[i]
      const dx = galaxy.x - blackHole.x
      const dy = galaxy.y - blackHole.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < absorptionRadius * 0.4) {
        if (distance < blackHole.eventHorizon * 5) {
          blackHole.absorbedMatter += 50
          this.galaxies.splice(i, 1)
        }
      }
    }
    
  
    for (let i = this.nebulae.length - 1; i >= 0; i--) {
      const nebula = this.nebulae[i]
      const dx = nebula.x - blackHole.x
      const dy = nebula.y - blackHole.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < absorptionRadius) {
        nebula.vx += (dx / distance) * -0.01
        nebula.vy += (dy / distance) * -0.01
        
        if (distance < blackHole.eventHorizon * 2) {
          blackHole.absorbedMatter += 1
          this.nebulae.splice(i, 1)
        }
      }
    }
  }

  private explodeBlackHole(blackHole: any, index: number) {
    const explosionSize = blackHole.absorbedMatter * 2
    
    for (let i = 0; i < explosionSize; i++) {
      const angle = (i / explosionSize) * Math.PI * 2
      const distance = 20 + Math.random() * 100
      const speed = 2 + Math.random() * 8
      
      this.spaceEvents.push({
        type: 'supernova',
        x: blackHole.x + Math.cos(angle) * distance,
        y: blackHole.y + Math.sin(angle) * distance,
        life: 0,
        maxLife: 100 + Math.random() * 200,
        intensity: 1,
        size: 15 + Math.random() * 25,
        color: {r: 255, g: 255, b: 255},
        data: {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          phase: Math.random() * Math.PI * 2,
          rings: 3 + Math.floor(Math.random() * 4),
          shockwaveRadius: 0
        }
      })
    }
    
    this.blackHoles.splice(index, 1)
    this.blackHoleCooldown = 18000
    this.lastBlackHoleExplosion = this.time
  }

  private updateSpaceEvents() {
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

  private renderSpaceEvents() {
    for (const event of this.spaceEvents) {
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
  }

  private renderSupernova(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.globalCompositeOperation = 'screen'
    
    const progress = event.life / event.maxLife
    const coreSize = event.size * (0.5 + progress * 1.5)
    const intensity = event.intensity
    
  
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize)
    coreGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`)
    coreGradient.addColorStop(0.3, `rgba(255, 200, 100, ${intensity * 0.9})`)
    coreGradient.addColorStop(0.6, `rgba(255, 100, 50, ${intensity * 0.6})`)
    coreGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, coreSize, 0, Math.PI * 2)
    this.ctx.fill()
    
  
    const layers = 6
    for (let layer = 0; layer < layers; layer++) {
      const layerProgress = Math.max(0, progress - layer * 0.1)
      if (layerProgress <= 0) continue
      
      const layerRadius = coreSize * (1 + layerProgress * 3)
      const layerIntensity = intensity * (1 - layer * 0.15) * layerProgress
      
      const layerGradient = this.ctx.createRadialGradient(0, 0, layerRadius * 0.3, 0, 0, layerRadius)
      
      if (layer < 2) {
      
        layerGradient.addColorStop(0, `rgba(255, 255, 200, ${layerIntensity * 0.8})`)
        layerGradient.addColorStop(0.5, `rgba(255, 150, 50, ${layerIntensity * 0.5})`)
      } else if (layer < 4) {
      
        layerGradient.addColorStop(0, `rgba(255, 120, 0, ${layerIntensity * 0.6})`)
        layerGradient.addColorStop(0.5, `rgba(255, 50, 0, ${layerIntensity * 0.4})`)
      } else {
      
        layerGradient.addColorStop(0, `rgba(100, 150, 255, ${layerIntensity * 0.4})`)
        layerGradient.addColorStop(0.5, `rgba(150, 100, 255, ${layerIntensity * 0.3})`)
      }
      
      layerGradient.addColorStop(1, 'transparent')
      
      this.ctx.fillStyle = layerGradient
      this.ctx.beginPath()
      this.ctx.arc(0, 0, layerRadius, 0, Math.PI * 2)
      this.ctx.fill()
    }
    
  
    if (event.data.shockwaveRadius > 0) {
      const rings = 4
      for (let ring = 0; ring < rings; ring++) {
        const ringRadius = event.data.shockwaveRadius * (0.7 + ring * 0.1)
        const ringIntensity = intensity * (0.5 - ring * 0.1) * Math.sin(progress * Math.PI * 4 + ring)
        
        if (ringIntensity > 0) {
          this.ctx.strokeStyle = `rgba(100, 200, 255, ${ringIntensity * 0.6})`
          this.ctx.lineWidth = 2 + ring
          this.ctx.beginPath()
          this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2)
          this.ctx.stroke()
        }
      }
    }
    
  
    if (progress > 0.2) {
      const sparkCount = 12 + Math.floor(progress * 20)
      for (let i = 0; i < sparkCount; i++) {
        const angle = (i / sparkCount) * Math.PI * 2 + this.time * 2
        const distance = coreSize * (1 + progress * 2) * (0.8 + Math.random() * 0.4)
        const sparkSize = 2 + Math.random() * 4
        
        const sparkX = Math.cos(angle) * distance
        const sparkY = Math.sin(angle) * distance
        
        const sparkGradient = this.ctx.createRadialGradient(sparkX, sparkY, 0, sparkX, sparkY, sparkSize)
        sparkGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.8})`)
        sparkGradient.addColorStop(1, 'transparent')
        
        this.ctx.fillStyle = sparkGradient
        this.ctx.beginPath()
        this.ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2)
        this.ctx.fill()
      }
    }
    
    this.ctx.restore()
  }

  private renderPulsar(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.globalCompositeOperation = 'screen'
    
    const progress = event.life / event.maxLife
    const intensity = event.intensity * (1 - progress)
    
    event.data.pulsePhase += event.data.pulseSpeed
    const pulse = Math.sin(event.data.pulsePhase) * 0.5 + 0.5
    
    this.ctx.fillStyle = `rgba(0, 255, 255, ${intensity * pulse})`
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
    
    const beamLength = event.data.beamLength * pulse
    const beamWidth = 2 + pulse * 3
    
    this.ctx.strokeStyle = `rgba(0, 255, 255, ${intensity * 0.8})`
    this.ctx.lineWidth = beamWidth
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(
      Math.cos(event.data.beamAngle) * beamLength,
      Math.sin(event.data.beamAngle) * beamLength
    )
    this.ctx.stroke()
    
    this.ctx.restore()
  }

  private renderQuasar(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.globalCompositeOperation = 'screen'
    
    const progress = event.life / event.maxLife
    const intensity = event.intensity * (1 - progress)
    
    event.data.accretionDisk.rotation += 0.02
    
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, event.size)
    coreGradient.addColorStop(0, `rgba(255, 100, 0, ${intensity})`)
    coreGradient.addColorStop(0.5, `rgba(255, 150, 50, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
    
    const diskGradient = this.ctx.createRadialGradient(0, 0, event.data.accretionDisk.innerRadius, 0, 0, event.data.accretionDisk.outerRadius)
    diskGradient.addColorStop(0, `rgba(255, 200, 100, ${intensity * 0.6})`)
    diskGradient.addColorStop(0.5, `rgba(255, 150, 50, ${intensity * 0.4})`)
    diskGradient.addColorStop(1, 'transparent')
    
    this.ctx.save()
    this.ctx.rotate(event.data.accretionDisk.rotation)
    this.ctx.fillStyle = diskGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.data.accretionDisk.outerRadius, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
    
    const jetLength = event.data.jetLength * (0.5 + progress * 0.5)
    this.ctx.strokeStyle = `rgba(255, 100, 0, ${intensity * 0.8})`
    this.ctx.lineWidth = 3
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(
      Math.cos(event.data.jetAngle) * jetLength,
      Math.sin(event.data.jetAngle) * jetLength
    )
    this.ctx.stroke()
    
    this.ctx.restore()
  }

  private renderGammaRayBurst(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.globalCompositeOperation = 'screen'
    
    const progress = event.life / event.maxLife
    const intensity = event.intensity * (1 - progress)
    
    const beamLength = event.data.beamLength * (0.5 + progress * 0.5)
    const beamWidth = event.data.beamWidth * 100
    
    this.ctx.strokeStyle = `rgba(255, 255, 0, ${intensity})`
    this.ctx.lineWidth = beamWidth
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(
      Math.cos(event.data.beamAngle) * beamLength,
      Math.sin(event.data.beamAngle) * beamLength
    )
    this.ctx.stroke()
    
    this.ctx.fillStyle = `rgba(255, 255, 0, ${intensity * 0.6})`
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
    
    this.ctx.restore()
  }

  private renderStellarCollision(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.globalCompositeOperation = 'screen'
    
    const progress = event.life / event.maxLife
    const intensity = event.intensity * (1 - progress)
    
    event.data.explosionRadius += 2
    event.data.shockwaveRadius += 1.5
    
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, event.size)
    coreGradient.addColorStop(0, `rgba(255, 200, 0, ${intensity})`)
    coreGradient.addColorStop(0.5, `rgba(255, 150, 0, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
    
    this.ctx.strokeStyle = `rgba(255, 200, 0, ${intensity * 0.6})`
    this.ctx.lineWidth = 3
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.data.explosionRadius, 0, Math.PI * 2)
    this.ctx.stroke()
    
    this.ctx.strokeStyle = `rgba(255, 100, 0, ${intensity * 0.4})`
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.data.shockwaveRadius, 0, Math.PI * 2)
    this.ctx.stroke()
    
    event.data.debris.forEach((debris: any) => {
      debris.distance += debris.speed
      const x = Math.cos(debris.angle) * debris.distance
      const y = Math.sin(debris.angle) * debris.distance
      
      this.ctx.fillStyle = `rgba(255, 150, 0, ${intensity * 0.8})`
      this.ctx.beginPath()
      this.ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2)
      this.ctx.fill()
    })
    
    this.ctx.restore()
  }

  private renderBlackHoleFormation(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.globalCompositeOperation = 'screen'
    
    const progress = event.life / event.maxLife
    const intensity = event.intensity * (1 - progress)
    
    event.data.eventHorizon += 0.5
    event.data.accretionDisk.innerRadius += 0.3
    event.data.accretionDisk.outerRadius += 0.8
    event.data.accretionDisk.rotation += 0.05
    event.data.jets.length += 2
    
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, event.size)
    coreGradient.addColorStop(0, `rgba(0, 0, 0, ${intensity})`)
    coreGradient.addColorStop(0.8, `rgba(50, 0, 50, ${intensity * 0.6})`)
    coreGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
    
    const diskGradient = this.ctx.createRadialGradient(0, 0, event.data.accretionDisk.innerRadius, 0, 0, event.data.accretionDisk.outerRadius)
    diskGradient.addColorStop(0, `rgba(255, 100, 255, ${intensity * 0.8})`)
    diskGradient.addColorStop(0.5, `rgba(255, 50, 255, ${intensity * 0.6})`)
    diskGradient.addColorStop(1, 'transparent')
    
    this.ctx.save()
    this.ctx.rotate(event.data.accretionDisk.rotation)
    this.ctx.fillStyle = diskGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.data.accretionDisk.outerRadius, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
    
    this.ctx.strokeStyle = `rgba(255, 100, 255, ${intensity * 0.8})`
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(
      Math.cos(event.data.jets.angle1) * event.data.jets.length,
      Math.sin(event.data.jets.angle1) * event.data.jets.length
    )
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(
      Math.cos(event.data.jets.angle2) * event.data.jets.length,
      Math.sin(event.data.jets.angle2) * event.data.jets.length
    )
    this.ctx.stroke()
    
    this.ctx.restore()
  }

  private renderNeutronStarMerger(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.globalCompositeOperation = 'screen'
    
    const progress = event.life / event.maxLife
    const intensity = event.intensity * (1 - progress)
    
    event.data.mergerRadius += 1.2
    
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, event.size)
    coreGradient.addColorStop(0, `rgba(255, 100, 255, ${intensity})`)
    coreGradient.addColorStop(0.5, `rgba(255, 50, 255, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
    
    this.ctx.strokeStyle = `rgba(255, 100, 255, ${intensity * 0.6})`
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.data.mergerRadius, 0, Math.PI * 2)
    this.ctx.stroke()
    
    event.data.gravitationalWaves.forEach((wave: any) => {
      wave.angle += 0.1
      const x = Math.cos(wave.angle) * wave.amplitude
      const y = Math.sin(wave.angle) * wave.amplitude
      
      this.ctx.strokeStyle = `rgba(255, 100, 255, ${intensity * 0.4})`
      this.ctx.lineWidth = 1
      this.ctx.beginPath()
      this.ctx.arc(x, y, 5 + Math.sin(wave.frequency * this.time) * 3, 0, Math.PI * 2)
      this.ctx.stroke()
    })
    
    this.ctx.restore()
  }

  private renderStellarWind(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.globalCompositeOperation = 'screen'
    
    const progress = event.life / event.maxLife
    const intensity = event.intensity * (1 - progress)
    
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, event.size)
    coreGradient.addColorStop(0, `rgba(100, 200, 255, ${intensity})`)
    coreGradient.addColorStop(0.5, `rgba(150, 200, 255, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
    
    event.data.particles.forEach((particle: any) => {
      particle.distance += particle.speed
      const x = Math.cos(particle.angle) * particle.distance
      const y = Math.sin(particle.angle) * particle.distance
      
      this.ctx.fillStyle = `rgba(100, 200, 255, ${intensity * 0.6})`
      this.ctx.beginPath()
      this.ctx.arc(x, y, 1 + Math.random(), 0, Math.PI * 2)
      this.ctx.fill()
    })
    
    this.ctx.restore()
  }

  private renderMagnetarFlare(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.globalCompositeOperation = 'screen'
    
    const progress = event.life / event.maxLife
    const intensity = event.intensity * (1 - progress)
    
    event.data.flareIntensity += 0.1
    event.data.particleStreams.forEach((stream: any) => {
      stream.length += stream.speed
    })
    
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, event.size)
    coreGradient.addColorStop(0, `rgba(255, 0, 255, ${intensity})`)
    coreGradient.addColorStop(0.5, `rgba(255, 50, 255, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
    
    event.data.particleStreams.forEach((stream: any) => {
      this.ctx.strokeStyle = `rgba(255, 0, 255, ${intensity * 0.8})`
      this.ctx.lineWidth = 2
      this.ctx.beginPath()
      this.ctx.moveTo(0, 0)
      this.ctx.lineTo(
        Math.cos(stream.angle) * stream.length,
        Math.sin(stream.angle) * stream.length
      )
      this.ctx.stroke()
    })
    
    this.ctx.restore()
  }

  private renderNova(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.globalCompositeOperation = 'screen'
    
    const progress = event.life / event.maxLife
    const intensity = event.intensity * (1 - progress)
    
    event.data.explosionRadius += 1.5
    event.data.brightness += 0.02
    event.data.shell.innerRadius += 0.8
    event.data.shell.outerRadius += 1.2
    
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, event.size)
    coreGradient.addColorStop(0, `rgba(255, 150, 0, ${intensity * event.data.brightness})`)
    coreGradient.addColorStop(0.5, `rgba(255, 100, 0, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
    
    this.ctx.strokeStyle = `rgba(255, 150, 0, ${intensity * 0.6})`
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.data.explosionRadius, 0, Math.PI * 2)
    this.ctx.stroke()
    
    const shellGradient = this.ctx.createRadialGradient(0, 0, event.data.shell.innerRadius, 0, 0, event.data.shell.outerRadius)
    shellGradient.addColorStop(0, `rgba(255, 200, 100, ${intensity * 0.4})`)
    shellGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = shellGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.data.shell.outerRadius, 0, Math.PI * 2)
    this.ctx.fill()
    
    this.ctx.restore()
  }

  private renderWhiteDwarfIgnition(event: any) {
    this.ctx.save()
    this.ctx.translate(event.x, event.y)
    this.ctx.globalCompositeOperation = 'screen'
    
    const progress = event.life / event.maxLife
    const intensity = event.intensity * (1 - progress)
    
    event.data.ignitionRadius += 0.8
    event.data.temperature += 0.01
    event.data.fusion.intensity += 0.005
    
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, event.size)
    coreGradient.addColorStop(0, `rgba(255, 255, 200, ${intensity * event.data.temperature})`)
    coreGradient.addColorStop(0.5, `rgba(255, 255, 150, ${intensity * 0.8})`)
    coreGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.size, 0, Math.PI * 2)
    this.ctx.fill()
    
    this.ctx.strokeStyle = `rgba(255, 255, 200, ${intensity * 0.6})`
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.arc(0, 0, event.data.ignitionRadius, 0, Math.PI * 2)
    this.ctx.stroke()
    
    event.data.fusion.particles.forEach((particle: any) => {
      particle.distance += particle.energy * 0.5
      const x = Math.cos(particle.angle) * particle.distance
      const y = Math.sin(particle.angle) * particle.distance
      
      this.ctx.fillStyle = `rgba(255, 255, 200, ${intensity * particle.energy * event.data.fusion.intensity})`
      this.ctx.beginPath()
      this.ctx.arc(x, y, 1 + particle.energy, 0, Math.PI * 2)
      this.ctx.fill()
    })
    
    this.ctx.restore()
  }

  private updateAsteroids() {
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i]
      asteroid.life++
      
      if (asteroid.life >= asteroid.maxLife) {
        this.asteroids.splice(i, 1)
        continue
      }
      
      asteroid.x += asteroid.vx
      asteroid.y += asteroid.vy
      asteroid.rotation += asteroid.rotationSpeed
      
      if (asteroid.x < -50 || asteroid.x > this.width + 50 || 
          asteroid.y < -50 || asteroid.y > this.height + 50) {
        asteroid.x = Math.random() * this.width
        asteroid.y = Math.random() * this.height
        asteroid.vx = (Math.random() - 0.5) * 0.5
        asteroid.vy = (Math.random() - 0.5) * 0.5
      }
      
      asteroid.trail.push({
        x: asteroid.x,
        y: asteroid.y,
        opacity: 1
      })
      
      if (asteroid.trail.length > 10) {
        asteroid.trail.shift()
      }
      
      asteroid.trail.forEach(point => {
        point.opacity *= 0.9
      })
    }
  }

  private updateComets() {
    for (let i = this.comets.length - 1; i >= 0; i--) {
      const comet = this.comets[i]
      comet.life++
      
      if (comet.life >= comet.maxLife) {
        this.comets.splice(i, 1)
        continue
      }
      
      comet.orbitAngle += comet.orbitSpeed
      
      const orbitX = comet.orbitCenter.x + Math.cos(comet.orbitAngle) * comet.orbitRadius
      const orbitY = comet.orbitCenter.y + Math.sin(comet.orbitAngle) * comet.orbitRadius
      
      comet.x += (orbitX - comet.x) * 0.02
      comet.y += (orbitY - comet.y) * 0.02
      
      comet.vx = (orbitX - comet.x) * 0.1
      comet.vy = (orbitY - comet.y) * 0.1
      
      comet.tailAngle = Math.atan2(comet.vy, comet.vx) + Math.PI
      
      comet.tail.push({
        x: comet.x,
        y: comet.y,
        opacity: 1,
        size: comet.nucleusSize * (0.5 + Math.random() * 0.5)
      })
      
      if (comet.tail.length > 20) {
        comet.tail.shift()
      }
      
      comet.tail.forEach((point, index) => {
        point.opacity *= 0.95
        point.size *= 0.98
      })
    }
  }

  private renderAsteroids() {
    this.asteroids.forEach(asteroid => {
      this.ctx.save()
      this.ctx.translate(asteroid.x, asteroid.y)
      this.ctx.rotate(asteroid.rotation)
      
      const {r, g, b} = asteroid.color
      const alpha = asteroid.brightness * (1 - asteroid.life / asteroid.maxLife)
      
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      this.ctx.strokeStyle = `rgba(${r * 0.7}, ${g * 0.7}, ${b * 0.7}, ${alpha * 0.8})`
      this.ctx.lineWidth = 1
      
      this.ctx.beginPath()
      this.ctx.moveTo(-asteroid.size, -asteroid.size * 0.5)
      this.ctx.lineTo(asteroid.size * 0.5, -asteroid.size)
      this.ctx.lineTo(asteroid.size, asteroid.size * 0.3)
      this.ctx.lineTo(asteroid.size * 0.3, asteroid.size)
      this.ctx.lineTo(-asteroid.size * 0.5, asteroid.size * 0.7)
      this.ctx.lineTo(-asteroid.size, asteroid.size * 0.2)
      this.ctx.closePath()
      this.ctx.fill()
      this.ctx.stroke()
      
      this.ctx.restore()
      
      if (asteroid.trail.length > 1) {
        this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        
        for (let i = 0; i < asteroid.trail.length - 1; i++) {
          const point = asteroid.trail[i]
          const nextPoint = asteroid.trail[i + 1]
          
          if (point.opacity > 0.1) {
            this.ctx.globalAlpha = point.opacity * alpha * 0.3
            this.ctx.moveTo(point.x, point.y)
            this.ctx.lineTo(nextPoint.x, nextPoint.y)
          }
        }
        
        this.ctx.stroke()
        this.ctx.globalAlpha = 1
      }
    })
  }

  private renderComets() {
    this.comets.forEach(comet => {
      this.ctx.save()
      this.ctx.translate(comet.x, comet.y)
      
      const {r, g, b} = comet.color
      const alpha = comet.brightness * (1 - comet.life / comet.maxLife)
      
      const nucleusGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, comet.nucleusSize)
      nucleusGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
      nucleusGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`)
      nucleusGradient.addColorStop(1, `rgba(${r * 0.5}, ${g * 0.5}, ${b * 0.5}, ${alpha * 0.4})`)
      
      this.ctx.fillStyle = nucleusGradient
      this.ctx.beginPath()
      this.ctx.arc(0, 0, comet.nucleusSize, 0, Math.PI * 2)
      this.ctx.fill()
      
      if (comet.tail.length > 1) {
        this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        
        for (let i = 0; i < comet.tail.length - 1; i++) {
          const point = comet.tail[i]
          const nextPoint = comet.tail[i + 1]
          
          if (point.opacity > 0.1) {
            this.ctx.globalAlpha = point.opacity * alpha * 0.6
            this.ctx.lineWidth = point.size
            this.ctx.moveTo(point.x - comet.x, point.y - comet.y)
            this.ctx.lineTo(nextPoint.x - comet.x, nextPoint.y - comet.y)
          }
        }
        
        this.ctx.stroke()
        this.ctx.globalAlpha = 1
      }
      
      const comaGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, comet.size)
      comaGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`)
      comaGradient.addColorStop(0.5, `rgba(${r * 0.7}, ${g * 0.7}, ${b * 0.7}, ${alpha * 0.2})`)
      comaGradient.addColorStop(1, 'transparent')
      
      this.ctx.fillStyle = comaGradient
      this.ctx.beginPath()
      this.ctx.arc(0, 0, comet.size, 0, Math.PI * 2)
      this.ctx.fill()
      
      this.ctx.restore()
    })
  }

  private generateDNA(): string {
    const bases = ['A', 'T', 'G', 'C', '∞', '◊', '※', '⚡']
    return Array.from({length: 12}, () => bases[Math.floor(Math.random() * bases.length)]).join('')
  }

  private addRandomElement() {
    const dna = this.generateDNA()
    const consciousness = Math.random()
    
    this.elements.push({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 5 + Math.random() * 30,
      hue: Math.random() * 360,
      type: Math.floor(Math.random() * 25),
      life: 0,
      maxLife: 300 + Math.random() * 500,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      consciousness: consciousness,
      memory: Array.from({length: 5}, () => Math.random()),
      dna: dna,
      emotion: Math.random() * 2 - 1,
      magnetism: Math.random() * 2 - 1,
      temperature: Math.random(),
      dimension: 2 + Math.random() * 3,
      quantumState: Math.random(),
      dreams: Array.from({length: 3}, () => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        intensity: Math.random()
      })),
      depth: Math.random() * 100
    })
  }

  render(timestamp: number, pauseGeneration: boolean = false) {
    this.time += (timestamp * 0.001 - this.time) * this.settings.timeSpeed

    if (this.blackHoleCooldown > 0) {
      this.blackHoleCooldown -= 1
    }

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
    this.ctx.fillRect(0, 0, this.width, this.height)

    this.renderAmbientParticles()
    this.renderAdvancedAstronomicalElements()

    this.handleMeteorEvents()
    this.handleSpaceEvents()
    
    this.updateAsteroids()
    this.updateComets()
    this.renderAsteroids()
    this.renderComets()
    
    this.updateSpaceEvents()
    this.renderSpaceEvents()

    if (this.time % 5 < 0.1) {
      if (Math.random() < 0.001) {
        this.createBurst()
      }
      if (Math.random() < 0.0005) {
        this.createBlackHole()
      }
      if (Math.random() < 0.0003) {
        this.createWormhole()
      }
      if (Math.random() < 0.0002) {
        this.createTimeDistortion()
      }
      if (Math.random() < 0.0001) {
        this.createMagneticField()
      }
    }
  }

  private updateElements() {
    this.elements = this.elements.filter(element => {
      element.life++
      element.x += element.vx
      element.y += element.vy
      element.rotation += element.rotationSpeed
      
    
      this.updateConsciousness(element)
      this.updateEmotions(element)
      this.processMemories(element)
      this.quantumFluctuations(element)
      
    
      const consciousTurbulence = element.consciousness * 0.2
      element.vx += (Math.random() - 0.5) * consciousTurbulence
      element.vy += (Math.random() - 0.5) * consciousTurbulence
      
    
      const maxSpeed = 3
      const speed = Math.sqrt(element.vx * element.vx + element.vy * element.vy)
      if (speed > maxSpeed) {
        element.vx = (element.vx / speed) * maxSpeed
        element.vy = (element.vy / speed) * maxSpeed
      }
      
    
      if (element.x < 0 || element.x > this.width) {
        element.vx *= -0.8
        element.vx += (Math.random() - 0.5) * 1
        element.x = Math.max(0, Math.min(this.width, element.x))
      }
      if (element.y < 0 || element.y > this.height) {
        element.vy *= -0.8
        element.vy += (Math.random() - 0.5) * 1
        element.y = Math.max(0, Math.min(this.height, element.y))
      }
      
    
      element.hue += (Math.random() - 0.5) * 2
      if (element.hue < 0) element.hue += 360
      if (element.hue > 360) element.hue -= 360
      
    
      element.size += (Math.random() - 0.5) * 0.5
      element.size = Math.max(2, Math.min(50, element.size))
      
      return element.life < element.maxLife
    })
  }

  private renderElements() {
    this.elements.forEach(element => {
      const alpha = 1 - (element.life / element.maxLife)
      
      this.ctx.save()
      this.ctx.translate(element.x, element.y)
      this.ctx.rotate(element.rotation)
      
    
      const saturation = 60 + Math.random() * 40
      const lightness = 40 + Math.random() * 40
      this.ctx.fillStyle = `hsla(${element.hue}, ${saturation}%, ${lightness}%, ${alpha})`
      this.ctx.strokeStyle = `hsla(${(element.hue + 60) % 360}, ${saturation + 20}%, ${lightness + 20}%, ${alpha})`
      this.ctx.lineWidth = 1 + Math.random() * 2
      
    
      this.renderShape(element.type, element.size)
      
      this.ctx.restore()
      
    
      if (Math.random() < 0.1) {
        this.drawConnections(element)
      }
    })
  }

  private renderShape(type: number, size: number) {
    this.ctx.beginPath()
    
  
    const sizeVariation = 0.8 + Math.random() * 0.4
    size = size * sizeVariation
    
    switch (type) {
      case 0:
        if (Math.random() < 0.3) {
        
          this.ctx.ellipse(0, 0, size, size * (0.4 + Math.random() * 0.8), 0, 0, Math.PI * 2)
        } else {
          this.ctx.arc(0, 0, size, 0, Math.PI * 2)
        }
        break
        
      case 1:
        const width = size * (0.5 + Math.random() * 1.5)
        const height = size * (0.5 + Math.random() * 1.5)
        this.ctx.rect(-width/2, -height/2, width, height)
        break
        
      case 2:
        this.ctx.moveTo(0, -size)
        this.ctx.lineTo(-size, size)
        this.ctx.lineTo(size, size)
        this.ctx.closePath()
        break
        
      case 3:
        const starPoints = 5 + Math.floor(Math.random() * 3)
        for (let i = 0; i < starPoints * 2; i++) {
          const angle = (i / (starPoints * 2)) * Math.PI * 2
          const radius = i % 2 === 0 ? size : size * 0.5
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (i === 0) this.ctx.moveTo(x, y)
          else this.ctx.lineTo(x, y)
        }
        this.ctx.closePath()
        break
        
      case 4:
        this.ctx.rect(-size/4, -size, size/2, size*2)
        this.ctx.rect(-size, -size/4, size*2, size/2)
        break
        
      case 5:
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          const radius = size * (0.7 + Math.random() * 0.6)
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (i === 0) this.ctx.moveTo(x, y)
          else this.ctx.lineTo(x, y)
        }
        this.ctx.closePath()
        break
        
      case 6:
        for (let i = 0; i < 20; i++) {
          const angle = i * 0.5
          const radius = (i / 20) * size
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (i === 0) this.ctx.moveTo(x, y)
          else this.ctx.lineTo(x, y)
        }
        break
        
      case 7:
        const segments = 6 + Math.floor(Math.random() * 6)
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2
          const radius = size * (0.5 + Math.sin(angle * 3 + this.time) * 0.3)
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (i === 0) this.ctx.moveTo(x, y)
          else this.ctx.lineTo(x, y)
        }
        this.ctx.closePath()
        break
        
      case 8:
        const blobPoints = 8 + Math.floor(Math.random() * 8)
        for (let i = 0; i <= blobPoints; i++) {
          const angle = (i / blobPoints) * Math.PI * 2
          const randomRadius = size * (0.4 + Math.random() * 0.6)
          const x = Math.cos(angle) * randomRadius
          const y = Math.sin(angle) * randomRadius
          if (i === 0) this.ctx.moveTo(x, y)
          else this.ctx.lineTo(x, y)
        }
        this.ctx.closePath()
        break
        
      case 9:
        this.ctx.moveTo(0, -size)
        for (let i = 1; i <= 8; i++) {
          const x = (Math.random() - 0.5) * size * 0.8
          const y = -size + (i / 8) * size * 2
          this.ctx.lineTo(x, y)
        }
        break
        
      case 10:
        const petals = 4 + Math.floor(Math.random() * 8)
        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2
          const petalLength = size * (0.5 + Math.random() * 0.8)
          const x = Math.cos(angle) * petalLength
          const y = Math.sin(angle) * petalLength
          this.ctx.moveTo(0, 0)
          this.ctx.lineTo(x, y)
        
          this.ctx.moveTo(x + size*0.1, y)
          this.ctx.arc(x, y, size * 0.15, 0, Math.PI * 2)
        }
        break
        
      case 11:
        const cloudBumps = 5 + Math.floor(Math.random() * 6)
        for (let i = 0; i < cloudBumps; i++) {
          const angle = (i / cloudBumps) * Math.PI * 2
          const bumpSize = size * (0.3 + Math.random() * 0.4)
          const x = Math.cos(angle) * size * 0.5
          const y = Math.sin(angle) * size * 0.3
          this.ctx.moveTo(x + bumpSize, y)
          this.ctx.arc(x, y, bumpSize, 0, Math.PI * 2)
        }
        break
        
      case 12:
        const cellPoints = 12 + Math.floor(Math.random() * 8)
        for (let i = 0; i <= cellPoints; i++) {
          const angle = (i / cellPoints) * Math.PI * 2
          const wobble = Math.sin(angle * 4 + this.time * 2) * 0.3
          const radius = size * (0.6 + wobble + Math.random() * 0.2)
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (i === 0) this.ctx.moveTo(x, y)
          else this.ctx.lineTo(x, y)
        }
        this.ctx.closePath()
        break
        
      case 13:
        const crystalFaces = 6 + Math.floor(Math.random() * 6)
        for (let i = 0; i < crystalFaces; i++) {
          const angle = (i / crystalFaces) * Math.PI * 2 + Math.random() * 0.5
          const faceLength = size * (0.4 + Math.random() * 0.6)
          const x = Math.cos(angle) * faceLength
          const y = Math.sin(angle) * faceLength
          if (i === 0) this.ctx.moveTo(x, y)
          else this.ctx.lineTo(x, y)
        }
        this.ctx.closePath()
        break
        
      case 14:
        this.ctx.moveTo(-size, 0)
        for (let i = 0; i <= 20; i++) {
          const x = -size + (i / 20) * size * 2
          const frequency = 2 + Math.random() * 4
          const amplitude = size * (0.3 + Math.random() * 0.4)
          const y = Math.sin(i * frequency * 0.1 + this.time) * amplitude
          this.ctx.lineTo(x, y)
        }
        break
        
      case 15:
        const webLines = 6 + Math.floor(Math.random() * 6)
        for (let i = 0; i < webLines; i++) {
          const angle = (i / webLines) * Math.PI * 2
          const length = size * (0.5 + Math.random() * 0.5)
          this.ctx.moveTo(0, 0)
          this.ctx.lineTo(
            Math.cos(angle) * length,
            Math.sin(angle) * length
          )
        }
      
        for (let r = size * 0.2; r < size; r += size * 0.3) {
          this.ctx.moveTo(r, 0)
          this.ctx.arc(0, 0, r, 0, Math.PI * 2)
        }
        break
        
      case 16:
        this.ctx.moveTo(0, -size)
      
        this.ctx.quadraticCurveTo(-size * 0.5, -size * 0.3, -size * 0.3, 0)
        this.ctx.quadraticCurveTo(-size * 0.2, size * 0.7, 0, size)
      
        this.ctx.quadraticCurveTo(size * 0.2, size * 0.7, size * 0.3, 0)
        this.ctx.quadraticCurveTo(size * 0.5, -size * 0.3, 0, -size)
      
        this.ctx.moveTo(0, -size)
        this.ctx.lineTo(0, size)
        break
        
      case 17:
      
        this.ctx.moveTo(0, 0)
        this.ctx.quadraticCurveTo(-size * 0.8, -size * 0.6, -size * 0.4, -size * 0.2)
        this.ctx.quadraticCurveTo(-size * 0.2, -size * 0.8, 0, -size * 0.3)
      
        this.ctx.moveTo(0, 0)
        this.ctx.quadraticCurveTo(-size * 0.6, size * 0.4, -size * 0.3, size * 0.2)
        this.ctx.quadraticCurveTo(-size * 0.1, size * 0.6, 0, size * 0.2)
      
        this.ctx.moveTo(0, 0)
        this.ctx.quadraticCurveTo(size * 0.8, -size * 0.6, size * 0.4, -size * 0.2)
        this.ctx.quadraticCurveTo(size * 0.2, -size * 0.8, 0, -size * 0.3)
        this.ctx.moveTo(0, 0)
        this.ctx.quadraticCurveTo(size * 0.6, size * 0.4, size * 0.3, size * 0.2)
        this.ctx.quadraticCurveTo(size * 0.1, size * 0.6, 0, size * 0.2)
      
        this.ctx.moveTo(0, -size * 0.3)
        this.ctx.lineTo(0, size * 0.8)
        break
        
      case 18:
        this.ctx.moveTo(0, -size)
        this.ctx.quadraticCurveTo(size * 0.6, -size * 0.3, size * 0.6, size * 0.3)
        this.ctx.quadraticCurveTo(size * 0.6, size * 0.8, 0, size)
        this.ctx.quadraticCurveTo(-size * 0.6, size * 0.8, -size * 0.6, size * 0.3)
        this.ctx.quadraticCurveTo(-size * 0.6, -size * 0.3, 0, -size)
        break
        
      case 19:
        const randomPoints = 5 + Math.floor(Math.random() * 10)
        const points = []
      
        for (let i = 0; i < randomPoints; i++) {
          const angle = (i / randomPoints) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
          const radius = size * (0.3 + Math.random() * 0.7)
          points.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
          })
        }
      
        if (points.length > 0) {
          this.ctx.moveTo(points[0].x, points[0].y)
          for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1]
            const curr = points[i]
            const next = points[(i + 1) % points.length]
            
            const cpX = curr.x + (next.x - prev.x) * 0.1
            const cpY = curr.y + (next.y - prev.y) * 0.1
            
            this.ctx.quadraticCurveTo(cpX, cpY, curr.x, curr.y)
          }
          this.ctx.closePath()
        }
        break
        
      case 20:
        this.renderThought(size)
        break
        
      case 21:
        this.renderEmotion(size)
        break
        
      case 22:
        this.renderMemory(size)
        break
        
      case 23:
        this.renderFoldedDimension(size)
        break
        
      case 24:
        this.renderLucidDream(size)
        break
    }
    
  
    if (Math.random() < 0.7) {
      this.ctx.fill()
    }
    if (Math.random() < 0.5) {
      this.ctx.stroke()
    }
  }
  
  private renderThought(size: number) {
    const nodes = 4 + Math.floor(Math.random() * 6)
    const centerPulse = Math.sin(this.time * 4) * 0.3
    
    for (let i = 0; i < nodes; i++) {
      const angle = (i / nodes) * Math.PI * 2 + Math.sin(this.time * 2) * 0.4
      const distance = size * (0.4 + Math.sin(this.time * 1.5 + i) * 0.2)
      const nodeSize = size * (0.08 + Math.random() * 0.15) * (1 + centerPulse)
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance
      
      const nodeGradient = this.ctx.createRadialGradient(x, y, 0, x, y, nodeSize * 2)
      nodeGradient.addColorStop(0, `rgba(255, 255, 255, 0.8)`)
      nodeGradient.addColorStop(0.5, `rgba(150, 200, 255, 0.4)`)
      nodeGradient.addColorStop(1, 'transparent')
      
      this.ctx.fillStyle = nodeGradient
      this.ctx.beginPath()
      this.ctx.arc(x, y, nodeSize * 2, 0, Math.PI * 2)
      this.ctx.fill()
      
      this.ctx.fillStyle = `rgba(200, 220, 255, 0.9)`
      this.ctx.beginPath()
      this.ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
      this.ctx.fill()
      
      if (i > 0) {
        const prevAngle = ((i-1) / nodes) * Math.PI * 2 + Math.sin(this.time * 2) * 0.4
        const prevDistance = size * (0.4 + Math.sin(this.time * 1.5 + (i-1)) * 0.2)
        const prevX = Math.cos(prevAngle) * prevDistance
        const prevY = Math.sin(prevAngle) * prevDistance
        
        const connectionIntensity = 0.3 + Math.sin(this.time * 3 + i) * 0.2
        this.ctx.strokeStyle = `rgba(100, 150, 255, ${connectionIntensity})`
        this.ctx.lineWidth = 1.5
        this.ctx.beginPath()
        this.ctx.moveTo(prevX, prevY)
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
      }
    }
    
    this.ctx.fillStyle = `rgba(255, 255, 255, 0.6)`
    this.ctx.beginPath()
    this.ctx.arc(0, 0, size * 0.05, 0, Math.PI * 2)
    this.ctx.fill()
  }
  
  private renderEmotion(size: number) {
    const energyLevel = Math.sin(this.time * 3) * 0.5 + 0.5
    const harmonics = 6 + Math.floor(energyLevel * 6)
    const coreRadius = size * 0.3
    
    this.ctx.save()
    this.ctx.globalCompositeOperation = 'screen'
    
    for (let layer = 0; layer < 3; layer++) {
      const layerIntensity = energyLevel * (1 - layer * 0.3)
      const layerRadius = coreRadius * (1.2 + layer * 0.4)
      
      this.ctx.beginPath()
      for (let i = 0; i <= harmonics; i++) {
        const angle = (i / harmonics) * Math.PI * 2
        const waveAmplitude = layerRadius * (0.1 + layerIntensity * Math.sin(angle * 4 + this.time * 4 + layer) * 0.2)
        const currentRadius = layerRadius + waveAmplitude
        const x = Math.cos(angle) * currentRadius
        const y = Math.sin(angle) * currentRadius
        
        if (i === 0) this.ctx.moveTo(x, y)
        else this.ctx.lineTo(x, y)
      }
      this.ctx.closePath()
      
      const layerAlpha = layerIntensity * (0.4 - layer * 0.1)
      this.ctx.fillStyle = `rgba(255, ${100 + layer * 50}, ${150 + layer * 30}, ${layerAlpha})`
      this.ctx.fill()
    }
    
    const centerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, coreRadius)
    centerGradient.addColorStop(0, `rgba(255, 255, 255, ${energyLevel * 0.8})`)
    centerGradient.addColorStop(0.7, `rgba(255, 200, 150, ${energyLevel * 0.4})`)
    centerGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = centerGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, coreRadius, 0, Math.PI * 2)
    this.ctx.fill()
    
    this.ctx.restore()
  }
  
  private renderMemory(size: number) {
    const dataPoints = 8 + Math.floor(Math.random() * 8)
    const rotationSpeed = this.time * 0.3
    const coreSize = size * 0.08
    
    this.ctx.save()
    
    for (let i = 0; i < dataPoints; i++) {
      const angle = (i / dataPoints) * Math.PI * 2 + rotationSpeed
      const orbitRadius = size * (0.3 + Math.sin(this.time * 1.2 + i) * 0.2)
      const pointSize = size * (0.03 + Math.random() * 0.06)
      const x = Math.cos(angle) * orbitRadius
      const y = Math.sin(angle) * orbitRadius
      
      const accessProbability = Math.sin(this.time * 1.5 + i * 0.7) * 0.5 + 0.5
      const pointAlpha = 0.3 + accessProbability * 0.7
      
      const pointGradient = this.ctx.createRadialGradient(x, y, 0, x, y, pointSize * 3)
      pointGradient.addColorStop(0, `rgba(100, 200, 255, ${pointAlpha})`)
      pointGradient.addColorStop(0.6, `rgba(150, 150, 255, ${pointAlpha * 0.5})`)
      pointGradient.addColorStop(1, 'transparent')
      
      this.ctx.fillStyle = pointGradient
      this.ctx.beginPath()
      this.ctx.arc(x, y, pointSize * 3, 0, Math.PI * 2)
      this.ctx.fill()
      
      this.ctx.fillStyle = `rgba(200, 220, 255, ${pointAlpha})`
      this.ctx.beginPath()
      this.ctx.arc(x, y, pointSize, 0, Math.PI * 2)
      this.ctx.fill()
      
      if (accessProbability > 0.6) {
        const connectionAlpha = (accessProbability - 0.6) * 2.5
        this.ctx.strokeStyle = `rgba(150, 200, 255, ${connectionAlpha * 0.6})`
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
        
        const sparkles = 3
        for (let s = 0; s < sparkles; s++) {
          const sparkX = (x * s) / sparkles + (Math.random() - 0.5) * 3
          const sparkY = (y * s) / sparkles + (Math.random() - 0.5) * 3
          this.ctx.fillStyle = `rgba(255, 255, 255, ${connectionAlpha * 0.8})`
          this.ctx.beginPath()
          this.ctx.arc(sparkX, sparkY, 0.5, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
    }
    
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize * 2)
    coreGradient.addColorStop(0, `rgba(255, 255, 255, 0.9)`)
    coreGradient.addColorStop(0.5, `rgba(200, 220, 255, 0.6)`)
    coreGradient.addColorStop(1, 'transparent')
    
    this.ctx.fillStyle = coreGradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, coreSize * 2, 0, Math.PI * 2)
    this.ctx.fill()
    
    this.ctx.restore()
  }
  
  private renderFoldedDimension(size: number) {
    const dimensionalLayers = 5
    const complexity = 24
    const timePhase = this.time * 0.8
    
    this.ctx.save()
    this.ctx.globalCompositeOperation = 'screen'
    
    for (let layer = 0; layer < dimensionalLayers; layer++) {
      const layerDepth = layer / dimensionalLayers
      const layerAlpha = 0.4 * (1 - layerDepth * 0.6)
      const phaseOffset = layer * Math.PI * 0.4
      
      this.ctx.strokeStyle = `rgba(${100 + layer * 30}, ${150 + layer * 20}, 255, ${layerAlpha})`
      this.ctx.lineWidth = 2 - layer * 0.3
      this.ctx.beginPath()
      
      for (let i = 0; i <= complexity; i++) {
        const t = i / complexity
        const spiralAngle = t * Math.PI * 6 + phaseOffset + timePhase
        
        const hyperX = Math.cos(spiralAngle) * size * (0.3 + t * 0.4)
        const hyperY = Math.sin(spiralAngle) * size * (0.3 + t * 0.4)
        const hyperZ = Math.sin(spiralAngle * 1.5 + timePhase) * size * 0.25
        const hyperW = Math.cos(spiralAngle * 0.7 + timePhase + layer) * size * 0.15
        
        const perspectiveScale = 1 + (hyperZ + hyperW) / (size * 3)
        const x = hyperX / perspectiveScale + Math.sin(timePhase + t * 4) * layerDepth * 5
        const y = hyperY / perspectiveScale + Math.cos(timePhase + t * 3) * layerDepth * 5
        
        if (i === 0) this.ctx.moveTo(x, y)
        else this.ctx.lineTo(x, y)
      }
      this.ctx.stroke()
      
      if (layer < 2) {
        const nodeCount = 6 + layer * 2
        for (let n = 0; n < nodeCount; n++) {
          const nodeAngle = (n / nodeCount) * Math.PI * 2 + timePhase + layer
          const nodeRadius = size * (0.2 + layer * 0.1)
          const nodeX = Math.cos(nodeAngle) * nodeRadius
          const nodeY = Math.sin(nodeAngle) * nodeRadius
          
          const nodeGradient = this.ctx.createRadialGradient(nodeX, nodeY, 0, nodeX, nodeY, 6)
          nodeGradient.addColorStop(0, `rgba(255, 255, 255, ${layerAlpha * 0.8})`)
          nodeGradient.addColorStop(1, 'transparent')
          
          this.ctx.fillStyle = nodeGradient
          this.ctx.beginPath()
          this.ctx.arc(nodeX, nodeY, 6, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
    }
    
    this.ctx.restore()
  }
  
  private renderLucidDream(size: number) {
    const dimensions = 4
    const baseAlpha = this.ctx.globalAlpha
    const dreamIntensity = Math.sin(this.time * 1.2) * 0.5 + 0.5
    
    this.ctx.save()
    this.ctx.globalCompositeOperation = 'screen'
    
    for (let dim = 0; dim < dimensions; dim++) {
      const dimAlpha = baseAlpha * (0.2 + dim * 0.15) * dreamIntensity
      this.ctx.globalAlpha = dimAlpha
      
      const phaseShift = dim * Math.PI * 0.5
      const dreamPhase = this.time * (0.8 + dim * 0.3) + phaseShift
      const morphSize = size * (0.6 + Math.sin(dreamPhase * 0.7) * 0.3)
      const dimensionalShift = dim * size * 0.08
      
      const waveforms = 3 + dim
      this.ctx.beginPath()
      
      const resolution = 32
      for (let i = 0; i <= resolution; i++) {
        const t = i / resolution
        const angle = t * Math.PI * 2
        
        let radius = morphSize * 0.4
        for (let w = 1; w <= waveforms; w++) {
          const waveContrib = Math.sin(angle * w + dreamPhase + w * phaseShift) * (morphSize * 0.1 / w)
          radius += waveContrib
        }
        
        const x = Math.cos(angle) * radius + Math.sin(dreamPhase * 0.6 + dim) * dimensionalShift
        const y = Math.sin(angle) * radius + Math.cos(dreamPhase * 0.8 + dim) * dimensionalShift
        
        if (i === 0) this.ctx.moveTo(x, y)
        else this.ctx.lineTo(x, y)
      }
      this.ctx.closePath()
      
      const hue = (dim * 60 + this.time * 20) % 360
      this.ctx.fillStyle = `hsla(${hue}, 70%, ${60 + dim * 10}%, ${dimAlpha})`
      this.ctx.fill()
      
      if (dim < 2) {
        const sparkCount = 8 + dim * 4
        for (let s = 0; s < sparkCount; s++) {
          const sparkAngle = (s / sparkCount) * Math.PI * 2 + dreamPhase
          const sparkRadius = morphSize * (0.2 + Math.random() * 0.4)
          const sparkX = Math.cos(sparkAngle) * sparkRadius
          const sparkY = Math.sin(sparkAngle) * sparkRadius
          
          const sparkSize = 2 + Math.random() * 3
          const sparkGradient = this.ctx.createRadialGradient(sparkX, sparkY, 0, sparkX, sparkY, sparkSize)
          sparkGradient.addColorStop(0, `rgba(255, 255, 255, ${dimAlpha * 0.8})`)
          sparkGradient.addColorStop(1, 'transparent')
          
          this.ctx.fillStyle = sparkGradient
          this.ctx.beginPath()
          this.ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
    }
    
    this.ctx.restore()
  }
  
  private checkCollisions() {
    if (this.elements.length > 10) {
      const maxChecks = Math.min(50, this.elements.length * 2)
      let checks = 0
      
      for (let i = 0; i < this.elements.length && checks < maxChecks; i++) {
        for (let j = i + 1; j < this.elements.length && checks < maxChecks; j++) {
          checks++
          const elem1 = this.elements[i]
          const elem2 = this.elements[j]
          
          const dx = elem1.x - elem2.x
          const dy = elem1.y - elem2.y
          const distance = dx * dx + dy * dy
          const minDistance = (elem1.size + elem2.size) * 0.8
          const minDistanceSquared = minDistance * minDistance
          
          if (distance < minDistanceSquared) {
            if (Math.random() < 0.5) {
              this.createCollisionEffect(elem1, elem2)
            }
            this.handleCollision(elem1, elem2, i, j)
          }
        }
      }
    } else {
      for (let i = 0; i < this.elements.length; i++) {
        for (let j = i + 1; j < this.elements.length; j++) {
          const elem1 = this.elements[i]
          const elem2 = this.elements[j]
          
          const dx = elem1.x - elem2.x
          const dy = elem1.y - elem2.y
          const distance = dx * dx + dy * dy
          const minDistance = (elem1.size + elem2.size) * 0.8
          const minDistanceSquared = minDistance * minDistance
          
          if (distance < minDistanceSquared) {
            this.createCollisionEffect(elem1, elem2)
            this.handleCollision(elem1, elem2, i, j)
          }
        }
      }
    }
  }

  private createCollisionEffect(elem1: any, elem2: any) {
    const centerX = (elem1.x + elem2.x) / 2
    const centerY = (elem1.y + elem2.y) / 2
    
    this.ctx.save()
    this.ctx.globalAlpha = 0.4
    this.ctx.globalCompositeOperation = 'screen'
    
    const sparkCount = 3 + Math.floor(Math.random() * 4)
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2 + Math.random()
      const distance = 8 + Math.random() * 12
      const sparkX = centerX + Math.cos(angle) * distance
      const sparkY = centerY + Math.sin(angle) * distance
      
      this.ctx.fillStyle = `hsla(${(elem1.hue + elem2.hue) / 2}, 80%, 70%, 0.6)`
      this.ctx.beginPath()
      this.ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2)
      this.ctx.fill()
    }
    
    this.ctx.restore()
  }

  private handleCollision(elem1: any, elem2: any, index1: number, index2: number) {
    const centerX = (elem1.x + elem2.x) / 2
    const centerY = (elem1.y + elem2.y) / 2
    
    if (Math.random() < 0.1 && this.elements.length < 15) {
      this.createCollisionOffspring(elem1, elem2, centerX, centerY)
    }
    
    if (Math.random() < 0.05 && this.elements.length > 8) {
      this.createFusionElement(elem1, elem2, centerX, centerY, index1, index2)
    } else {
      elem1.vx = -elem1.vx * 0.8 + (Math.random() - 0.5) * 0.5
      elem1.vy = -elem1.vy * 0.8 + (Math.random() - 0.5) * 0.5
      elem2.vx = -elem2.vx * 0.8 + (Math.random() - 0.5) * 0.5
      elem2.vy = -elem2.vy * 0.8 + (Math.random() - 0.5) * 0.5
      
      elem1.consciousness += 0.05
      elem2.consciousness += 0.05
      elem1.emotion += 0.1
      elem2.emotion += 0.1
    }
  }

  private createCollisionOffspring(parent1: any, parent2: any, x: number, y: number) {
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
      depth: Math.random() * 100
    })
  }

  private createFusionElement(elem1: any, elem2: any, x: number, y: number, index1: number, index2: number) {
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
      maxLife: (elem1.maxLife + elem2.maxLife),
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
      depth: Math.random() * 100
    }
    
    this.elements.splice(Math.max(index1, index2), 1)
    this.elements.splice(Math.min(index1, index2), 1)
    this.elements.push(fusedElement)
  }

  private crossoverDNA(dna1: string, dna2: string): string {
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
      result[mutationIndex] = mutations[Math.floor(Math.random() * mutations.length)]
    }
    
    return result.join('')
  }

  private fuseDNA(dna1: string, dna2: string): string {
    const fused = dna1 + dna2
    const transcendent = ['∞', '◊', '※', '⚡', '✧', '◈', '⟡', '◉', '⬟', '◎']
    return Array.from({length: 15}, () => 
      transcendent[Math.floor(Math.random() * transcendent.length)]
    ).join('')
  }

  private blendMemories(mem1: number[], mem2: number[]): number[] {
    const blended = []
    const maxLength = Math.max(mem1.length, mem2.length)
    
    for (let i = 0; i < maxLength; i++) {
      const val1 = mem1[i] || 0
      const val2 = mem2[i] || 0
      blended.push((val1 + val2) / 2 + (Math.random() - 0.5) * 0.1)
    }
    
    return blended.slice(0, 7)
  }

  private updateConsciousness(element: any) {
    const lifeExperience = element.life / element.maxLife
    const socialInteraction = this.elements.length / 25
    
    element.consciousness += (lifeExperience + socialInteraction) * 0.001
    element.consciousness = Math.min(1, element.consciousness)
    
    if (element.consciousness > 0.7) {
      const consciousNearby = this.elements.filter(other => 
        other !== element && 
        other.consciousness > 0.5 &&
        Math.sqrt((other.x - element.x) ** 2 + (other.y - element.y) ** 2) < 100
      )
      
      if (consciousNearby.length > 0) {
        const target = consciousNearby[0]
        const dx = target.x - element.x
        const dy = target.y - element.y
        element.vx += dx * 0.001
        element.vy += dy * 0.001
      }
    }
  }
  
  private updateEmotions(element: any) {
    const crowding = this.elements.length / 25
    const isolation = crowding < 0.3 ? 0.5 : 0
    const excitement = Math.sin(this.time * 2 + element.life * 0.01) * 0.1
    
    element.emotion += (isolation - crowding + excitement) * 0.01
    element.emotion = Math.max(-1, Math.min(1, element.emotion))
    
    const emotionalHueShift = element.emotion * 30
    element.hue = (element.hue + emotionalHueShift) % 360
    
    if (element.emotion > 0.5) {
      element.size += 0.1 
    } else if (element.emotion < -0.5) {
      element.size -= 0.05
    }
  }
  
  private processMemories(element: any) {
    const recentExperience = Math.sin(this.time + element.life * 0.1)
    element.memory[0] = (element.memory[0] + recentExperience) * 0.5
    
    if (element.life % 100 === 0) {
      element.memory.push(element.memory.shift()!)
    }
    
    const memoryInfluence = element.memory.reduce((sum: number, mem: number) => sum + mem, 0) / element.memory.length
    element.rotationSpeed += memoryInfluence * 0.001
  }
  
  private quantumFluctuations(element: any) {
    element.quantumState += (Math.random() - 0.5) * 0.1
    element.quantumState = Math.max(0, Math.min(1, element.quantumState))
    
    if (Math.random() < 0.001) {
      element.quantumState = Math.random()
      if (element.quantumState > 0.95) {
        element.x = Math.random() * this.width
        element.y = Math.random() * this.height
        element.vx *= -1
        element.vy *= -1
      }
    }
    
    element.dimension = 2 + element.quantumState * 3
    
    element.dreams.forEach((dream: {x: number, y: number, intensity: number}) => {
      dream.x += (Math.random() - 0.5) * element.quantumState * 10
      dream.y += (Math.random() - 0.5) * element.quantumState * 10
      dream.intensity = element.quantumState * Math.sin(this.time + dream.x * 0.01)
    })
  }

  private drawConnections(element: any) {
    const nearbyElements = this.elements.filter(other => {
      if (other === element) return false
      const dx = other.x - element.x
      const dy = other.y - element.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance < 100 && Math.random() < 0.3
    })
    
    nearbyElements.forEach(other => {
      const alpha = 0.1 + Math.random() * 0.2
      this.ctx.strokeStyle = `hsla(${(element.hue + other.hue) / 2}, 50%, 60%, ${alpha})`
      this.ctx.lineWidth = 0.5 + Math.random() * 1
      this.ctx.beginPath()
      this.ctx.moveTo(element.x, element.y)
      this.ctx.lineTo(other.x, other.y)
      this.ctx.stroke()
    })
  }

  private createBurst() {
    const centerX = Math.random() * this.width
    const centerY = Math.random() * this.height
    const burstSize = 5 + Math.floor(Math.random() * 8)
    const burstHue = Math.random() * 360
    
    for (let i = 0; i < burstSize; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 3
      
      this.elements.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 15,
        hue: burstHue + (Math.random() - 0.5) * 60,
        type: Math.floor(Math.random() * 20),
        life: 0,
        maxLife: 200 + Math.random() * 300,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        consciousness: Math.random() * 0.3,
        memory: Array.from({length: 5}, () => Math.random()),
        dna: this.generateDNA(),
        emotion: Math.random() * 2 - 1,
        magnetism: Math.random() * 2 - 1,
        temperature: Math.random(),
        dimension: 2 + Math.random() * 3,
        quantumState: Math.random(),
        dreams: Array.from({length: 3}, () => ({
          x: centerX + (Math.random() - 0.5) * 100,
          y: centerY + (Math.random() - 0.5) * 100,
          intensity: Math.random()
        })),
        depth: Math.random() * 100
      })
    }
  }

  private createBlackHole() {
    const centerX = Math.random() * this.width
    const centerY = Math.random() * this.height
    
    this.elements.forEach(element => {
      const dx = centerX - element.x
      const dy = centerY - element.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 150) {
        const gravity = 200 / (distance + 10)
        element.vx += (dx / distance) * gravity * 0.01
        element.vy += (dy / distance) * gravity * 0.01
        
        if (distance < 30) {
          element.consciousness += 0.5
          element.dimension += 1
          element.hue = (element.hue + 180) % 360
        }
      }
    })
  }
  
  private createWormhole() {
    const point1 = { x: Math.random() * this.width, y: Math.random() * this.height }
    const point2 = { x: Math.random() * this.width, y: Math.random() * this.height }
    
    this.elements.forEach(element => {
      const dist1 = Math.sqrt((element.x - point1.x) ** 2 + (element.y - point1.y) ** 2)
      const dist2 = Math.sqrt((element.x - point2.x) ** 2 + (element.y - point2.y) ** 2)
      
      if (dist1 < 25) {
        element.x = point2.x + (Math.random() - 0.5) * 50
        element.y = point2.y + (Math.random() - 0.5) * 50
        element.quantumState = Math.random()
      } else if (dist2 < 25) {
        element.x = point1.x + (Math.random() - 0.5) * 50
        element.y = point1.y + (Math.random() - 0.5) * 50
        element.quantumState = Math.random()
      }
    })
  }
  
  private createTimeDistortion() {
    const affectedElements = this.elements.filter(() => Math.random() < 0.3)
    
    affectedElements.forEach(element => {
      if (Math.random() < 0.5) {
        element.life += 50
        element.rotationSpeed *= 2
        element.consciousness += 0.1
      } else {
        element.life = Math.max(0, element.life - 30)
        element.memory = element.memory.map(() => Math.random()) 
      }
    })
  }


  private createMagneticField() {
    const fieldCenter = {
      x: Math.random() * this.width,
      y: Math.random() * this.height
    }
    
    this.elements.forEach(element => {
      const dx = fieldCenter.x - element.x
      const dy = fieldCenter.y - element.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 200) {
        const force = (200 - distance) / 200
        const magneticStrength = element.magnetism * force * 0.02
        
        if (element.magnetism > 0) {
          element.vx += (dx / distance) * magneticStrength
          element.vy += (dy / distance) * magneticStrength
        } else {
          element.vx -= (dx / distance) * magneticStrength
          element.vy -= (dy / distance) * magneticStrength
        }
        
        element.hue += Math.sin(this.time * 3 + distance * 0.01) * 10
        element.rotationSpeed += magneticStrength * 2
      }
    })
  }


}
