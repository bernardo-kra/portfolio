export type PomodoroMode = 'focus' | 'break'

export interface PomodoroCycle {
  id: string
  mode: PomodoroMode
  completedAt: Date
  duration: number
  taskId?: string
  taskName?: string
}

export interface MusicTrack {
  id: string
  name: string
  url: string
  artist?: string
  duration?: string
  thumbnail?: string
  isDefault?: boolean
}

export interface MusicSettings {
  isEnabled: boolean
  tracks: MusicTrack[]
  currentTrackId: string
  autoStopOnTimerEnd: boolean
  autoPlayOnTimerStart: boolean
  syncManualControls: boolean
  changeMusicOnTimerEnd: boolean
  backgroundMode: boolean
  volume: number
  shuffleMode: boolean
  repeatMode: 'none' | 'one' | 'all'
}

export interface PomodoroState {
  isRunning: boolean
  mode: PomodoroMode
  timeLeft: number
  cycles: PomodoroCycle[]
  focusDuration: number
  breakDuration: number
  musicSettings: MusicSettings
  activeTaskId?: string
  activeTaskName?: string
}

export type StoredPomodoroState = Omit<PomodoroState, 'cycles'> & {
  cycles: Array<Omit<PomodoroCycle, 'completedAt'> & { completedAt: string }>
}

export type PomodoroAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'SWITCH' }
  | { type: 'SET_FOCUS_DURATION'; payload: number }
  | { type: 'SET_BREAK_DURATION'; payload: number }
  | { type: 'SET_MUSIC_SETTINGS'; payload: Partial<MusicSettings> }
  | { type: 'ADD_MUSIC_TRACK'; payload: MusicTrack }
  | { type: 'REMOVE_MUSIC_TRACK'; payload: string }
  | { type: 'SET_CURRENT_TRACK'; payload: string }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | {
      type: 'SET_ACTIVE_TASK'
      payload: { taskId: string; taskName: string } | null
    }
  | { type: 'LOAD_STATE'; payload: PomodoroState }

export const initialState: PomodoroState = {
  isRunning: false,
  mode: 'focus',
  timeLeft: 25 * 60,
  cycles: [],
  focusDuration: 25 * 60,
  breakDuration: 5 * 60,
  musicSettings: {
    isEnabled: true,
    tracks: [
      {
        id: 'default',
        name: 'Lofi Hip Hop',
        url: 'https://www.youtube.com/watch?v=rXOOYIQHe-U',
        artist: 'Lofi Girl',
        isDefault: true,
      },
    ],
    currentTrackId: 'default',
    autoStopOnTimerEnd: true,
    autoPlayOnTimerStart: true,
    syncManualControls: true,
    changeMusicOnTimerEnd: false,
    backgroundMode: false,
    volume: 0.3,
    shuffleMode: false,
    repeatMode: 'none',
  },
}
