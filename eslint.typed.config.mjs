// Type-aware lint tier, deliberately kept OUT of eslint.config.mjs. Turning
// on projectService means ESLint builds a full TypeScript program, which on
// a large codebase is slow enough to break a pre-commit hook and heavy
// enough to exhaust the heap on a small CI runner.
//
// Two config files and two npm scripts (`lint` and `lint:types`), rather
// than one config branching on process.env.CI: branching makes local and CI
// behavior diverge silently for identical code, and reading process.env
// inside a flat config file trips that config's own no-undef rule.
import defaultConfig from './eslint.config.mjs'

export default [
  ...defaultConfig,
  {
    files: ['src/**/*.{ts,tsx}', 'backend/src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Measured on 2026-10-06. Promote remaining warnings after refactoring.
      '@typescript-eslint/no-floating-promises': 'warn', // Baseline: 8.
      '@typescript-eslint/no-misused-promises': 'warn', // Baseline: 16.
      '@typescript-eslint/no-unsafe-assignment': 'warn', // Baseline: 77.
      '@typescript-eslint/no-unsafe-member-access': 'warn', // Baseline: 590.
      '@typescript-eslint/no-unsafe-call': 'warn', // Baseline: 24.
      '@typescript-eslint/no-unsafe-return': 'warn', // Baseline: 2.
      '@typescript-eslint/no-unsafe-argument': 'warn', // Baseline: 188.
      '@typescript-eslint/only-throw-error': 'error', // Baseline: 0.
      '@typescript-eslint/return-await': ['error', 'in-try-catch'], // Baseline: 0.
      '@typescript-eslint/await-thenable': 'error', // Baseline: 0.
      '@typescript-eslint/unbound-method': 'error', // Baseline: 0.
      '@typescript-eslint/restrict-template-expressions': 'warn', // Baseline: 2.
      '@typescript-eslint/restrict-plus-operands': 'error', // Baseline: 0.
      '@typescript-eslint/require-await': 'error', // Baseline: 0.
    },
  },
]
