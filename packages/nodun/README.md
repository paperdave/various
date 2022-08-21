# nodun

<div>
<a href="https://github.com/paperdave/various#project-status-meaning"><img alt="Status: Stable" src="https://img.shields.io/badge/status-stable-brightgreen"></a>
<a href="https://www.npmjs.com/package/nodun"><img alt="NPM Version" src="https://img.shields.io/npm/v/nodun.svg?label=latest%20release"></a>
</div>
<br>

Tricks programs to run js with [Bun](https://bun.sh) instead of [Node.js](https://nodejs.org/). This is done by patching the `PATH` environment variable with a fake version of `node`. A couple other things are done as well, but that's the essential part.

```sh
# install
bun add -g nodun
# nodun passes all args to bun
nodun run script-name
```

Probably not super useful just yet, as most programs wont run on Bun just yet.
