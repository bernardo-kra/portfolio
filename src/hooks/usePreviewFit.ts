import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

type PreviewFit = 'cover' | 'contain'
type PreviewPosition = 'center' | 'center top'

interface PreviewFitResult {
  fit: PreviewFit
  position: PreviewPosition
}

const TALL_RATIO = 1.35
const WIDE_RATIO = 0.7
const SMALL_RATIO = 0.9

export const usePreviewFit = (
  imageUrl: string | undefined,
  containerRef: RefObject<HTMLElement>
): PreviewFitResult => {
  const [fit, setFit] = useState<PreviewFit>('contain')
  const [position, setPosition] = useState<PreviewPosition>('center top')

  useEffect(() => {
    const container = containerRef.current
    if (!imageUrl || !container) return

    let isMounted = true
    const img = new Image()

    const computeFit = () => {
      if (!isMounted || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const aspectRatio = img.naturalHeight / img.naturalWidth
      const isTall = aspectRatio > TALL_RATIO
      const isWide = aspectRatio < WIDE_RATIO
      const isSmall =
        img.naturalWidth < rect.width * SMALL_RATIO ||
        img.naturalHeight < rect.height * SMALL_RATIO

      if (isTall || isWide || isSmall) {
        setFit('contain')
        setPosition(isWide ? 'center' : 'center top')
      } else {
        setFit('cover')
        setPosition('center')
      }
    }

    img.onload = computeFit
    img.src = imageUrl

    if (img.complete) {
      computeFit()
    }

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => computeFit())
      resizeObserver.observe(container)
    }

    return () => {
      isMounted = false
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [imageUrl, containerRef])

  return { fit, position }
}
