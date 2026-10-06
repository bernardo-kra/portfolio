import { logger } from '@src/services/logger'
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'

import { initialState } from './pomodoro/state'
import type {
  PomodoroState,
  StoredPomodoroState,
  PomodoroAction,
  MusicTrack,
  MusicSettings,
} from './pomodoro/state'
import { pomodoroReducer } from './pomodoro/reducer'
export type { PomodoroMode } from './pomodoro/state'

interface PomodoroContextType {
  state: PomodoroState
  dispatch: React.Dispatch<PomodoroAction>
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  skipTimer: () => void
  setFocusDuration: (minutes: number) => void
  setBreakDuration: (minutes: number) => void
  setMusicSettings: (settings: Partial<MusicSettings>) => void
  addMusicTrack: (track: MusicTrack) => void
  removeMusicTrack: (trackId: string) => void
  setCurrentTrack: (trackId: string) => void
  nextTrack: () => void
  previousTrack: () => void
  setActiveTask: (task: { taskId: string; taskName: string } | null) => void
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(
  undefined
)

interface PomodoroProviderProps {
  children: ReactNode
}

export const PomodoroProvider: React.FC<PomodoroProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    pomodoroReducer,
    initialState,
    (fallback) => {
      try {
        const savedState = localStorage.getItem('pomodoro-state')
        const savedMusicSettings = localStorage.getItem('music-settings')
        const parsedState = savedState
          ? (JSON.parse(savedState) as StoredPomodoroState)
          : null
        const musicSettings = savedMusicSettings
          ? (JSON.parse(savedMusicSettings) as Partial<MusicSettings>)
          : {}
        return {
          ...fallback,
          ...parsedState,
          isRunning: false,
          musicSettings: {
            ...fallback.musicSettings,
            ...parsedState?.musicSettings,
            ...musicSettings,
          },
          cycles: (parsedState?.cycles ?? []).map((cycle) => ({
            ...cycle,
            completedAt: new Date(cycle.completedAt),
          })),
        }
      } catch {
        return fallback
      }
    }
  )

  useEffect(() => {
    const stateToSave = {
      ...state,
      musicSettings: {
        ...state.musicSettings,
      },
    }
    try {
      localStorage.setItem('pomodoro-state', JSON.stringify(stateToSave))
    } catch {
      logger.error('Unable to save timer state on this device')
    }
  }, [state])

  const startTimer = () => dispatch({ type: 'START' })
  const pauseTimer = () => dispatch({ type: 'PAUSE' })
  const resetTimer = () => dispatch({ type: 'RESET' })
  const skipTimer = () => dispatch({ type: 'SWITCH' })
  const setFocusDuration = (minutes: number) =>
    dispatch({ type: 'SET_FOCUS_DURATION', payload: minutes * 60 })
  const setBreakDuration = (minutes: number) =>
    dispatch({ type: 'SET_BREAK_DURATION', payload: minutes * 60 })
  const setMusicSettings = (settings: Partial<MusicSettings>) =>
    dispatch({ type: 'SET_MUSIC_SETTINGS', payload: settings })
  const addMusicTrack = (track: MusicTrack) =>
    dispatch({ type: 'ADD_MUSIC_TRACK', payload: track })
  const removeMusicTrack = (trackId: string) =>
    dispatch({ type: 'REMOVE_MUSIC_TRACK', payload: trackId })
  const setCurrentTrack = (trackId: string) =>
    dispatch({ type: 'SET_CURRENT_TRACK', payload: trackId })
  const nextTrack = () => dispatch({ type: 'NEXT_TRACK' })
  const previousTrack = () => dispatch({ type: 'PREVIOUS_TRACK' })
  const setActiveTask = (task: { taskId: string; taskName: string } | null) =>
    dispatch({ type: 'SET_ACTIVE_TASK', payload: task })

  const value: PomodoroContextType = {
    state,
    dispatch,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    setFocusDuration,
    setBreakDuration,
    setMusicSettings,
    addMusicTrack,
    removeMusicTrack,
    setCurrentTrack,
    nextTrack,
    previousTrack,
    setActiveTask,
  }

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  )
}

export const usePomodoro = () => {
  const context = useContext(PomodoroContext)
  if (!context) {
    throw new Error('usePomodoro must be used within PomodoroProvider')
  }
  return context
}
