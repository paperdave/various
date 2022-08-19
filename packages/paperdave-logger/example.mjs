import log, { Progress } from './dist/index.js';
import { delay, range } from '../paperdave-utils/dist/index.js';

log.info('yeah');

const bar = new Progress({
  text: ({ value, total, id }) => `it's ${value} / ${total}, id=${id}`,
  total: 100,
  props: {
    id: 'some id',
  },
});

for (const i of range(0, 100)) {
  await delay(100);
  bar.update(i, { id: Math.random().toString().slice(2) });
}

bar.success('We did it!');
