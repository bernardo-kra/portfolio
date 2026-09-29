export type MissionPhase = 'server' | 'signal' | 'control' | 'complete'
export type MissionFile = 'manifest' | 'personnel' | 'maintenance' | 'blacktide'
export const gateCodes = ['088', '104', '116'] as const
export const requiredRoutes = [2, 0, 1] as const
export type MissionState = {
  phase: MissionPhase
  file: MissionFile
  routes: number[]
  isolated: boolean
  gates: number
  feedback: 'ready' | 'isolate' | 'route' | 'code' | 'opened'
  attempt: number
}
export type MissionAction =
  | { type: 'file'; file: MissionFile }
  | { type: 'connect' }
  | { type: 'signals'; captured: readonly string[] }
  | { type: 'isolate' }
  | { type: 'route'; index: number }
  | { type: 'gate'; code: string }
  | { type: 'extract' }
  | { type: 'reset' }

export function createMissionState(attempt = 1): MissionState {
  return {
    phase: 'server',
    file: 'manifest',
    routes: [0, 1, 2],
    isolated: false,
    gates: 0,
    feedback: 'ready',
    attempt,
  }
}

export function missionReducer(
  state: MissionState,
  action: MissionAction
): MissionState {
  if (action.type === 'reset') return createMissionState(state.attempt + 1)
  switch (action.type) {
    case 'file':
      return state.phase === 'server' ? { ...state, file: action.file } : state
    case 'connect':
      return state.phase === 'server' && state.file === 'blacktide'
        ? { ...state, phase: 'signal' }
        : state
    case 'signals':
      return state.phase === 'signal' &&
        ['dock', 'boiler', 'tower'].every((id) => action.captured.includes(id))
        ? { ...state, phase: 'control' }
        : state
    case 'isolate':
      return state.phase === 'control' && !state.isolated
        ? { ...state, isolated: true, feedback: 'ready' }
        : state
    case 'route':
      if (
        state.phase !== 'control' ||
        state.gates > 0 ||
        !Number.isInteger(action.index) ||
        action.index < 0 ||
        action.index > 2
      )
        return state
      return {
        ...state,
        routes: state.routes.map((value, index) =>
          index === action.index ? (value + 1) % 3 : value
        ),
        feedback: 'ready',
      }
    case 'gate':
      if (state.phase !== 'control' || state.gates >= 3) return state
      if (!state.isolated) return { ...state, feedback: 'isolate' }
      if (
        !state.routes.every((value, index) => value === requiredRoutes[index])
      )
        return { ...state, feedback: 'route' }
      if (action.code.trim() !== gateCodes[state.gates])
        return { ...state, feedback: 'code' }
      return { ...state, gates: state.gates + 1, feedback: 'opened' }
    case 'extract':
      return state.phase === 'control' && state.gates === 3
        ? { ...state, phase: 'complete' }
        : state
  }
}
