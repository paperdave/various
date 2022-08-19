import log, { createLogger } from './dist/index.js';

log.error(
  'Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World '
);
log.error(new Error('error'));
log.error(new TypeError('other error'));
