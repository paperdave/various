# @paperdave/events

<div>
<a href="https://github.com/paperdave/various#project-status-meaning"><img alt="Status: Stable" src="https://img.shields.io/badge/status-stable-brightgreen"></a>
<a href="https://www.npmjs.com/package/@paperdave/events"><img alt="NPM Version" src="https://img.shields.io/npm/v/@paperdave/events.svg?label=latest%20release"></a>
</div>
<br>

Another event emitter library. This one has built-in types as well as a little of dom-compatibility by supporting short `.on` and `.off` methods, but also `.addEventListener` and `.removeEventListener` methods. Add functions return a "Cleanup" function which can be called to quickly remove the listener.
