import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore built output and node_modules
  globalIgnores(['dist', 'node_modules']),

  // ── React source files ───────────────────────────────────
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // React 17+ JSX transform — no longer needs React in scope
      'no-unused-vars': ['warn', {
        varsIgnorePattern: '^React$',
        argsIgnorePattern: '^_',
      }],
      // Downgrade setState-in-effect to warning (common async pattern)
      'react-hooks/set-state-in-effect': 'warn',
      // Allow fast-refresh exception for context files
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // ── Selenium / Mocha test files ──────────────────────────
  {
    files: ['selenium-tests/**/*.{js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Mocha globals
        describe:  'readonly',
        it:        'readonly',
        before:    'readonly',
        after:     'readonly',
        beforeEach:'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },

  // ── Node / backend scripts ───────────────────────────────
  {
    files: ['automated_test/**/*.js', 'backend/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
])
