import fs from 'fs';

const packages = fs.readdirSync('./packages');
const packageJSONs = packages.map(packageName => {
  return JSON.parse(fs.readFileSync(`./packages/${packageName}/package.json`));
});
packageJSONs.sort((a, b) => {
  const aSort = a['paperdave-readme-sort'];
  const bSort = b['paperdave-readme-sort'];
  if (aSort && bSort) {
    return aSort - bSort;
  } else if (aSort) {
    return -1;
  } else if (bSort) {
    return 1;
  }
  return a.name.localeCompare(b.name);
});

const headers = ['Package', 'Description'];

const mappedColumns = packageJSONs.map(packageJSON => {
  return [
    // Shield icon with npm version
    `[![npm](https://img.shields.io/npm/v/${packageJSON.name}.svg?label=${encodeURIComponent(
      packageJSON.name
    )})](https://www.npmjs.com/package/${packageJSON.name})`,
    // Description
    packageJSON.description,
  ];
});

const mdTable = [
  '| ' + headers.join(' | ') + ' |',
  '| ' + headers.map(() => '---').join(' | ') + ' |',
  ...mappedColumns.map(columns => {
    return '| ' + columns.map(x => x ?? '').join(' | ') + ' |';
  }),
].join('\n');

const readme = fs.readFileSync('./README.md', 'utf8');
const readmeWithTable = readme.replace(
  /<!-- START-README-TABLE -->[\s\S]*<!-- END-README-TABLE -->/,
  `<!-- START-README-TABLE -->\n${mdTable}\n<!-- END-README-TABLE -->`
);

fs.writeFileSync('./README.md', readmeWithTable);
console.log('Updated README.md');
