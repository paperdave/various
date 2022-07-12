const { rules } = require('./rules');
const { markdownOverrides } = require('./markdown');
const { svelteOverrides } = require('./svelte');
const path = require('path');
const fs = require('fs');

// Locate the eslint root and also all typescript configurations.
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

/** @type {string[]} */
const tsConfigs = [];
const hardcodedIgnores = [
  '.git',
  'node_modules',
];

/** @param {string} filepath */
function scanRecursive(filepath) {
  const readdir = fs.readdirSync(filepath).filter(f => !hardcodedIgnores.includes(f));

  const tsConfigPath = ['tsconfig.json', 'jsconfig.json'].find(f => readdir.includes(f));
  if (tsConfigPath) {
    tsConfigs.push(path.join(filepath, tsConfigPath));
  }

  for (const f of readdir) {
    const fullpath = path.join(filepath, f);
    if (fs.statSync(fullpath).isDirectory()) {
      scanRecursive(fullpath);
    }
  }
}
scanRecursive(root);

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

if (tsConfigs.length > 0) {
  // Use TypeScript ESLint
  config.parser = '@typescript-eslint/parser';
  config.parserOptions = {
    sourceType: 'module',
    ecmaVersion: 'latest',
    noEmit: true,
    tsconfigRootDir: root,
    project: tsConfigs,
  };
  // @ts-expect-error: it's already defined above for sure.
  config.plugins.push('@typescript-eslint');
}

module.exports = config;
