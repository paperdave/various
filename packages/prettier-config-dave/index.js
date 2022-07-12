/// <reference types="./ambient" />

/* Prettier doesnt have any types */

const extraPlugins = [
  require.resolve('@mattinton/prettier-plugin-tidy-imports'),
  require.resolve('prettier-plugin-packagejson'),
  require.resolve('prettier-plugin-css-grid'),
];

/** @type {import('prettier').Config} */
let config = {
  overrides: [],
  plugins: extraPlugins,
};

/** @type {any[]} */
const configs = [
  //
  require('./src/base'),
  require('./src/jsdoc'),
  require('./src/markdown'),
  require('./src/svelte'),
  require('./src/nowrap'),
];

for (const file of configs) {
  config = {
    ...config,
    ...file,
    overrides: mergeArrays(config.overrides, file.overrides),
    plugins: mergeArrays(config.plugins, file.plugins),
  };
}

/** @param {any[]} arrays */
function mergeArrays(...arrays) {
  return [].concat(...arrays.filter(x => x && x.length));
}

module.exports = config;
