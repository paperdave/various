import { describe, expect, test } from 'bun:test';
import { resolveAndRenderMetadata } from '../src';

describe('opengraph', () => {
  test('basic website', () => {
    const output = resolveAndRenderMetadata({
      openGraph: {
        type: 'website',
        siteName: 'My Site',
        title: 'My Title',
        description: 'My Description',
        url: 'https://example.com',
        images: ['https://example.com/image.png'],
      },
    });
    expect(output).toBe(
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<meta property="og:title" content="My Title">' +
        '<meta property="og:description" content="My Description">' +
        '<meta property="og:url" content="https://example.com/">' +
        '<meta property="og:site_name" content="My Site">' +
        '<meta property="og:image" content="https://example.com/image.png">' +
        '<meta property="og:type" content="website">'
    );
  });
});
