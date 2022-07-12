/** @type {import('prettier').Config} */
const config = {
  overrides: [
    {
      files: '*.nowrap.*',
      options: {
        printWidth: 100000,
      }
    }
  ]
};

module.exports = config;
