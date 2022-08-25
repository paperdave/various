// @ts-nocheck test file
/* eslint-disable no-console */
import bun from 'bun';
import sqlite from 'bun:sqlite';
import path1 from 'node:path';
import path2 from 'path';
import { build } from 'esbuild';
import something from './node_modules/something/index.js';

console.log([build, something, path1, path2, bun, sqlite]);
