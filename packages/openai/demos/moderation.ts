import { generateModeration } from '../src';

const mod = await generateModeration({
  input: 'I want to kill them.',
});

console.log(mod);
