import React, { useState } from 'react'
import { Typography, Button, Input, Card, Tag } from '@components/common'
import { Plus, Play, SkipForward, SkipBack, Trash2, Music, Shuffle, Repeat, Volume2 } from 'lucide-react'
import { usePomodoro } from '@components/context/PomodoroContext'
import styles from './styles.module.css'

const MusicPlaylist: React.FC = () => {
  const { state, addMusicTrack, removeMusicTrack, setCurrentTrack, nextTrack, previousTrack, setMusicSettings } = usePomodoro()
  const { musicSettings } = state
  const [isAddingTrack, setIsAddingTrack] = useState(false)
  const [newTrackUrl, setNewTrackUrl] = useState('')
  const [isLoadingTitle, setIsLoadingTitle] = useState(false)

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

  const fetchVideoTitle = async (videoId: string): Promise<string> => {
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch video info')
      }
      
      const data = await response.json()
      
      if (data.title) {
        return data.title
      }
    } catch (error) {
      console.warn('Failed to fetch video title:', error)
    }
    
    return `YouTube Video (${videoId})`
  }

  const isValidYouTubeUrl = (url: string): boolean => {
    if (!url.trim()) return false
    const videoId = extractVideoId(url)
    return videoId.length === 11
  }

  const handleAddTrack = async () => {
    if (isValidYouTubeUrl(newTrackUrl)) {
      setIsLoadingTitle(true)
      const videoId = extractVideoId(newTrackUrl)
      
      try {
        const videoTitle = await fetchVideoTitle(videoId)
        const newTrack = {
          id: Date.now().toString(),
          name: videoTitle,
          url: newTrackUrl.trim(),
          isDefault: false
        }
        
        addMusicTrack(newTrack)
        setNewTrackUrl('')
        setIsAddingTrack(false)
      } catch (error) {
        console.error('Error adding track:', error)
        const newTrack = {
          id: Date.now().toString(),
          name: `YouTube Video (${videoId})`,
          url: newTrackUrl.trim(),
          isDefault: false
        }
        
        addMusicTrack(newTrack)
        setNewTrackUrl('')
        setIsAddingTrack(false)
      } finally {
        setIsLoadingTitle(false)
      }
    }
  }

  const handleRemoveTrack = (trackId: string) => {
    removeMusicTrack(trackId)
  }

  const handlePlayTrack = (trackId: string) => {
    setCurrentTrack(trackId)
  }

  const toggleShuffle = () => {
    setMusicSettings({ shuffleMode: !musicSettings.shuffleMode })
  }

  const toggleRepeat = () => {
    const repeatModes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all']
    const currentIndex = repeatModes.indexOf(musicSettings.repeatMode)
    const nextIndex = (currentIndex + 1) % repeatModes.length
    setMusicSettings({ repeatMode: repeatModes[nextIndex] })
  }

  const getRepeatIcon = () => {
    switch (musicSettings.repeatMode) {
      case 'one': return <Repeat size={16} />
      case 'all': return <Repeat size={16} />
      default: return <Repeat size={16} />
    }
  }

  const getRepeatColor = () => {
    switch (musicSettings.repeatMode) {
      case 'one': return 'var(--brand-orange)'
      case 'all': return 'var(--brand-orange)'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <div className={styles.musicPlaylist}>
      <div className={styles.playlistHeader}>
        <div className={styles.playlistTitle}>
          <Music size={20} className={styles.playlistIcon} />
          <Typography variant="h4" weight="semibold">
            Playlist
          </Typography>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddingTrack(!isAddingTrack)}
          icon={<Plus size={16} />}
        >
          Adicionar
        </Button>
      </div>

      {/* Current Track Display */}
      {currentTrack && (
        <Card variant="elevated" className={styles.currentTrackCard}>
          <div className={styles.currentTrackInfo}>
            <div className={styles.trackDetails}>
              <Typography variant="h6" className={styles.trackName}>
                {currentTrack.name}
              </Typography>
            </div>
            
            <div className={styles.trackControls}>
              <Button
                variant="ghost"
                size="sm"
                onClick={previousTrack}
                className={styles.controlButton}
                icon={<SkipBack size={16} />}
              >
                Anterior
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={nextTrack}
                className={styles.controlButton}
                icon={<SkipForward size={16} />}
              >
                Próxima
              </Button>
            </div>
          </div>
          
          <div className={styles.trackSettings}>
            <div className={styles.settingGroup}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleShuffle}
                className={`${styles.settingButton} ${musicSettings.shuffleMode ? styles.active : ''}`}
                icon={<Shuffle size={14} />}
              >
                Shuffle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRepeat}
                className={`${styles.settingButton} ${musicSettings.repeatMode !== 'none' ? styles.active : ''}`}
                icon={getRepeatIcon()}
                style={{ color: getRepeatColor() }}
              >
                Repeat
              </Button>
            </div>
            
            <div className={styles.volumeControl}>
              <Volume2 size={14} />
              <Typography variant="caption" color="muted">
                {Math.round(musicSettings.volume * 100)}%
              </Typography>
            </div>
          </div>
        </Card>
      )}

      {/* Add Track Form */}
      {isAddingTrack && (
        <Card variant="outlined" className={styles.addTrackCard}>
          <div className={styles.addTrackForm}>
            <Input
              label="URL do YouTube"
              value={newTrackUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTrackUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={styles.urlInput}
            />
            
            {newTrackUrl && (
              <div className={styles.urlPreview}>
                <Typography variant="caption" color="muted">
                  {isLoadingTitle ? '⏳ Buscando título...' : (isValidYouTubeUrl(newTrackUrl) ? '✅ URL válida' : '❌ URL inválida')}
                </Typography>
              </div>
            )}
            
            <div className={styles.addTrackActions}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingTrack(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddTrack}
                disabled={!isValidYouTubeUrl(newTrackUrl) || isLoadingTitle}
              >
                {isLoadingTitle ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tracks List */}
      <div className={styles.tracksContainer}>
        {musicSettings.tracks.length === 0 ? (
          <div className={styles.emptyPlaylist}>
            <Music size={48} className={styles.emptyIcon} />
            <Typography variant="body1" color="muted">
              Nenhuma música adicionada
            </Typography>
            <Typography variant="body2" color="muted">
              Adicione músicas do YouTube para criar sua playlist
            </Typography>
          </div>
        ) : (
          musicSettings.tracks.map(track => (
            <Card
              key={track.id}
              variant="default"
              className={`${styles.trackCard} ${track.id === musicSettings.currentTrackId ? styles.activeTrack : ''}`}
            >
              <div className={styles.trackContent}>
                <div className={styles.trackInfo}>
                  <div className={styles.trackNameRow}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlayTrack(track.id)}
                      className={styles.playTrackButton}
                      icon={<Play size={16} />}
                    >
                      Selecionar
                    </Button>
                    
                    <div className={styles.trackDetails}>
                      <Typography variant="h6" className={styles.trackName}>
                        {track.name}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className={styles.trackActions}>
                    {track.id === musicSettings.currentTrackId && (
                      <Tag variant="brand" size="sm">
                        Atual
                      </Tag>
                    )}
                    
                    {track.isDefault && (
                      <Tag variant="default" size="sm">
                        Padrão
                      </Tag>
                    )}
                    
                    {!track.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTrack(track.id)}
                        className={styles.removeButton}
                        icon={<Trash2 size={16} />}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default MusicPlaylist
