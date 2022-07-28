# @paperdave/events

Another stupid event emitter library. This one has built-in types as well as a little of dom-compatibility by supporting short `.on` and `.off` methods, but also `.addEventListener` and `.removeEventListener` methods. Add functions return a "Cleanup" function which can be called to quickly remove the listener.
