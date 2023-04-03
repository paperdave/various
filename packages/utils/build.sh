rm dist -rf
mkdir dist
pnpm rollup -c
pnpm dts-bundle-generator src/index.ts -o dist/index.d.ts --no-banner || true
