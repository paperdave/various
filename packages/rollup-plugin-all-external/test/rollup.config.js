import external from '../dist/index.js';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'hello.ts',
  output: {
    file: 'hello.js',
    format: 'cjs',
  },
  plugins: [external(), resolve()],
};
