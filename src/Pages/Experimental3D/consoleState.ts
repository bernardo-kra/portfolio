export const sectors = [
  { id: 'dock', code: 'D07', frequency: 88, x: 30, y: 65 },
  { id: 'boiler', code: 'B02', frequency: 104, x: 52, y: 34 },
  { id: 'tower', code: 'T09', frequency: 116, x: 77, y: 53 },
] as const

export type SectorId = (typeof sectors)[number]['id']
export type EventKind = 'boot' | 'select' | 'scan' | 'capture' | 'assist'
export type ConsoleEvent = {
  sequence: number
  kind: EventKind
  sector: SectorId
}
export type ConsoleState = {
  operation: { kind: 'scan' | 'capture'; stage: number; id: number } | null
  selected: SectorId
  frequency: number
  scanned: SectorId[]
  captured: SectorId[]
  events: ConsoleEvent[]
  sequence: number
}
export type ConsoleAction =
  | { type: 'begin'; kind: 'scan' | 'capture'; id: number }
  | { type: 'advance'; id: number; stage: number }
  | { type: 'finish'; id: number }
  | { type: 'cancel' }
  | { type: 'select'; sector: SectorId }
  | { type: 'tune'; frequency: number }
  | { type: 'scan' | 'assist' | 'capture' | 'reset' }

export function createConsoleState(): ConsoleState {
  return {
    operation: null,
    selected: 'dock',
    frequency: 100,
    scanned: [],
    captured: [],
    events: [{ sequence: 1, kind: 'boot', sector: 'dock' }],
    sequence: 1,
  }
}

export function signalQuality(frequency: number, target: number) {
  return Math.max(0, 100 - Math.abs(frequency - target) * 8)
}

function record(state: ConsoleState, kind: EventKind): ConsoleState {
  const sequence = state.sequence + 1
  return {
    ...state,
    sequence,
    events: [{ sequence, kind, sector: state.selected }, ...state.events].slice(
      0,
      4
    ),
  }
}

export function consoleReducer(
  state: ConsoleState,
  action: ConsoleAction
): ConsoleState {
  const sector = sectors.find((item) => item.id === state.selected)!
  switch (action.type) {
    case 'begin': {
      if (state.operation) return state
      if (action.kind === 'scan' && state.scanned.includes(state.selected))
        return state
      if (
        action.kind === 'capture' &&
        (!state.scanned.includes(state.selected) ||
          state.captured.includes(state.selected) ||
          signalQuality(state.frequency, sector.frequency) < 84)
      )
        return state
      return {
        ...state,
        operation: { kind: action.kind, stage: 0, id: action.id },
      }
    }
    case 'advance':
      if (
        !state.operation ||
        state.operation.id !== action.id ||
        state.operation.stage !== action.stage
      )
        return state
      if (state.operation.stage < 2)
        return {
          ...state,
          operation: { ...state.operation, stage: state.operation.stage + 1 },
        }
      return consoleReducer(
        { ...state, operation: null },
        { type: state.operation.kind }
      )
    case 'finish':
      if (!state.operation || state.operation.id !== action.id) return state
      return consoleReducer(
        { ...state, operation: null },
        { type: state.operation.kind }
      )
    case 'cancel':
      return state.operation ? { ...state, operation: null } : state
    case 'reset':
      return createConsoleState()
    case 'select':
      if (
        !sectors.some((item) => item.id === action.sector) ||
        state.selected === action.sector
      )
        return state
      return record(
        { ...state, selected: action.sector, operation: null },
        'select'
      )
    case 'tune':
      if (state.operation || !Number.isFinite(action.frequency)) return state
      return {
        ...state,
        frequency: Math.max(80, Math.min(120, Math.round(action.frequency))),
      }
    case 'scan':
      if (state.operation || state.scanned.includes(state.selected))
        return state
      return record(
        { ...state, scanned: [...state.scanned, state.selected] },
        'scan'
      )
    case 'assist':
      if (
        state.operation ||
        !state.scanned.includes(state.selected) ||
        state.frequency === sector.frequency
      )
        return state
      return record({ ...state, frequency: sector.frequency }, 'assist')
    case 'capture':
      if (
        state.operation ||
        !state.scanned.includes(state.selected) ||
        state.captured.includes(state.selected) ||
        signalQuality(state.frequency, sector.frequency) < 84
      )
        return state
      return record(
        { ...state, captured: [...state.captured, state.selected] },
        'capture'
      )
  }
}
