# next-metadata

<div>
<a href="https://github.com/paperdave/various#project-status-meaning"><img alt="Status: WIP" src="https://img.shields.io/badge/status-wip-yellow"></a>
<a href="https://www.npmjs.com/package/next-metadata"><img alt="NPM Version" src="https://img.shields.io/npm/v/next-metadata.svg?label=latest%20release"></a>
</div>
<br>

This library is a port of [Next.js' metadata object](https://beta.nextjs.org/docs/api-reference/metadata) API, targetted towards people who want to borrow it's easy api for specifying meta tags. It provides a simple interface to merge and render metadata to strings, which can be inserted into an HTML template during SSR.

**The exact Metadata API may change as Next.js' App Router is still in beta.**

```ts
import { Metadata, resolveAndRenderMetadata } from 'next-metadata';

const metadata: Metadata = {
  title: 'Hello world',
  description: 'This is a web page'
};

// A framework author would insert this string into the page's <head> element.
console.log(resolveAndRenderMetadata(metadata));
// <title>Hello world</title>
// <meta name="description" content="This is a web page">
// <meta name="viewport" content="width=device-width, initial-scale=1">
```

This package doesn't depend on React or Next.js, but it's source includes code from [Next.js](https://github.com/vercel/next.js) (MIT license), which is bundled and re-exported.

## Docs

- `resolveMetadata(...metadatas): ResolvedMetadata`, converts raw metadata objects into a single resolved metadata object. to apply title templates and overriding stuff, pass multiple objects, where the first is the outer-most layout, and the last is the page metadata.
- `renderMetadata(resolvedMetadata): string`, converts a `ResolvedMetadata`
- `resolveAndRenderMetadata(...metadatas): string`, does both operations at once.

In addition to this, it exports every single metadata type from Next.js, which might be overwhelming when looking at the intellisense dropdown. The key types in it are `Metadata` and `ResolvedMetadata`.
