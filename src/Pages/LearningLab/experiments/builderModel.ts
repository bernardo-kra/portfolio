import type { LabArtwork } from './artwork'
import { palettes } from '../interfaceModel.ts'

export type SectionKind = 'hero' | 'story' | 'features' | 'action'
export const defaultSections: SectionKind[] = [
  'hero',
  'story',
  'features',
  'action',
]
export type PageComposition = {
  title: string
  text: string
  action: string
  sections: SectionKind[]
  palette: number
  artwork: LabArtwork
  lang: 'pt' | 'en'
}
export function moveSection(sections: SectionKind[], from: number, to: number) {
  if (
    !Number.isInteger(from) ||
    !Number.isInteger(to) ||
    from < 0 ||
    to < 0 ||
    from >= sections.length ||
    to >= sections.length
  )
    return sections
  const next = [...sections]
  const [section] = next.splice(from, 1)
  next.splice(to, 0, section)
  return next
}
export function escapeHtml(text: string) {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (character) => entities[character])
}
export const pageLabels = {
  pt: {
    tag: 'UMA IDEIA FEITA POR MIM',
    story: 'Todo projeto começa com uma pergunta.',
    features: [
      'Explorar possibilidades',
      'Criar com intenção',
      'Continuar descobrindo',
    ],
    actionTitle: 'A próxima ideia começa aqui.',
    top: 'Voltar ao início',
    footer: 'Criado no laboratório Bastidores de uma interface.',
  },
  en: {
    tag: 'AN IDEA I MADE MYSELF',
    story: 'Every project starts with a question.',
    features: [
      'Explore possibilities',
      'Create with purpose',
      'Keep discovering',
    ],
    actionTitle: 'The next idea starts here.',
    top: 'Back to the top',
    footer: 'Created in the Behind the interface lab.',
  },
}
export function compositionCss(palette: number) {
  const colors = palettes[palette]
  return `.lab-built-page{--paper:${colors.background};--ink:${colors.ink};--accent:${colors.accent};--label:${colors.label};container-type:inline-size;background:var(--paper);color:var(--ink);font:16px/1.7 system-ui,sans-serif;overflow:hidden;border-radius:18px}.lab-built-page *{box-sizing:border-box}.lab-built-page section{padding:clamp(24px,7cqw,48px)}.lab-built-page h1,.lab-built-page h2,.lab-built-page p{margin:0 0 18px;color:var(--ink);font-family:inherit}.lab-built-page h1{font-size:clamp(30px,8cqw,56px);line-height:1.08;overflow-wrap:anywhere}.lab-built-page h2{font-size:clamp(22px,5cqw,34px);line-height:1.2}.lab-built-page .built-art{height:180px;background:${colors.decoration};display:grid;place-items:center;background-size:cover;background-position:center}.lab-built-page .built-icon{width:72px;height:72px;border-radius:16px;image-rendering:pixelated;background:white;border:2px solid var(--ink)}.lab-built-page .built-tag{font-size:11px;font-weight:800;letter-spacing:.1em;margin-bottom:16px}.lab-built-page .built-features{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,140px),1fr));gap:14px}.lab-built-page .built-features div{padding:20px;border:1px solid var(--ink);border-radius:14px;font-weight:700}.lab-built-page .built-action{border-top:1px solid var(--ink)}.lab-built-page .built-link{display:inline-block;background:var(--ink);color:var(--paper);padding:13px 20px;border-radius:40px;font-size:14px;font-weight:700;text-decoration:none}.lab-built-page a:focus-visible{outline:3px solid var(--ink);outline-offset:4px}.lab-built-page footer{padding:24px;font-size:12px;border-top:1px solid var(--ink)}.lab-built-page footer a{color:inherit}`
}
function artworkHtml(artwork: LabArtwork) {
  const background = artwork.background
    ? ` style="background-image:url('${escapeHtml(artwork.background)}')"`
    : ''
  return `<div class="built-art"${background}>${artwork.icon ? `<img class="built-icon" alt="" src="${escapeHtml(artwork.icon)}">` : '<span aria-hidden="true" style="font-size:64px">✳</span>'}</div>`
}
export function buildPage(composition: PageComposition) {
  const t = pageLabels[composition.lang]
  const blocks: Record<SectionKind, string> = {
    hero: `${artworkHtml(composition.artwork)}<section id="built-hero"><p class="built-tag">${t.tag}</p><h1>${escapeHtml(composition.title)}</h1><p>${escapeHtml(composition.text)}</p></section>`,
    story: `<section id="built-story"><h2>${t.story}</h2><p>${escapeHtml(composition.text)}</p></section>`,
    features: `<section id="built-features"><div class="built-features">${t.features.map((feature, index) => `<div>0${index + 1}<br>${feature}</div>`).join('')}</div></section>`,
    action: `<section class="built-action" id="built-action"><h2>${t.actionTitle}</h2><a class="built-link" href="#built-top">${escapeHtml(composition.action)} ↗</a></section>`,
  }
  return `<!doctype html><html lang="${composition.lang === 'pt' ? 'pt-BR' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${escapeHtml(composition.title)}</title><style>body{margin:0;padding:24px;background:#e9e5de}main{max-width:900px;margin:auto}${compositionCss(composition.palette)}</style></head><body><main id="built-top" class="lab-built-page">${composition.sections.map((kind) => blocks[kind]).join('')}<footer>${t.footer} <a href="#built-top">${t.top} ↑</a></footer></main></body></html>`
}
