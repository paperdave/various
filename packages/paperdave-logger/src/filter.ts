let filters: string[] = [];
export function setLogFilter(...newFilters: Array<string | string[]>) {
  filters = newFilters.flat().map(filter => filter.toLowerCase());
}

export function isLogVisible(id: string, defaultVisibility = true) {
  for (const filter of filters) {
    if (filter === '*') {
      defaultVisibility = true;
    } else if (filter === '-*') {
      defaultVisibility = false;
    } else if (filter === id || id.startsWith(filter + ':')) {
      defaultVisibility = true;
    } else if (filter === '-' + id || id.startsWith('-' + filter + ':')) {
      defaultVisibility = false;
    }
  }
  return defaultVisibility;
}

if (process.env.DEBUG !== undefined) {
  const aliasesToAll = ['1', 'true', 'all'];
  setLogFilter(
    String(process.env.DEBUG)
      .split(',')
      .map(x => x.trim())
      .map(x => (aliasesToAll.includes(x.toLowerCase()) ? '*' : x))
  );
}
