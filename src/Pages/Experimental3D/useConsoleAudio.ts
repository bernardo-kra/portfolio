import { useCallback, useEffect, useRef, useState } from 'react'

export function useConsoleAudio() {
  const context = useRef<AudioContext | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [available, setAvailable] = useState(true)

  useEffect(
    () => () => {
      const audio = context.current
      context.current = null
      if (audio && audio.state !== 'closed') void audio.close().catch(() => {})
    },
    []
  )

  const toggle = async () => {
    if (enabled) {
      setEnabled(false)
      void context.current?.suspend().catch(() => {})
      return
    }
    try {
      if (!context.current || context.current.state === 'closed')
        context.current = new AudioContext()
      await context.current.resume()
      setEnabled(true)
    } catch {
      setAvailable(false)
      setEnabled(false)
    }
  }

  const play = useCallback(
    (kind: 'scan' | 'capture' | 'select') => {
      const audio = context.current
      if (!enabled || !audio || audio.state !== 'running' || document.hidden)
        return
      const oscillator = audio.createOscillator()
      const gain = audio.createGain()
      const now = audio.currentTime
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(
        kind === 'capture' ? 740 : kind === 'scan' ? 320 : 440,
        now
      )
      oscillator.frequency.exponentialRampToValueAtTime(
        kind === 'capture' ? 1100 : 210,
        now + 0.16
      )
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.035, now + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
      oscillator.connect(gain)
      gain.connect(audio.destination)
      oscillator.start(now)
      oscillator.stop(now + 0.2)
      oscillator.onended = () => {
        oscillator.disconnect()
        gain.disconnect()
      }
    },
    [enabled]
  )

  return { enabled, available, toggle, play }
}
