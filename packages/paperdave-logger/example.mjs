import * as log from './dist/index.js';
import { delay } from '../paperdave-utils/dist/index.js';

log.info('Hello World');

const spinner = new log.Spinner();
await delay(1000);
log.info('etc etc etc');
await delay(1000);
const spinner2 = new log.Spinner({ message: 'a subtask or whatever' });
await delay(1000);
log.info('etc etc etc');
await delay(1000);
log.warn('something might blow up');
await delay(1000);
spinner.remove();
log.fail('the thing blew up!');
await delay(1000);
log.error('yeah that error sucks lol');
log.debug('wont be shown lol');
await delay(1000);
log.info('hmm');
await delay(1000);
spinner2.remove();
log.success('done');
