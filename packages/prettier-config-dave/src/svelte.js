const config = {
  plugins: [require.resolve('prettier-plugin-svelte')],
  overrides: [
    {
      files: '*.svelte',
      options: {
        htmlWhitespaceSensitivity: 'ignore',
      },
    },
  ],
};

module.exports = config;
