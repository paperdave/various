// This file adds markdown support via overrides to the configuration.
const { rules } = require('./rules');

const markdownExtensions = ['.md', '.markdown'];

/** @type {import('eslint').Linter.ConfigOverride[]} */
const markdownOverrides = [
  {
    files: [`**/*.{${markdownExtensions.join(',')}}`],
    plugins: ['eslint-plugin-markdown'],
    processor: 'markdown/markdown',
  },
  {
    files: [`**/*.{${markdownExtensions.join(',')}}/*.js`],
    // Disable warning rules, as those are meant for production, while markdown code fences illustrate documentation, and using `console` and so on might be desired.
    rules: Object.fromEntries(
      Object.entries(rules)
        .filter(([, v]) => v === 'warn' || (Array.isArray(v) && v[0] === 'warn'))
        .map(([k]) => [k, 'off'])
    ),
  },
];

module.exports = { markdownOverrides };
