import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('SectorMap renders active and paused states without translation props', async (t) => {
  const server = await createServer({
    server: { middlewareMode: true, watch: null, hmr: false },
    appType: 'custom',
    ssr: {
      noExternal: ['react-router-dom', 'react-router'],
      resolve: { conditions: ['module-sync', 'node', 'import'] },
    },
    logLevel: 'error',
  })
  try {
    const { default: SectorMap } = await server.ssrLoadModule(
      '/src/Pages/Experimental3D/components/SectorMap.tsx'
    )
    const { I18nProvider } = await server.ssrLoadModule('/src/i18n/index.tsx')
    for (const motion of [false, true]) {
      for (const selected of ['dock', 'boiler', 'tower']) {
        const markup = renderToStaticMarkup(
          createElement(
            I18nProvider,
            null,
            createElement(SectorMap, {
              selected,
              captured: [],
              operation: null,
              motion,
              quality: 0,
              onSelect() {},
            })
          )
        )
        assert.match(markup, motion ? /Radar ativo/ : /Radar pausado/)
        assert.match(markup, /aria-pressed="true"/)
        assert.doesNotMatch(markup, /undefined/)
      }
    }
    await t.test(
      'complete terminal renders with its map, controls and commands',
      async () => {
        const { default: Experimental3D } = await server.ssrLoadModule(
          '/src/Pages/Experimental3D/index.tsx'
        )
        const { MemoryRouter } = await server.ssrLoadModule('react-router-dom')
        const previousWindow = Object.getOwnPropertyDescriptor(
          globalThis,
          'window'
        )
        const previousDocument = Object.getOwnPropertyDescriptor(
          globalThis,
          'document'
        )
        Object.defineProperty(globalThis, 'window', {
          configurable: true,
          value: { matchMedia: () => ({ matches: false }) },
        })
        Object.defineProperty(globalThis, 'document', {
          configurable: true,
          value: { hidden: false },
        })
        try {
          const markup = renderToStaticMarkup(
            createElement(
              MemoryRouter,
              null,
              createElement(I18nProvider, null, createElement(Experimental3D))
            )
          )
          assert.match(markup, /Operação Maré Negra/)
          assert.match(markup, /neon-command/)
          assert.match(markup, /neon-frequency/)
          assert.doesNotMatch(markup, /undefined|<video|<canvas/)
        } finally {
          if (previousWindow)
            Object.defineProperty(globalThis, 'window', previousWindow)
          else Reflect.deleteProperty(globalThis, 'window')
          if (previousDocument)
            Object.defineProperty(globalThis, 'document', previousDocument)
          else Reflect.deleteProperty(globalThis, 'document')
        }
      }
    )
  } finally {
    await server.close()
  }
})
