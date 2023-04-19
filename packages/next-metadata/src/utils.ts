// Extracted from @paperdave/utils/string
declare var Bun: any;

export const escapeHTML: (string: string) => string =
  typeof Bun !== 'undefined'
    ? Bun.escapeHTML
    : (string: string) => {
        return string
          .replaceAll('"', '&quot;')
          .replaceAll('&', '&amp;')
          .replaceAll("'", '&#x27;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;');
      };
