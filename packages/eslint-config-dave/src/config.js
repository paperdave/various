const { markdownOverrides } = require('./markdown');
const { svelteOverrides } = require('./svelte');
const { rules } = require('./rules');

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  // Use TypeScript ESLint
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint'],

  rules,

  overrides: [...markdownOverrides, ...svelteOverrides],
  // Environments are all disabled because TypeScript handles the undefined variables (literally what a type checker is supposed to do)
  env: {},
};

module.exports = config;
