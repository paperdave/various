import { CLIError, log } from './src';

log.setShowDebug(true);
log.writeRawLine('');
log.info('Hello World!');
log.warn('This is a warning!');
log.error('This is an error!');
log.debug('This is a debug message!');
log.success('Your web server is running on http://localhost:3000');
log.warn('Type "success" messages should be used sparingly.');

log.info(
  "If you log an empty string or pass no args, the prefix isn't shown. Also, these logs will wrap if it gets too long, which is very arbitrarily defined, but I think it's kind of nice."
);
log.info('');
log.info();

log.error(new Error('This is an error!'));
log.info("There's a special error class you can use to print nice formatted errors");
log.error(
  new CLIError(
    'Invalid config file',
    `Please check your config file at ~/.cool.json and try again.`
  )
);
log.info('yeah.');
