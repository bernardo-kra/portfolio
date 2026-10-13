export const palettes = [
  {
    background: '#fff5ce',
    accent: '#d93328',
    ink: '#201b28',
    label: '#ffffff',
    decoration: '#ffce08',
  },
  {
    background: '#e8f6fa',
    accent: '#155e75',
    ink: '#123342',
    label: '#ffffff',
    decoration: '#79c9d3',
  },
  {
    background: '#f0e9e1',
    accent: '#be7253',
    ink: '#362a28',
    label: '#ffffff',
    decoration: '#d7b8a3',
  },
]
export const fonts = [
  "'Learning Display', Impact, sans-serif",
  "'Learning Sans', sans-serif",
  "Georgia, 'Times New Roman', serif",
]
export const radii = [0, 20, 60]
export const spaces = [20, 36]
export type InterfaceSettings = {
  palette: number
  font: number
  shape: number
  density: number
  wireframe: boolean
}
export const defaultSettings: InterfaceSettings = {
  palette: 0,
  font: 0,
  shape: 1,
  density: 1,
  wireframe: false,
}

function luminance(hex: string) {
  const channels = [1, 3, 5].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}
export function contrastRatio(first: string, second: string) {
  const a = luminance(first)
  const b = luminance(second)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}
export function interfaceVariables(settings: InterfaceSettings) {
  const palette = palettes[settings.palette]
  return {
    '--preview-background': palette.background,
    '--preview-accent': palette.accent,
    '--preview-ink': palette.ink,
    '--preview-label': palette.label,
    '--preview-decoration': palette.decoration,
    '--preview-font': fonts[settings.font],
    '--preview-radius': `${radii[settings.shape]}px`,
    '--preview-space': `${spaces[settings.density]}px`,
  }
}
export function interfaceCss(settings: InterfaceSettings) {
  const declarations = Object.entries(interfaceVariables(settings))
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')
  return `.interface-preview {\n${declarations}\n}\n`
}
export function downloadInterfaceCss(settings: InterfaceSettings) {
  const url = URL.createObjectURL(
    new Blob([interfaceCss(settings)], { type: 'text/css' })
  )
  const link = document.createElement('a')
  link.href = url
  link.download = 'interface.css'
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
