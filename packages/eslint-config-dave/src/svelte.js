// This file adds svelte support via overrides to the configuration.

/** @type {import('eslint').Linter.ConfigOverride[]} */
const svelteOverrides = [
  {
    files: ['**/*.svelte'],
    plugins: ['svelte3'],
    processor: 'svelte3/svelte3',
    settings: {
      'svelte3/typescript': () => require('typescript'),
    },
  },
];

module.exports = { svelteOverrides };
