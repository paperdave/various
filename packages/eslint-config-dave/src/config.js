const { markdownOverrides } = require('./markdown');
const { svelteOverrides } = require('./svelte');
const { rules } = require('./rules');
const path = require('path');
const fs = require('fs');

let root = process.cwd();
/** @type {any[]} */
let contents = [];
const configIndex = process.argv.indexOf('--config') || process.argv.indexOf('-c');
if (configIndex > -1) {
  root = path.dirname(process.argv[configIndex + 1]);
} else {
  const confRegex = /.eslintrc(.js)?$/;
  let current = null;
  while (current !== root) {
    contents = fs.readdirSync(root);
    if (contents.some(c => confRegex.test(c))) {
      break;
    }
    if (contents.includes('package.json')) {
      const json = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
      if (json.eslintConfig) {
        break;
      }
    }
    current = root;
    root = path.dirname(root);
  }
  if (current === root) {
    throw new Error('Could not find eslint configuration');
  }
}

const tsConfigPath = ['tsconfig.json', 'jsconfig.json'].find(f => contents.includes(f));

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  rules,
  plugins: [],
  overrides: [...markdownOverrides, ...svelteOverrides],
  // Environments are all disabled because TypeScript handles the undefined
  // variables (literally what a type checker is supposed to do)
  env: {},
};

if (tsConfigPath) {
  // Use TypeScript ESLint
  config.parser = '@typescript-eslint/parser';
  config.parserOptions = {
    sourceType: 'module',
    ecmaVersion: 'latest',
    noEmit: true,
    tsconfigRootDir: root,
    project: [tsConfigPath],
  };
  // @ts-expect-error: it's already defined above for sure.
  config.plugins.push('@typescript-eslint');
}

module.exports = config;
