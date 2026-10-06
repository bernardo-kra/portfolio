import type {
  PomodoroState,
  PomodoroAction,
  PomodoroMode,
  PomodoroCycle,
} from './state'

function switchTimer(state: PomodoroState): PomodoroState {
  const newMode: PomodoroMode = state.mode === 'focus' ? 'break' : 'focus'
  const newTimeLeft =
    newMode === 'focus' ? state.focusDuration : state.breakDuration

  const newCycle: PomodoroCycle | null =
    state.timeLeft === 0
      ? {
          id: Date.now().toString(),
          mode: state.mode,
          completedAt: new Date(),
          duration:
            state.mode === 'focus' ? state.focusDuration : state.breakDuration,
          taskId: state.activeTaskId,
          taskName: state.activeTaskName,
        }
      : null

  return {
    ...state,
    mode: newMode,
    timeLeft: newTimeLeft,
    isRunning: false,
    cycles: newCycle ? [newCycle, ...state.cycles] : state.cycles,
  }
}

function timerAction(
  state: PomodoroState,
  action: PomodoroAction
): PomodoroState | undefined {
  switch (action.type) {
    case 'START':
      return { ...state, isRunning: true }

    case 'PAUSE':
      return { ...state, isRunning: false }

    case 'RESET':
      return {
        ...state,
        timeLeft:
          state.mode === 'focus' ? state.focusDuration : state.breakDuration,
        isRunning: false,
      }

    case 'TICK':
      if (state.timeLeft <= 0) {
        return state
      }
      return { ...state, timeLeft: state.timeLeft - 1 }

    case 'SET_FOCUS_DURATION':
      return {
        ...state,
        focusDuration: action.payload,
        timeLeft: state.mode === 'focus' ? action.payload : state.timeLeft,
      }

    case 'SET_BREAK_DURATION':
      return {
        ...state,
        breakDuration: action.payload,
        timeLeft: state.mode === 'break' ? action.payload : state.timeLeft,
      }

    default:
      return undefined
  }
}

function musicAction(
  state: PomodoroState,
  action: PomodoroAction
): PomodoroState | undefined {
  switch (action.type) {
    case 'SET_MUSIC_SETTINGS':
      return {
        ...state,
        musicSettings: {
          ...state.musicSettings,
          ...action.payload,
        },
      }

    case 'ADD_MUSIC_TRACK':
      return {
        ...state,
        musicSettings: {
          ...state.musicSettings,
          tracks: [...state.musicSettings.tracks, action.payload],
        },
      }

    case 'REMOVE_MUSIC_TRACK': {
      const updatedTracks = state.musicSettings.tracks.filter(
        (track) => track.id !== action.payload
      )
      const newCurrentTrackId =
        state.musicSettings.currentTrackId === action.payload
          ? updatedTracks[0]?.id || 'default'
          : state.musicSettings.currentTrackId
      return {
        ...state,
        musicSettings: {
          ...state.musicSettings,
          tracks: updatedTracks,
          currentTrackId: newCurrentTrackId,
        },
      }
    }
    case 'SET_CURRENT_TRACK':
      return {
        ...state,
        musicSettings: {
          ...state.musicSettings,
          currentTrackId: action.payload,
        },
      }

    default:
      return undefined
  }
}

function shuffledIndex(state: PomodoroState, currentIndex: number) {
  const availableTracks = state.musicSettings.tracks.filter(
    (track) => track.id !== state.musicSettings.currentTrackId
  )
  if (!availableTracks.length) return currentIndex
  const randomTrack =
    availableTracks[Math.floor(Math.random() * availableTracks.length)]
  return state.musicSettings.tracks.findIndex(
    (track) => track.id === randomTrack.id
  )
}

function nextTrack(state: PomodoroState): PomodoroState {
  const currentIndex = state.musicSettings.tracks.findIndex(
    (track) => track.id === state.musicSettings.currentTrackId
  )
  let nextIndex: number

  if (state.musicSettings.shuffleMode) {
    nextIndex = shuffledIndex(state, currentIndex)
  } else {
    nextIndex =
      currentIndex === -1 ||
      currentIndex === state.musicSettings.tracks.length - 1
        ? 0
        : currentIndex + 1
  }

  if (state.musicSettings.repeatMode === 'one') {
    nextIndex = currentIndex
  } else if (
    state.musicSettings.repeatMode === 'all' &&
    nextIndex === 0 &&
    currentIndex === state.musicSettings.tracks.length - 1
  ) {
    nextIndex = 0
  }

  return {
    ...state,
    musicSettings: {
      ...state.musicSettings,
      currentTrackId: state.musicSettings.tracks[nextIndex]?.id || 'default',
    },
  }
}

function previousTrack(state: PomodoroState): PomodoroState {
  const prevCurrentIndex = state.musicSettings.tracks.findIndex(
    (track) => track.id === state.musicSettings.currentTrackId
  )
  let prevIndex: number

  if (state.musicSettings.shuffleMode) {
    prevIndex = shuffledIndex(state, prevCurrentIndex)
  } else {
    prevIndex =
      prevCurrentIndex <= 0
        ? state.musicSettings.tracks.length - 1
        : prevCurrentIndex - 1
  }

  if (state.musicSettings.repeatMode === 'one') {
    prevIndex = prevCurrentIndex
  } else if (
    state.musicSettings.repeatMode === 'all' &&
    prevIndex === state.musicSettings.tracks.length - 1 &&
    prevCurrentIndex === 0
  ) {
    prevIndex = state.musicSettings.tracks.length - 1
  }

  return {
    ...state,
    musicSettings: {
      ...state.musicSettings,
      currentTrackId: state.musicSettings.tracks[prevIndex]?.id || 'default',
    },
  }
}

export function pomodoroReducer(
  state: PomodoroState,
  action: PomodoroAction
): PomodoroState {
  switch (action.type) {
    case 'SWITCH':
      return switchTimer(state)
    case 'NEXT_TRACK':
      return nextTrack(state)
    case 'PREVIOUS_TRACK':
      return previousTrack(state)
    case 'SET_ACTIVE_TASK':
      return {
        ...state,
        activeTaskId: action.payload?.taskId,
        activeTaskName: action.payload?.taskName,
      }

    case 'LOAD_STATE':
      return action.payload
    default:
      return timerAction(state, action) ?? musicAction(state, action) ?? state
  }
}
