import yargs from 'yargs';
import { exportDirectory, exportDirectoryWatch, Options } from './lib';

const args = yargs(process.argv.slice(2))
  .scriptName('export-directory')
  .usage('$0 <root> [opts]')
  .epilog(
    'export-directory automatically manage index.js files that\nexport all files in the directory'
  )
  .positional('root', {
    desc: 'where to operate',
    string: true,
  })
  .option('watch', {
    alias: 'w',
    boolean: true,
    desc: 'watch mode',
  })
  .option('semi', {
    boolean: true,
    default: true,
    desc: 'semicolons in output',
  })
  .option('ending', {
    choices: ['auto', 'lf', 'crlf'],
    default: 'auto',
    desc: 'line ending style',
  })
  .option('quotes', {
    choices: ['single', 'double'],
    default: 'single',
    desc: 'quotes style',
  })
  .option('ignore', {
    array: true,
    string: true,
    default: [],
    desc: 'paths to ignore, in addition to node_modules and .git',
  });

const argv = await args.argv;

const opts: Options = {
  ignore: argv.ignore,
  lineEnding: argv.ending as any,
  quote: argv.quotes as any,
  semi: argv.semi as any,
};

if (!argv._[0]) {
  args.showHelp();
  process.exit(1);
}

if (argv.watch) {
  exportDirectoryWatch((argv._ as any)[0], opts);
} else {
  exportDirectory((argv._ as any)[0], opts);
}
