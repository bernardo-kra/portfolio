type GoogleClient = {
  initialize: (options: {
    client_id: string
    nonce: string
    auto_select: boolean
    callback: (response: { credential: string }) => void
  }) => void
  renderButton: (
    element: HTMLElement,
    options: {
      theme: string
      size: string
      text: string
      locale: string
      width: number
    }
  ) => void
  cancel: () => void
}
declare global {
  interface Window {
    google?: { accounts: { id: GoogleClient } }
  }
}
let loader: Promise<GoogleClient> | undefined
export function loadGoogleSignIn() {
  if (window.google?.accounts.id)
    return Promise.resolve(window.google.accounts.id)
  if (loader) return loader
  loader = new Promise<GoogleClient>((resolve, reject) => {
    const script = document.createElement('script')
    const timeout = window.setTimeout(() => fail(), 15000)
    const fail = () => {
      clearTimeout(timeout)
      script.remove()
      loader = undefined
      reject(new Error('GOOGLE_UNAVAILABLE'))
    }
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      clearTimeout(timeout)
      if (window.google?.accounts.id) resolve(window.google.accounts.id)
      else fail()
    }
    script.onerror = fail
    document.head.appendChild(script)
  })
  return loader
}
