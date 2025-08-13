import React, { useState, useEffect, useRef } from 'react'
import { Button, Typography } from '@components/common'
import { Volume2, Music, ExternalLink, Settings, Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { usePomodoro } from '@components/context/PomodoroContext'
import MusicSettings from '../MusicSettings'
import styles from './styles.module.css'

const LofiPlayer: React.FC = () => {
  const { state } = usePomodoro()
  const [showSettings, setShowSettings] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { musicSettings } = state
  
  const currentTrack = musicSettings.tracks.find(track => track.id === musicSettings.currentTrackId)

  const extractVideoId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    
    return ''
  }

  const getEmbedUrl = (url: string): string => {
    const videoId = extractVideoId(url)
    if (!videoId) return ''
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0&loop=1&playlist=${videoId}&enablejsapi=1&origin=${window.location.origin}&widget_referrer=${window.location.origin}&movie_player=1`
  }

  const isValidYouTubeUrl = (url: string): boolean => {
    if (!url.trim()) return false
    const videoId = extractVideoId(url)
    return videoId.length === 11
  }

  useEffect(() => {
    if (!musicSettings.isEnabled || !iframeRef.current || !currentTrack || !isValidYouTubeUrl(currentTrack.url)) return

    const sendCommand = (command: string) => {
      try {
        iframeRef.current?.contentWindow?.postMessage(command, '*')
      } catch (error) {
        console.warn('Failed to send command to YouTube iframe:', error)
      }
    }

    if (state.isRunning && state.mode === 'focus') {
      if (musicSettings.autoPlayOnTimerStart) {
        sendCommand('{"event":"command","func":"playVideo","args":""}')
        setIsPlaying(true)
      }
    } else {
      if (musicSettings.autoStopOnTimerEnd) {
        sendCommand('{"event":"command","func":"pauseVideo","args":""}')
        setIsPlaying(false)
      }
    }
  }, [state.isRunning, state.mode, musicSettings.isEnabled, musicSettings.autoPlayOnTimerStart, musicSettings.autoStopOnTimerEnd, currentTrack])

  useEffect(() => {
    if (!musicSettings.syncManualControls || !musicSettings.isEnabled) return

    if (state.isRunning) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }, [state.isRunning, musicSettings.syncManualControls, musicSettings.isEnabled])

  const togglePlayPause = () => {
    if (!iframeRef.current || !currentTrack || !isValidYouTubeUrl(currentTrack.url)) return

    const sendCommand = (command: string) => {
      try {
        iframeRef.current?.contentWindow?.postMessage(command, '*')
      } catch (error) {
        console.warn('Failed to send command to YouTube iframe:', error)
      }
    }

    if (isPlaying) {
      sendCommand('{"event":"command","func":"pauseVideo","args":""}')
      setIsPlaying(false)
    } else {
      sendCommand('{"event":"command","func":"playVideo","args":""}')
      setIsPlaying(true)
    }
  }

  const openYouTube = () => {
    if (currentTrack) {
      window.open(currentTrack.url, '_blank')
    }
  }

  if (!musicSettings.isEnabled) {
    return (
      <div className={styles.lofiPlayer}>
        <div className={styles.playerHeader}>
          <div className={styles.playerTitle}>
            <Music size={16} className={styles.musicIcon} />
            <Typography variant="body2" weight="semibold">
              Música
            </Typography>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            icon={<Settings size={14} />}
          >
            Config
          </Button>
        </div>
        {showSettings && <MusicSettings />}
      </div>
    )
  }

  return (
    <div className={styles.lofiPlayer}>
      <div className={styles.playerHeader}>
        <div className={styles.playerTitle}>
          <Music size={16} className={styles.musicIcon} />
          <Typography variant="body2" weight="semibold">
            Música
          </Typography>
        </div>
        <div className={styles.playerActions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={openYouTube}
            className={styles.youtubeButton}
            icon={<ExternalLink size={14} />}
          >
            YouTube
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            icon={<Settings size={14} />}
          >
            Config
          </Button>
        </div>
      </div>

      {showSettings && <MusicSettings />}

      {/* Compact Player */}
      {currentTrack && isValidYouTubeUrl(currentTrack.url) && (
        <div className={styles.compactPlayer}>
          <div className={styles.playerControls}>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              className={styles.playButton}
              icon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
            >
              {isPlaying ? 'Pausar' : 'Tocar'}
            </Button>
            
            <div className={styles.trackInfo}>
              <Typography variant="body2" weight="semibold">
                {currentTrack.name}
              </Typography>
              {musicSettings.syncManualControls && (
                <Typography variant="caption" color="muted">
                  Sincronizado com timer
                </Typography>
              )}
            </div>
          </div>
          
          {/* Minimal YouTube Player */}
          <div className={styles.youtubeContainer}>
            <div className={styles.youtubeWrapper}>
              <iframe
                ref={iframeRef}
                src={getEmbedUrl(currentTrack.url)}
                title="Background Music"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.youtubeIframe}
              />
            </div>
          </div>
        </div>
      )}

      {/* Warning when URL is invalid */}
      {musicSettings.isEnabled && currentTrack && !isValidYouTubeUrl(currentTrack.url) && (
        <div className={styles.urlWarning}>
          <Typography variant="body2" color="error" align="center">
            ⚠️ URL do YouTube inválida
          </Typography>
        </div>
      )}
    </div>
  )
}

export default LofiPlayer
