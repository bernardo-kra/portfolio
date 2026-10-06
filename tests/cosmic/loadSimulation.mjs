import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const entry = fileURLToPath(
  new URL(
    '../../src/components/generative/PatternCanvas/InfiniteGenerator.ts',
    import.meta.url
  )
)
const cache = new Map()

export function compileSource(
  source,
  filename,
  requireLocal = () => {
    throw new Error('Unexpected reference import')
  }
) {
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText
  const exports = {}
  new Function('exports', 'require', compiled)(exports, requireLocal)
  return exports
}

function loadFile(filename) {
  if (cache.has(filename)) return cache.get(filename)
  const exports = compileSource(
    fs.readFileSync(filename, 'utf8'),
    filename,
    (specifier) => {
      const resolved = path.resolve(path.dirname(filename), specifier + '.ts')
      return loadFile(resolved)
    }
  )
  cache.set(filename, exports)
  return exports
}

export const { InfiniteGenerator } = loadFile(entry)
