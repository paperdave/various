# @paperdave/logger

<div>
<a href="https://github.com/paperdave/various#project-status-meaning"><img alt="Status: Stable" src="https://img.shields.io/badge/status-stable-brightgreen"></a>
<a href="https://www.npmjs.com/package/@paperdave/logger"><img alt="NPM Version" src="https://img.shields.io/npm/v/@paperdave/logger.svg?label=latest%20release"></a>
</div>
<br>

This is the logger I use in my programs. It unifies ideas from many other console io packages into one coherent interface.

- Customizable log levels
  - Built in: `info`, `warn`, `debug`, `error`, `success`, `trace`
  - Custom log names with the same automatic color system the `debug` package uses.
- Injecting the global `console` object to force all logs to be formatted consistantly.
- Widgets: dynamic, animatable, and interactive things that stick to the bottom of your log:
  - Spinners (replaces `ora`)
  - Progress Bars (replaces `cli-progress`)
  - Text/Selector Input (replaces `prompt`)
- Pretty error formatting, just pass an error object to any log function.
  - Colorized and simplified stack traces.
  - Easy interface to add long descriptions onto errors the end user may see.
- Rexports `chalk` and `ansi-escapes` for easy usage in commonjs modules.
- Bun and Node.js support. Technically works in browser, but limited features and it's a huge bundle (13kb node, 51kb browser).

## Basic Examples

```ts
import Logger from '@paperdave/logger';

Logger.info('Hello World');
Logger.warn('This is a warning');
Logger.debug('This is a debug message'); // Hidden by default

Logger.error('Program did not succeed!');
Logger.success('Program Succeeded!');

Logger.trace('This will print the current stack');
```

```ts
import { info, warn } from '@paperdave/logger';

info('Built-in log presets are exposed as separate functions too.');
warn('This is a warning');
```

## Custom Log Levels

```ts
import Logger from '@paperdave/logger';

const http = new Logger('http');
const db = new Logger('db');

http('Request incoming');
db('Dropping all tables');
http('Request complete');
```

These function similar to the `debug` package, but are **visible by default**. Visibility can be customized with the `DEBUG` environment variable, or by passing the `debug: true` in the second argument.

The rest of the Logger options are as follows:

```ts
const debug = new Logger(name, {
  id: name, // Used for `DEBUG` environment variable filtering
  color: undefined, // Custom color, see jsdoc for how this works.
  coloredText: false,
  boldText: false,
  error: false, // Print to STDERR
  debug: false, // If true, will be hidden by default
});
```

## Injecting `console.log` and other functions.

In Purplet, we inject `@paperdave/logger` into the `console` object. This allows the users' logs to appear nicely formatted. By default this also listens for uncaught errors and **will close the program if an error is thrown**; this is default behavior in modern Node.

```ts
import { injectLogger } from '@paperdave/logger';
injectLogger();

console.log('This will be formatted!');
console.error('This will be formatted too!');
```

You can pass parameters to the injector to customize how it behaves.

Surprisingly, you may find that `@paperdave/logger` runs faster than Node.js's `console.log` function in some cases ;)

## Spinners and Progress Bars

The `Spinner` and `ProgressBar` bar classes instantly start rendering when constructed, and have various methods to update their state and resolve them.

```ts
import { Spinner } from '@paperdave/logger';
import { delay } from '@paperdave/utils';

const spinner = new Spinner('Loading...');
await delay(1000);
spinner.update('Still Loading...');
await delay(1000);
spinner.success('Done!');
```

It may be more useful to put your logic in an async function and use the `withSpinner` helper:

```ts
import { withSpinner } from '@paperdave/logger';

await withSpinner({
  text: 'Doing this very cool operation.',
  successText: 'Operation done.',
}, async(spinner) => {
  await doSomething();
  spinner.update('part one done');
  await doSomethingElse();
});
```

Progress bars have the same general API as spinners, but some other properties.

## Custom errors with `PrintableError` and `CLIError`

A `PrintableError` is an error that defines some extra fields. `@paperdave/logger` handles these objects within logs which allows customizing their appearance. It can be useful when building CLIs to throw formatted error objects that instruct the user what they did wrong, without printing a huge piece of text with a useless stack trace.

```ts
// as defined in @paperdave/logger
export interface PrintableError extends Error {
  description: string;
  hideStack?: boolean;
  hideName?: boolean;
}
```

For ease of use, we provide the simple `CLIError` class which implements this interface. A real world example taken from [Purplet](https://github.com/CRBT-Team/Purplet) is how we handle a missing Discord Token:

```ts
throw new CLIError(
  'Missing DISCORD_BOT_TOKEN environment variable!',
  dedent`
    Please create an ${chalk.cyan('.env')} file with the following contents:

    ${chalk.cyanBright('DISCORD_BOT_TOKEN')}=${chalk.grey('<your bot token>')}

    You can create or reset your bot token at ${devPortalLink}
  `
);
```

In combination with `injectLogger`, throwing a CLI error is all that is needed to print a pretty error message to the user and exit the program.

## Custom Widgets

`LogWidget` is a base class for widgets. A widget is responsible for providing a `format(now) -> string` function, where `now` is the value of `performance.now()`, and then an `fps` constant which is set to 15 by default.

In addition to that, the (protected) api contains

- `remove` - remove the widget from the log
- `redraw` - forces a redraw
- `LogWidget.batchRedraw(fn)` - pass a fn and perform multiple log operations in a single batch, useful to optimize log + remove() calls.
