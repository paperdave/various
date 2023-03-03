rm dist -rf
mkdir dist
pnpm esbuild --bundle src/index.ts --platform=node --format=esm --outfile=dist/index.js
pnpm tsc
pnpm dts-bundle-generator src/index.ts -o dist/index.d.ts --no-banner
