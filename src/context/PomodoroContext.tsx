import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'

export type PomodoroMode = 'focus' | 'break'

interface PomodoroCycle {
  id: string
  mode: PomodoroMode
  completedAt: Date
  duration: number
  taskId?: string
  taskName?: string
}

interface MusicTrack {
  id: string
  name: string
  url: string
  artist?: string
  duration?: string
  thumbnail?: string
  isDefault?: boolean
}

interface MusicSettings {
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

interface PomodoroState {
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

type PomodoroAction =
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
  | { type: 'SET_ACTIVE_TASK'; payload: { taskId: string; taskName: string } | null }
  | { type: 'LOAD_STATE'; payload: PomodoroState }

const initialState: PomodoroState = {
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
        isDefault: true
      }
    ],
    currentTrackId: 'default',
    autoStopOnTimerEnd: true,
    autoPlayOnTimerStart: true,
    syncManualControls: true,
    changeMusicOnTimerEnd: false,
    backgroundMode: false,
    volume: 0.3,
    shuffleMode: false,
    repeatMode: 'none'
  }
}

function pomodoroReducer(state: PomodoroState, action: PomodoroAction): PomodoroState {
  switch (action.type) {
    case 'START':
      return { ...state, isRunning: true }
    
    case 'PAUSE':
      return { ...state, isRunning: false }
    
    case 'RESET':
      return {
        ...state,
        timeLeft: state.mode === 'focus' ? state.focusDuration : state.breakDuration,
        isRunning: false
      }
    
    case 'TICK':
      if (state.timeLeft <= 0) {
        return state
      }
      return { ...state, timeLeft: state.timeLeft - 1 }
    
    case 'SWITCH':
      const newMode: PomodoroMode = state.mode === 'focus' ? 'break' : 'focus'
      const newTimeLeft = newMode === 'focus' ? state.focusDuration : state.breakDuration
      
      const newCycle: PomodoroCycle | null = state.timeLeft === 0 ? {
        id: Date.now().toString(),
        mode: state.mode,
        completedAt: new Date(),
        duration: state.mode === 'focus' ? state.focusDuration : state.breakDuration,
        taskId: state.activeTaskId,
        taskName: state.activeTaskName
      } : null
      
      return {
        ...state,
        mode: newMode,
        timeLeft: newTimeLeft,
        isRunning: false,
        cycles: newCycle ? [newCycle, ...state.cycles] : state.cycles
      }
    
    case 'SET_FOCUS_DURATION':
      return {
        ...state,
        focusDuration: action.payload,
        timeLeft: state.mode === 'focus' ? action.payload : state.timeLeft
      }
    
    case 'SET_BREAK_DURATION':
      return {
        ...state,
        breakDuration: action.payload,
        timeLeft: state.mode === 'break' ? action.payload : state.timeLeft
      }
    
          case 'SET_MUSIC_SETTINGS':
        return {
          ...state,
          musicSettings: {
            ...state.musicSettings,
            ...action.payload
          }
        }
      
      case 'ADD_MUSIC_TRACK':
        return {
          ...state,
          musicSettings: {
            ...state.musicSettings,
            tracks: [...state.musicSettings.tracks, action.payload]
          }
        }
      
      case 'REMOVE_MUSIC_TRACK':
        const updatedTracks = state.musicSettings.tracks.filter(track => track.id !== action.payload)
        const newCurrentTrackId = state.musicSettings.currentTrackId === action.payload 
          ? (updatedTracks[0]?.id || 'default')
          : state.musicSettings.currentTrackId
        return {
          ...state,
          musicSettings: {
            ...state.musicSettings,
            tracks: updatedTracks,
            currentTrackId: newCurrentTrackId
          }
        }
      
      case 'SET_CURRENT_TRACK':
        return {
          ...state,
          musicSettings: {
            ...state.musicSettings,
            currentTrackId: action.payload
          }
        }
      
      case 'NEXT_TRACK':
        const currentIndex = state.musicSettings.tracks.findIndex(track => track.id === state.musicSettings.currentTrackId)
        let nextIndex: number
        
        if (state.musicSettings.shuffleMode) {
          const availableTracks = state.musicSettings.tracks.filter(track => track.id !== state.musicSettings.currentTrackId)
          if (availableTracks.length > 0) {
            const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)]
            nextIndex = state.musicSettings.tracks.findIndex(track => track.id === randomTrack.id)
          } else {
            nextIndex = currentIndex
          }
        } else {
          nextIndex = currentIndex === -1 || currentIndex === state.musicSettings.tracks.length - 1 ? 0 : currentIndex + 1
        }
        
        if (state.musicSettings.repeatMode === 'one') {
          nextIndex = currentIndex
        } else if (state.musicSettings.repeatMode === 'all' && nextIndex === 0 && currentIndex === state.musicSettings.tracks.length - 1) {
          nextIndex = 0
        }
        
        return {
          ...state,
          musicSettings: {
            ...state.musicSettings,
            currentTrackId: state.musicSettings.tracks[nextIndex]?.id || 'default'
          }
        }
      
      case 'PREVIOUS_TRACK':
        const prevCurrentIndex = state.musicSettings.tracks.findIndex(track => track.id === state.musicSettings.currentTrackId)
        let prevIndex: number
        
        if (state.musicSettings.shuffleMode) {
          const availableTracks = state.musicSettings.tracks.filter(track => track.id !== state.musicSettings.currentTrackId)
          if (availableTracks.length > 0) {
            const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)]
            prevIndex = state.musicSettings.tracks.findIndex(track => track.id === randomTrack.id)
          } else {
            prevIndex = prevCurrentIndex
          }
        } else {
          prevIndex = prevCurrentIndex <= 0 ? state.musicSettings.tracks.length - 1 : prevCurrentIndex - 1
        }
        
        if (state.musicSettings.repeatMode === 'one') {
          prevIndex = prevCurrentIndex
        } else if (state.musicSettings.repeatMode === 'all' && prevIndex === state.musicSettings.tracks.length - 1 && prevCurrentIndex === 0) {
          prevIndex = state.musicSettings.tracks.length - 1
        }
        
        return {
          ...state,
          musicSettings: {
            ...state.musicSettings,
            currentTrackId: state.musicSettings.tracks[prevIndex]?.id || 'default'
          }
        }
      
      case 'SET_ACTIVE_TASK':
        return {
          ...state,
          activeTaskId: action.payload?.taskId,
          activeTaskName: action.payload?.taskName
        }
      
      case 'LOAD_STATE':
        return action.payload
    
    default:
      return state
  }
}

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

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

interface PomodoroProviderProps {
  children: ReactNode
}

export const PomodoroProvider: React.FC<PomodoroProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(pomodoroReducer, initialState)

  useEffect(() => {
    const savedState = localStorage.getItem('pomodoro-state')
    const savedMusicSettings = localStorage.getItem('music-settings')
    
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        const cyclesWithDates = parsedState.cycles.map((cycle: any) => ({
          ...cycle,
          completedAt: new Date(cycle.completedAt)
        }))
        
        if (savedMusicSettings) {
          try {
            const parsedMusicSettings = JSON.parse(savedMusicSettings)
            parsedState.musicSettings = {
              ...parsedState.musicSettings,
              ...parsedMusicSettings
            }
          } catch (error) {
            console.error('Error loading music settings:', error)
          }
        }
        
        dispatch({ type: 'LOAD_STATE', payload: { ...parsedState, cycles: cyclesWithDates } })
      } catch (error) {
        console.error('Error loading pomodoro state:', error)
      }
    }
  }, [])

  useEffect(() => {
    const stateToSave = {
      ...state,
      musicSettings: {
        ...state.musicSettings
      }
    }
    localStorage.setItem('pomodoro-state', JSON.stringify(stateToSave))
  }, [state])

  const startTimer = () => dispatch({ type: 'START' })
  const pauseTimer = () => dispatch({ type: 'PAUSE' })
  const resetTimer = () => dispatch({ type: 'RESET' })
  const skipTimer = () => dispatch({ type: 'SWITCH' })
  const setFocusDuration = (minutes: number) => dispatch({ type: 'SET_FOCUS_DURATION', payload: minutes * 60 })
  const setBreakDuration = (minutes: number) => dispatch({ type: 'SET_BREAK_DURATION', payload: minutes * 60 })
  const setMusicSettings = (settings: Partial<MusicSettings>) => dispatch({ type: 'SET_MUSIC_SETTINGS', payload: settings })
  const addMusicTrack = (track: MusicTrack) => dispatch({ type: 'ADD_MUSIC_TRACK', payload: track })
  const removeMusicTrack = (trackId: string) => dispatch({ type: 'REMOVE_MUSIC_TRACK', payload: trackId })
  const setCurrentTrack = (trackId: string) => dispatch({ type: 'SET_CURRENT_TRACK', payload: trackId })
  const nextTrack = () => dispatch({ type: 'NEXT_TRACK' })
  const previousTrack = () => dispatch({ type: 'PREVIOUS_TRACK' })
  const setActiveTask = (task: { taskId: string; taskName: string } | null) => dispatch({ type: 'SET_ACTIVE_TASK', payload: task })

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
    setActiveTask
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
