import log, { createLogger } from './dist/index.js';

log.info('info message');
log.warn('warn message');
log.error('error message');
log.success('success message');
log.trace('example trace');
log.debug('debug message');

console.log();

const custom = createLogger('custom');
const dave = createLogger('dave');
const coolThing = createLogger('cool-thing');

custom('ooh, custom log levels');
dave('he says hi');
coolThing('something cool happened');
