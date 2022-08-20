---
'@paperdave/logger': minor
---

`error` now prints with an X symbol, and this is the standard for printing errors.

`success` is now seen as the opposite of an `error`. I used to say to avoid calling success too much, but with Spinners and Progress bars ending on a `success` check or `error` X message, these should probably be used more often, instead of `info` on a successful action being done.
