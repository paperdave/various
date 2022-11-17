import * as utils from './fs';
import { deepEqual } from 'assert';
import { describe, test } from 'bun:test';
import { readFileSync, rmSync, statSync, writeFileSync } from 'fs';

function cleanup() {
  rmSync('/tmp/test.txt', { force: true });
  rmSync('/tmp/test', { force: true });
}
describe('json', () => {
  describe('readJSONSync', () => {
    test('works', () => {
      cleanup();
      writeFileSync('/tmp/test.json', JSON.stringify({ test: true }));
      const json = utils.readJSONSync('/tmp/test.json');
      deepEqual(json, { test: true });
    });
    test('throws on non exist', () => {
      cleanup();
      let threw = false;
      try {
        utils.readJSONSync('/tmp/noexist.json');
      } catch (error) {
        threw = true;
      }
      deepEqual(threw, true);
    });
    test('default', () => {
      cleanup();
      const json = utils.readJSONSync('/tmp/noexist.json', { default: { test: true } });
      deepEqual(json, { test: true });
    });
    test('default function', () => {
      cleanup();
      const json = utils.readJSONSync('/tmp/noexist.json', { default: () => ({ test: true }) });
      deepEqual(json, { test: true });
    });
  });
  describe('readJSON', () => {
    test('works', async () => {
      cleanup();
      writeFileSync('/tmp/test.json', JSON.stringify({ test: true }));
      const json = await utils.readJSON('/tmp/test.json');
      deepEqual(json, { test: true });
    });
    test('throws on non exist', async () => {
      cleanup();
      let threw = false;
      try {
        await utils.readJSON('/tmp/noexist.json');
      } catch (error) {
        threw = true;
      }
      deepEqual(threw, true);
    });
    test('default', async () => {
      cleanup();
      const json = await utils.readJSON('/tmp/noexist.json', { default: { test: true } });
      deepEqual(json, { test: true });
    });
    test('default function', async () => {
      cleanup();
      const json = await utils.readJSON('/tmp/noexist.json', { default: () => ({ test: true }) });
      deepEqual(json, { test: true });
    });
  });
  describe('writeJSONSync', () => {
    test('works', () => {
      cleanup();
      utils.writeJSONSync('/tmp/test.json', { test: true }, { mkdir: true });
      const json = readFileSync('/tmp/test.json', 'utf8');
      deepEqual(json, '{"test":true}');
    });
    test('works with spaces', () => {
      cleanup();
      utils.writeJSONSync('/tmp/test.json', { test: true }, { mkdir: true, spaces: 2 });
      const json = readFileSync('/tmp/test.json', 'utf8');
      deepEqual(json, '{\n  "test": true\n}');
    });
    test('works with replacer', () => {
      cleanup();
      utils.writeJSONSync('/tmp/test.json', { test: true }, { mkdir: true, replacer: ['test'] });
      const json = readFileSync('/tmp/test.json', 'utf8');
      deepEqual(json, '{"test":true}');
    });
    test('write permissions', () => {
      cleanup();
      utils.writeJSONSync('/tmp/test.json', { test: true }, { mkdir: true, mode: 0o444 });
      const json = readFileSync('/tmp/test.json', 'utf8');
      deepEqual(json, '{"test":true}');
      const stat = statSync('/tmp/test.json');
      deepEqual(stat.mode & 0o777, 0o444);
    });
    test('mkdir', () => {
      cleanup();
      utils.writeJSONSync('/tmp/test/test.json', { test: true }, { mkdir: true });
      const json = readFileSync('/tmp/test/test.json', 'utf8');
      deepEqual(json, '{"test":true}');
    });
  });
  describe('writeJSON', () => {
    test('works', async () => {
      cleanup();
      await utils.writeJSON('/tmp/test.json', { test: true }, { mkdir: true });
      const json = readFileSync('/tmp/test.json', 'utf8');
      deepEqual(json, '{"test":true}');
    });
    test('works with spaces', async () => {
      cleanup();
      await utils.writeJSON('/tmp/test.json', { test: true }, { mkdir: true, spaces: 2 });
      const json = readFileSync('/tmp/test.json', 'utf8');
      deepEqual(json, '{\n  "test": true\n}');
    });
    test('works with replacer', async () => {
      cleanup();
      await utils.writeJSON('/tmp/test.json', { test: true }, { mkdir: true, replacer: ['test'] });
      const json = readFileSync('/tmp/test.json', 'utf8');
      deepEqual(json, '{"test":true}');
    });
    test('write permissions', async () => {
      cleanup();
      await utils.writeJSON('/tmp/test.json', { test: true }, { mkdir: true, mode: 0o444 });
      const json = readFileSync('/tmp/test.json', 'utf8');
      deepEqual(json, '{"test":true}');
      const stat = statSync('/tmp/test.json');
      deepEqual(stat.mode & 0o777, 0o444);
    });
    test('mkdir', async () => {
      cleanup();
      await utils.writeJSON('/tmp/test/test.json', { test: true }, { mkdir: true });
      const json = readFileSync('/tmp/test/test.json', 'utf8');
      deepEqual(json, '{"test":true}');
    });
  });
});
describe('yaml', () => {
  describe('readYAMLSync', () => {
    test('works', () => {
      cleanup();
      writeFileSync('/tmp/test.yml', 'test: true');
      const json = utils.readYAMLSync('/tmp/test.yml');
      deepEqual(json, { test: true });
    });
    test('throws on non exist', () => {
      cleanup();
      let threw = false;
      try {
        utils.readYAMLSync('/tmp/noexist.yml');
      } catch (error) {
        threw = true;
      }
      deepEqual(threw, true);
    });
    test('default', () => {
      cleanup();
      const json = utils.readYAMLSync('/tmp/noexist.yml', { default: { test: true } });
      deepEqual(json, { test: true });
    });
    test('default function', () => {
      cleanup();
      const json = utils.readYAMLSync('/tmp/noexist.yml', { default: () => ({ test: true }) });
      deepEqual(json, { test: true });
    });
  });
  describe('readYAML', () => {
    test('works', async () => {
      cleanup();
      writeFileSync('/tmp/test.yml', 'test: true');
      const json = await utils.readYAML('/tmp/test.yml');
      deepEqual(json, { test: true });
    });
    test('throws on non exist', async () => {
      cleanup();
      let threw = false;
      try {
        await utils.readYAML('/tmp/noexist.yml');
      } catch (error) {
        threw = true;
      }
      deepEqual(threw, true);
    });
    test('default', async () => {
      cleanup();
      const json = await utils.readYAML('/tmp/noexist.yml', { default: { test: true } });
      deepEqual(json, { test: true });
    });
    test('default function', async () => {
      cleanup();
      const json = await utils.readYAML('/tmp/noexist.yml', { default: () => ({ test: true }) });
      deepEqual(json, { test: true });
    });
  });
  describe('writeYAMLSync', () => {
    test('works', () => {
      cleanup();
      utils.writeYAMLSync('/tmp/test.yml', { test: true }, { mkdir: true });
      const json = readFileSync('/tmp/test.yml', 'utf8');
      deepEqual(json, 'test: true\n');
    });
    test('write permissions', () => {
      cleanup();
      utils.writeYAMLSync('/tmp/test.yml', { test: true }, { mkdir: true, mode: 0o444 });
      const json = readFileSync('/tmp/test.yml', 'utf8');
      deepEqual(json, 'test: true\n');
      const stat = statSync('/tmp/test.yml');
      deepEqual(stat.mode & 0o777, 0o444);
    });
    test('mkdir', () => {
      cleanup();
      utils.writeYAMLSync('/tmp/test/test.yml', { test: true }, { mkdir: true });
      const json = readFileSync('/tmp/test/test.yml', 'utf8');
      deepEqual(json, 'test: true\n');
    });
  });
  describe('writeYAML', () => {
    test('works', async () => {
      cleanup();
      await utils.writeYAML('/tmp/test.yml', { test: true }, { mkdir: true });
      const json = readFileSync('/tmp/test.yml', 'utf8');
      deepEqual(json, 'test: true\n');
    });
    test('write permissions', async () => {
      cleanup();
      await utils.writeYAML('/tmp/test.yml', { test: true }, { mkdir: true, mode: 0o444 });
      const json = readFileSync('/tmp/test.yml', 'utf8');
      deepEqual(json, 'test: true\n');
      const stat = statSync('/tmp/test.yml');
      deepEqual(stat.mode & 0o777, 0o444);
    });
    test('mkdir', async () => {
      cleanup();
      await utils.writeYAML('/tmp/test/test.yml', { test: true }, { mkdir: true });
      const json = readFileSync('/tmp/test/test.yml', 'utf8');
      deepEqual(json, 'test: true\n');
    });
  });
});
