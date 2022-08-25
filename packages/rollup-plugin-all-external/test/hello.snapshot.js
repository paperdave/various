'use strict';

var bun = require('bun');
var sqlite = require('bun:sqlite');
var path1 = require('node:path');
var esbuild = require('esbuild');
var something = require('./node_modules/something/index.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var bun__default = /*#__PURE__*/_interopDefaultLegacy(bun);
var sqlite__default = /*#__PURE__*/_interopDefaultLegacy(sqlite);
var path1__default = /*#__PURE__*/_interopDefaultLegacy(path1);
var something__default = /*#__PURE__*/_interopDefaultLegacy(something);

// The following two should resolve to the same thing

/* eslint-disable no-console */

console.log([esbuild.build, something__default["default"], path1__default["default"], path1__default["default"], bun__default["default"], sqlite__default["default"]]);
