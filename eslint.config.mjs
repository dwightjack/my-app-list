import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  eslint.configs.recommended,
  {
    files: ['src/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ko: true,
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
  },
  prettier,
  {
    files: ['netlify_functions/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
  },
  { ignores: ['.netlify'] },
];
