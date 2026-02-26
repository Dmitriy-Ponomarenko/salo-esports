// eslint.config.js
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{ts,tsx,js,jsx}'],

    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:react-refresh/recommended',
      'plugin:prettier/recommended',
    ],

    parser: '@typescript-eslint/parser',

    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },

    env: {
      browser: true,
      es2021: true,
      node: true,
    },

    plugins: [
      '@typescript-eslint',
      'react',
      'react-hooks',
      'react-refresh',
      'prettier',
    ],

    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
