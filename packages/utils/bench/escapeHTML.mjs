import { readFileSync } from 'fs';
import { bench, group, run } from 'mitata';

// From https://github.com/jhmaster2000/node-bun/blob/45e683ba8b7bb02feee49f3ce308dd3689142d09/src/polyfills.ts#L397
// MIT License
const escapeHTML_forLoop = input => {
  var str = String(input);
  var out = '';
  var length = str.length;
  for (var i = 0; i < length; i++) {
    var char = str[i];
    switch (char) {
      case '"':
        out += '&quot;';
        break;
      case "'":
        out += '&#x27;';
        break;
      case '&':
        out += '&amp;';
        break;
      case '<':
        out += '&lt;';
        break;
      case '>':
        out += '&gt;';
        break;
      default:
        out += char;
    }
  }
  return out;
};

const escapeHTML_replaceAll = string => {
  return String(string)
    .replaceAll('"', '&quot;')
    .replaceAll('&', '&amp;')
    .replaceAll("'", '&#x27;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
};

const map4Regex = {
  '"': '&quot;',
  '&': '&amp;',
  "'": '&#x27;',
  '<': '&lt;',
  '>': '&gt;',
};
const escapeHTML_regex = string => {
  return String(string).replace(/[&<>"']/g, tag => map4Regex[tag]);
};

// this data could maybe be done better
const data = `gdsafd4143<M,.>gadsf>231{DSA:Fd;asdf;;3241=-SADi3242""^45&321dkmcxvfdsagf40921<>SaSD.,<><SAD,<Script3124fkslajkldsjxz>>}`;

const times = [1, 2, 4, 8, 16, 32, 256, 1024, 20000];
for (const time of times) {
  const str = data.repeat(time);
  group('string length ' + str.length, () => {
    if (typeof Bun !== 'undefined')
      bench('Bun.escapeHTML', () => {
        Bun.escapeHTML(str);
      });
    bench('for loop', () => {
      escapeHTML_forLoop(str);
    });
    bench('string.replace', () => {
      escapeHTML_replaceAll(str);
    });
    bench('regex', () => {
      escapeHTML_regex(str);
    });
  });
}

run();
