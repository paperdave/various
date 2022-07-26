# @paperdave/logger

This is the logger I use in some places, such as in [Purplet](https://github.com/CRBT-Team/Purplet). It is very opiniated and clean (according to my opinion), and supports multiple levels.

```ts
import { log } from '@paperdave/logger';

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

In Purplet, we inject `@paperdave/logger` into the `console` object. This allows the users' logs to appear nicely formatted.

```ts
import { injectLogger } from '@paperdave/logger';

injectLogger();
```
