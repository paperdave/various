import { error, info, warn } from './src';

info('Hello world!');
warn('Hello world!');
info(new Error('Hello world!'));
error(new Error('Hello world!'));
