import { spawn } from 'child_process';
import fs from 'fs';
import log, { withSpinner } from '../packages/paperdave-logger/dist/index.js';

log.info('Updating README.md with package information.');

const statusColors = {
  stable: 'brightgreen',
  lts: 'blue',
  dead: 'red',
  wip: 'grey',
};

const packages = fs.readdirSync('./packages');

const packageJSONs = packages
  .map(packageName => JSON.parse(fs.readFileSync(`./packages/${packageName}/package.json`)))
  .filter(pkg => !pkg.private)
  .sort((a, b) => {
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

const headers = ['Package', 'Status', 'Description'];

const mappedColumns = packageJSONs.map(packageJSON => [
  // Shield icon with npm version
  `[![npm](https://img.shields.io/npm/v/${packageJSON.name}.svg?label=${encodeURIComponent(
    packageJSON.name
  )})](https://www.npmjs.com/package/${packageJSON.name})`,
  // Status
  `[![${
    statusColors[packageJSON['paperdave-status']] || 'grey'
  }](https://img.shields.io/badge/status-${encodeURIComponent(
    packageJSON['paperdave-status'] || 'unknown'
  )}-${statusColors[packageJSON['paperdave-status']] || 'grey'}.svg)](#project-status-meaning)`,
  // Description
  packageJSON.description,
]);

const mdTable = [
  '| ' + headers.join(' | ') + ' |',
  '| ' + headers.map(() => '---').join(' | ') + ' |',
  ...mappedColumns.map(columns => '| ' + columns.map(x => x ?? '').join(' | ') + ' |'),
].join('\n');

const readme = fs.readFileSync('./README.md', 'utf8');
const readmeWithTable = readme.replace(
  /<!-- START-README-TABLE -->[\s\S]*<!-- END-README-TABLE -->/,
  `<!-- START-README-TABLE -->\n${mdTable}\n<!-- END-README-TABLE -->`
);

fs.writeFileSync('./README.md', readmeWithTable);

log.success('Updated README.md with package information.');

await withSpinner(
  () =>
    new Promise((resolve, reject) => {
      const proc = spawn('./node_modules/.bin/prettier', ['--write', './README.md']);
      proc.on('exit', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('Prettier failed'));
        }
      });
    }),
  {
    text: 'Formatting README.md',
    successText: 'Formatted README.md',
  }
);
