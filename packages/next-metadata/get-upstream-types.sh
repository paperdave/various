DEST=$(realpath $(dirname $0)"/src/nextjs" )
echo $DEST
cd /tmp
rm cd /tmp/next.js -rf
git clone https://github.com/vercel/next.js --depth 1
rm -rf "$DEST"
cp next.js/packages/next/src/lib/metadata -r "$DEST"

cd $DEST

rm **/*.test.*
rm *.test.*

sed -i 's/import path from \x27\.\.\/\.\.\/\.\.\/shared\/lib\/isomorphic\/path\x27/import path from "path"/g' resolvers/resolve-url.ts 
sed -i "s/import React from 'react'//g" default-metadata.tsx
sed -i '/export const DEFAULT_METADATA_TAGS/,/]\n/d' default-metadata.tsx
mv default-metadata.tsx default-metadata.ts
rm cd /tmp/next.js -rf
