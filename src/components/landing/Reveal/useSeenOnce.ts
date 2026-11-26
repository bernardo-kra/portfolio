import { useEffect, useRef, useState } from 'react'

/** Marca o elemento como visto na primeira vez que ele entra na tela. */
export function useSeenOnce<T extends HTMLElement>(
  rootMargin = '0px 0px -12% 0px'
) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setSeen(true)
        observer.disconnect()
      },
      { rootMargin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, seen] as const
}
