import { useSyncExternalStore } from 'react'

const QUERY = '(hover: none), (pointer: coarse)'

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/**
 * True on touch-first devices, where hover effects never fire. Pointer-driven
 * effects use it to switch to an ambient, self-running mode.
 */
export function useCoarsePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}
