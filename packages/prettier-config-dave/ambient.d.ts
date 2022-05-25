/**
 * We have to use commonjs and `require.resolve` for this package, but I do not want to install node
 * types just for this one feature.
 */
declare const require: {
  resolve(x: string): string;
  (x: string): string;
};
