import { generateTextEdit } from '../src/text-edit';

const generation = await generateTextEdit({
  model: 'text-davinci-edit-001',
  input: 'The quick brown fox jumps over the lazy dog.',
  instruction: 'Convert to leet speak.',
});
console.log(generation);
