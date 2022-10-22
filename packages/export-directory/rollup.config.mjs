import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-all-external';
import shebang from 'rollup-plugin-add-shebang';
import esbuild from 'rollup-plugin-esbuild';

export default [
  {
    input: {
      index: 'src/lib.ts',
      cli: 'src/cli.ts',
    },
    output: [
      {
        dir: 'dist',
        format: 'esm',
      },
    ],
    plugins: [
      resolve(),
      esbuild({
        target: 'esnext',
      }),
      shebang(),
      external(),
    ],
  },
];
