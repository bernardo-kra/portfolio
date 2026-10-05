type FeedOptions = {
  url: string
  getToken: () => string | null
  onUnauthorized: () => void
}

// One authenticated connection shared by the inbox and open conversation.
// Tokens stay in the Authorization header, never in URLs or persistent storage.
export function createChatEventFeed(options: FeedOptions) {
  const subscribers = new Set<() => void>()
  let controller: AbortController | undefined
  let retry: ReturnType<typeof setTimeout> | undefined
  let delay = 2000
  const stop = () => {
    clearTimeout(retry)
    retry = undefined
    const previous = controller
    controller = undefined
    previous?.abort()
  }
  const connect = async () => {
    const token = options.getToken()
    if (controller || !subscribers.size || document.hidden || !token) return
    const current = new AbortController()
    controller = current
    let watchdog: ReturnType<typeof setTimeout> | undefined
    const touch = () => {
      clearTimeout(watchdog)
      watchdog = setTimeout(() => current.abort(), 45_000)
    }
    touch()
    try {
      const response = await fetch(options.url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
        signal: current.signal,
        cache: 'no-store',
      })
      if (current.signal.aborted) return
      if (response.status === 401 || response.status === 403) {
        options.onUnauthorized()
        return
      }
      if (
        !response.ok ||
        !response.body ||
        !response.headers.get('content-type')?.includes('text/event-stream')
      )
        throw new Error('CHAT_EVENTS_UNAVAILABLE')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      try {
        while (!current.signal.aborted) {
          const result = await reader.read()
          if (result.done) break
          touch()
          buffer += decoder.decode(result.value, { stream: true })
          buffer = buffer.replace(/\r\n/g, '\n')
          if (buffer.length > 64 * 1024) throw new Error('CHAT_EVENTS_INVALID')
          let boundary: number
          while ((boundary = buffer.indexOf('\n\n')) >= 0) {
            const frame = buffer.slice(0, boundary)
            buffer = buffer.slice(boundary + 2)
            const payload = frame
              .split('\n')
              .filter((line) => line.startsWith('data:'))
              .map((line) => line.slice(5).trim())
              .join('\n')
            if (!payload) continue
            if (
              JSON.parse(payload).type === 'refresh' &&
              !current.signal.aborted
            ) {
              delay = 2000
              for (const callback of subscribers) callback()
            }
          }
        }
      } finally {
        await reader.cancel().catch(() => {})
      }
    } catch {
      // Existing polling remains available during network/provider failures.
    } finally {
      clearTimeout(watchdog)
      if (controller === current) {
        controller = undefined
        if (subscribers.size && !document.hidden && options.getToken()) {
          retry = setTimeout(() => {
            retry = undefined
            void connect()
          }, delay)
          delay = Math.min(delay * 2, 30_000)
        }
      }
    }
  }
  const restart = () => {
    stop()
    delay = 2000
    void connect()
  }
  const visibility = () => {
    if (document.hidden) stop()
    else restart()
  }
  return {
    subscribe(callback: () => void) {
      subscribers.add(callback)
      if (subscribers.size === 1) {
        document.addEventListener('visibilitychange', visibility)
        window.addEventListener('portfolio:auth', restart)
        void connect()
      }
      return () => {
        subscribers.delete(callback)
        if (!subscribers.size) {
          stop()
          document.removeEventListener('visibilitychange', visibility)
          window.removeEventListener('portfolio:auth', restart)
        }
      }
    },
  }
}
