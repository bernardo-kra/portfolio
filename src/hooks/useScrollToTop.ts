import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useScrollToTop = () => {
  const { pathname, hash, key } = useLocation()

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  useLayoutEffect(() => {
    let anchor = hash.slice(1)
    try {
      anchor = decodeURIComponent(anchor)
    } catch {
      anchor = hash.slice(1)
    }
    const target = anchor ? document.getElementById(anchor) : null
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash, key])
}
