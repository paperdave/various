/// <reference types="./ambient" />

// Prettier doesnt

/** @type {any} */
let config = {
  overrides: [],
  plugins: [],
};

/** @type {any[]} */
const configs = [
  //
  require('./src/base'),
  require('./src/svelte'),
  require('./src/markdown'),
  require('./src/jsdoc'),
  require('./src/organise-imports'),
];

for (const file of configs) {
  config = {
    ...config,
    ...file,
    overrides: [...config.overrides, ...(file.overrides ?? [])],
    plugins: [...config.plugins, ...(file.plugins ?? [])],
  };
}

module.exports = config;
