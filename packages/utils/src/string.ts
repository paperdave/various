/** Capitalizes a string. */
export function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

/**
 * Alias of Bun.escapeHTML, polyfilled for other platforms.
 *
 * Escape the following characters in a string:
 *
 * - `"` becomes `"&quot;"`
 * - `&` becomes `"&amp;"`
 * - `'` becomes `"&#x27;"`
 * - `<` becomes `"&lt;"`
 * - `>` becomes `"&gt;"`
 *
 * In bun, this function is optimized for large input. On an M1X, it processes 480 MB/s - 20 GB/s,
 * depending on how much data is being escaped and whether there is non-ascii text.
 */
export const escapeHTML =
  (Bun.escapeHTML as (string: string) => string) ??
  ((string: string) => {
    return string
      .replaceAll('"', '&quot;')
      .replaceAll('&', '&amp;')
      .replaceAll("'", '&#x27;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  });

export function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function escapeRegexReplacement(string: string) {
  return string.replace(/\$/g, '$$$$');
}

export function plural(string: string | [string, string], number?: number) {
  return (
    (number !== undefined ? number + ' ' : '') +
    (number === 1
      ? Array.isArray(string)
        ? string[0]
        : string
      : Array.isArray(string)
      ? string[1]
      : string.endsWith('s')
      ? string + 'es'
      : string + 's')
  );
}
/** Polyfill for String.cooked. */
export function cookString(strings: TemplateStringsArray, ...values: any[]): string {
  // Concatenate the cooked strings and values
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += values[i];
    }
  }
  return result;
}

export function urlTemplate(strings: TemplateStringsArray, ...subs: string[]) {
  return cookString(strings, ...subs.map(sub => encodeURIComponent(sub)));
}

export function htmlTemplate(strings: TemplateStringsArray, ...subs: string[]) {
  return cookString(strings, ...subs.map(sub => escapeHTML(sub)));
}
