import { createHash } from 'node:crypto'

export function secureEntryHtml(html: string, backendUrl: string) {
  const backendOrigin = new URL(backendUrl).origin
  const hashes = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter((match) => !/\bsrc\s*=/.test(match[1]))
    .map((match) => `'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`)
  const policy = [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "form-action 'self'",
    `script-src 'self' ${hashes.join(' ')} https://accounts.google.com/gsi/client https://www.googletagmanager.com/gtag/js`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com/gsi/style",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "media-src 'self' blob:",
    `connect-src 'self' ${backendOrigin} https://accounts.google.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.youtube.com`,
    "frame-src https://accounts.google.com https://www.youtube.com",
  ].join('; ')
  return html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />\n    <meta name="referrer" content="strict-origin-when-cross-origin" />`)
}
