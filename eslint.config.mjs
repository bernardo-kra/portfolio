// Fast tier adapted from vibe-coding-toolkit/templates/eslint.
// Type-aware checks belong to eslint.typed.config.mjs, not the fast script.
import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import importX from 'eslint-plugin-import-x'
import quality from './eslint-rules/index.cjs'
import { existsSync } from 'node:fs'
import { resolve, sep } from 'node:path'

// Vite resolves absolute asset imports against public/. Check the file rather
// than ignoring absolute imports, so missing assets still fail resolution.
const publicDirectory = resolve(import.meta.dirname, 'public')
const publicAssets = {
  interfaceVersion: 3,
  name: 'vite-public-assets',
  resolve(source) {
    if (!source.startsWith('/')) return { found: false }
    const path = resolve(publicDirectory, source.slice(1))
    return path.startsWith(publicDirectory + sep) && existsSync(path)
      ? { found: true, path }
      : { found: false }
  },
}

const sources = [
  'src/**/*.{js,jsx,ts,tsx,mjs,cjs}',
  'backend/src/**/*.ts',
  'api/**/*.js',
]
const tests = [
  'tests/**/*.{js,mjs,cjs,ts,tsx}',
  '**/*.{test,spec}.{js,mjs,cjs,ts,tsx}',
  '**/{__tests__,__mocks__,fixtures,mocks}/**/*.{js,mjs,cjs,ts,tsx}',
]

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/*.tsbuildinfo',
    'src/generated/**',
  ]),
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2022, globals: globals.node },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: { globals: globals.browser },
  },
  {
    files: sources,
    plugins: { 'import-x': importX, 'import-x-debt': importX },
    settings: {
      'import-x/resolver-next': [
        publicAssets,
        createTypeScriptImportResolver({
          // These independently built applications deliberately use three configs.
          noWarnOnMultipleProjects: true,
          project: [
            './tsconfig.app.json',
            './tsconfig.node.json',
            './backend/tsconfig.json',
          ],
        }),
      ],
    },
    rules: {
      'import-x/no-unresolved': 'warn', // Baseline: 2 missing CSS modules.
      'import-x/no-duplicates': 'error', // Baseline: 0.
      'import-x/no-restricted-paths': [
        'error', // Baseline: 0 frontend-to-backend imports.
        {
          zones: [
            {
              target: [
                './src/Pages/**/*',
                './src/components/**/*',
                './src/main.tsx',
              ],
              from: './backend/src/**/*',
            },
          ],
        },
      ],
      'import-x-debt/no-restricted-paths': [
        'error', // Baseline: 6; migrated to repositories.
        {
          zones: [
            {
              target: ['./backend/src/routes/**/*', './api/**/*'],
              from: './backend/src/config/firebase.ts',
            },
          ],
        },
      ],
    },
  },
  {
    files: sources,
    plugins: { quality },
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-var': 'error',
      'prefer-const': 'error',
      complexity: ['warn', 12], // Baseline: 42.
      'max-depth': ['warn', 4], // Baseline: 4.
      'max-statements': ['warn', 20], // Baseline: 37.
      'max-params': ['warn', 4], // Baseline: 2.
      'max-lines-per-function': [
        'warn', // Baseline: 24.
        { max: 150, skipBlankLines: true, skipComments: true },
      ],
      'max-nested-callbacks': ['warn', 3], // Baseline: 1.
      'quality/max-lines': ['warn', { max: 350 }], // Baseline: 8 including tests.
      'quality/no-direct-console': [
        'warn', // Baseline: 39.
        { logger: 'a dedicated logger adapter (none exists yet)' },
      ],
      'quality/no-direct-data-access': [
        'error', // Baseline: 6; migrated to repositories.
        {
          modules: [
            '../config/firebase.js',
            '../config/firebase',
            '../../config/firebase.js',
            '../../config/firebase',
            '@src/config/firebase',
            '../backend/src/config/firebase.js',
          ],
          bindings: ['db'],
          layers: [
            '/src/Pages/',
            '/src/components/',
            '/backend/src/routes/',
            '/api/',
          ],
          extensions: ['.tsx'],
        },
      ],
    },
  },
  {
    files: tests,
    plugins: { quality },
    languageOptions: {
      globals: { ...globals.node, window: 'writable', document: 'writable' },
    },
    rules: { 'quality/max-lines': ['warn', { max: 350, includeTests: true }] },
  },
  {
    files: ['eslint-rules/**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },
  {
    // This is the actual console adapter, not an exception for callers.
    files: ['backend/src/services/logger.ts'],
    rules: { 'quality/no-direct-console': 'off' },
  },
  // Remaining pre-existing exceptions are preserved without expanding scope.
  {
    files: [
      'src/context/**/*.tsx',
      'src/i18n/index.tsx',
      'src/components/theme/*Context/**/*.tsx',
    ],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: [
      'src/context/PomodoroContext.tsx',
      'src/components/pomodoro/TimerControls/index.tsx',
    ],
    rules: { 'no-case-declarations': 'off' },
  },
])
