---
'@paperdave/logger': major
---

Removed v3 deprecations:

- `log()` removed. use `new Logger()` for custom log names
- `fail` is renamed to `error` in all cases.
- `LogLevel` removed
- `level` export removed
- `setLevel()` removed. Use named logger strings with `setLogFilter` instead.
- `injectLogger()` no longer takes console as an argument, pass it as a property of the options object.
