# @paperdave/logger

This is the logger I use in some of my programs. For common cases, `info()` runs faster than Node.js's `console.log()`, plus:

- Customizable log levels, with the same automatic colors from the `debug` package.
- Built in log levels: `info`, `warn`, `debug`, `error`, `success`, and `trace`.
- Widgets, dynamic and animatable things that stick to the bottom of your log:
  - Spinners (replaces `ora`)
  - Progress Bars (replaces `cli-progress` and alternatives)
  - Simple API for other widgets (specify and `fps` and implement a `format` function).
- Pretty error formatting, just pass an error object to any log function.
  - Colorized and simplified stack traces.
  - `CLIError`, which provides the ability to provide a long description and hide the stack trace - Good for displaying to end users.
- Injecting the global `console` object to force all logs to be formatted consistantly.
- Bun (mostly) and Node.js support.

![](screenshot.png)

## Basic Example

```ts
import log from '@paperdave/logger';

log.info('Hello World!');
log.warn('This is a warning!');
log.error('This is an error!');
log.debug('This is a debug message!');

log.setLevel('debug'); // Default to `info`, unless `$DEBUG` is set.

// Use these sparingly, as they are intended for primary success messages, such as
// a web server listening on a port, or a Discord bot successfully logging in.
log.success('This is a success message!');
```

## Injecting `console.log` and other functions.

In Purplet, we inject `@paperdave/logger` into the `console` object. This allows the users' logs to appear nicely formatted. By default this also listens for uncaught errors and **will close the program if an error is thrown**; this is default behavior in modern Node.

```ts
import { injectLogger } from '@paperdave/logger';

injectLogger();
```

You can pass parameters to the injector to customize how it behaves.

## Spinners and Progress Bars

The `Spinner` and `ProgressBar` bar classes instantly start rendering when constructed, and have various methods to update their state and resolve them.

```ts
import { Spinner } from '@paperdave/logger';
import { delay } from '@paperdave/utils';

const spinner = new Spinner({
  text: 'Loading...'
});
await delay(1000);
spinner.update('Still Loading...');
await delay(1000);
spinner.success('Done!');
```

## Custom Widgets

`LogWidget` is a base class for widgets. A widget is responsible for providing a `format(now) -> string` function, where `now` is the value of `performance.now()`, and then an `fps` constant which is set to 15 by default.

In addition to that, the (protected) api contains

- `remove` - remove the widget from the log
- `redraw` - forces a redraw
- `LogWidget.batchRedraw(fn)` - pass a fn and perform multiple log operations in a single batch, useful to optimize log + remove() calls.
