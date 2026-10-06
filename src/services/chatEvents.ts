function isUnauthorized(response: Response) {
  return response.status === 401 || response.status === 403
}

function streamWatchdog(current: AbortController) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return {
    touch: () => {
      clearTimeout(timer)
      timer = setTimeout(() => current.abort(), 45_000)
    },
    stop: () => clearTimeout(timer),
  }
}

function isStreamResponse(
  response: Response
): response is Response & { body: ReadableStream<Uint8Array> } {
  return (
    response.ok &&
    !!response.body &&
    !!response.headers.get('content-type')?.includes('text/event-stream')
  )
}

function drainChatFrames(
  buffer: string,
  current: AbortController,
  refresh: () => void
) {
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
      (JSON.parse(payload) as { type?: string }).type === 'refresh' &&
      !current.signal.aborted
    ) {
      refresh()
    }
  }
  return buffer
}

async function consumeChatStream(
  body: ReadableStream<Uint8Array>,
  current: AbortController,
  touch: () => void,
  refresh: () => void
) {
  const reader = body.getReader()
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
      buffer = drainChatFrames(buffer, current, refresh)
    }
  } finally {
    await reader.cancel().catch(() => {})
  }
}

type FeedOptions = {
  url: string
  getToken: () => string | null
  onUnauthorized: () => void
  keepAliveWhenHidden?: boolean
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
  const shouldConnect = (token: string | null) =>
    !(
      controller ||
      !subscribers.size ||
      (document.hidden && !options.keepAliveWhenHidden) ||
      !token
    )
  const shouldRetry = () =>
    subscribers.size &&
    (!document.hidden || options.keepAliveWhenHidden) &&
    options.getToken()
  const connect = async () => {
    const token = options.getToken()
    if (!shouldConnect(token)) return
    const current = new AbortController()
    controller = current
    const watchdog = streamWatchdog(current)
    watchdog.touch()
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
      if (isUnauthorized(response)) {
        options.onUnauthorized()
        return
      }
      if (!isStreamResponse(response))
        throw new Error('CHAT_EVENTS_UNAVAILABLE')
      await consumeChatStream(response.body, current, watchdog.touch, () => {
        delay = 2000
        for (const callback of subscribers) callback()
      })
    } catch {
      // Existing polling remains available during network/provider failures.
    } finally {
      watchdog.stop()
      if (controller === current) {
        controller = undefined
        if (shouldRetry()) {
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
    if (options.keepAliveWhenHidden) {
      if (!document.hidden) void connect()
    } else if (document.hidden) stop()
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
