rm -rf dist
mkdir dist
pnpm esbuild --bundle src/index.ts --platform=node --format=esm --outfile=dist/index.js --external:@dqbd/tiktoken --external:@paperdave/utils
pnpm dts-bundle-generator src/index.ts -o dist/index.d.ts --no-banner
