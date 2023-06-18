rm -rf dist
mkdir dist
pnpm esbuild --bundle src/index.ts --platform=node --format=esm --outfile=dist/index.js --external:tiktoken --external:@paperdave/utils --external:zod --external:zod-to-json-schema
pnpm dts-bundle-generator src/index.ts -o dist/index.d.ts --no-banner
