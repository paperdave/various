rm dist -rf
mkdir dist
# pnpm tsc

ESBUILD_OPTS_COMMON="--sourcemap \
  --bundle \
  --minify \
  --target=esnext \
  --external:wrap-ansi \
  --external:@paperdave/utils"

ESBUILD_OPTS_CJS="$ESBUILD_OPTS_COMMON \
  --format=cjs \
  "

ESBUILD_OPTS_ESM="$ESBUILD_OPTS_COMMON \
  --format=esm \
  --external:chalk \
  --external:ansi-escapes"

cp tsconfig.node.json tsconfig.json

pnpm esbuild $ESBUILD_OPTS_ESM \
  --platform=node \
  src/index.ts \
  --outfile=./dist/index.js

pnpm esbuild $ESBUILD_OPTS_CJS \
  --platform=node \
  src/index.ts \
  --outfile=./dist/index.cjs

cp tsconfig.browser.json tsconfig.json

pnpm esbuild $ESBUILD_OPTS_ESM \
  --platform=browser \
  src/index.ts \
  --outfile=./dist/browser.js

cp tsconfig.node.json tsconfig.json
