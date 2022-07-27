import log, { Spinner, withSpinner } from './dist/index.js';
import { delay } from '../paperdave-utils/dist/index.js';

log.info('yeah');

await withSpinner(
  async spinner => {
    await delay(1000);
    spinner.update('working on it');
    await delay(1000);

    throw new Error('oops');

    return 'result';
  },
  {
    color: 'red',
    message: 'Calculating a thing...',
    failureMessage: 'Lol it fuckin broke',
    successMessage: result => `It succeeded with ${result}`,
  }
);

// const spinner = new Spinner({ message: '12.5fps, what ora uses.' });
// const spinner2 = new Spinner({ message: '60fps lol', fps: 60 });
// const spinner3 = new Spinner({
//   message: () => `2fps, random number is ${Math.random()}`,
//   fps: 2,
//   color: 'greenBright',
// });

// await delay(1000);
// log.info('etc etc etc');
// await delay(1000);
// await delay(1000);
// log.info('etc etc etc');
// await delay(1000);
// log.warn('something might blow up');
// await delay(1000);
// spinner.remove();
// log.fail('the thing blew up!');
// await delay(1000);
// log.error('yeah that error sucks lol');
// log.debug('wont be shown lol');
// await delay(1000);
// log.info('hmm');
// await delay(1000);
// spinner2.remove();
// log.success('done');
