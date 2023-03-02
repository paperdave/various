/** Capitalizes a string. */
export function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1);
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
