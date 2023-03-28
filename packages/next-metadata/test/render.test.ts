/// <reference types='bun-types' />
import { describe, expect, it } from 'bun:test';
import { resolveAndRenderMetadata } from '../src';

describe('icons', () => {
  it('works', () => {
    const output = resolveAndRenderMetadata({
      icons: {
        icon: '/icon.png',
        shortcut: '/shortcut-icon.png',
        apple: '/apple-icon.png',
        other: {
          rel: 'apple-touch-icon-precomposed',
          url: '/apple-touch-icon-precomposed.png',
        },
      },
    });

    expect(output).toBe(
      [
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<link rel="shortcut icon" href="/shortcut-icon.png">',
        '<link rel="icon" href="/icon.png">',
        '<link rel="apple-touch-icon" href="/apple-icon.png">',
        '<link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png">',
      ].join('')
    );
  });
});
describe('robots', () => {
  it('simple case', () => {
    const output = resolveAndRenderMetadata({
      robots: {
        index: false,
      },
    });
    expect(output).toBe(
      [
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<meta name="robots" content="noindex">',
      ].join('')
    );
  });
  it('complex case', () => {
    const output = resolveAndRenderMetadata({
      robots: {
        index: true,
        follow: false,
        noarchive: true,
        googleBot: {
          index: false,
        },
      },
    });
    expect(output).toBe(
      [
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<meta name="robots" content="index, nofollow, noarchive">',
        '<meta name="googlebot" content="noindex">',
      ].join('')
    );
  });
});
