import { deepEqual } from 'assert';
import { describe, test } from 'bun:test';
import { hexToUint8Array, uint8ArrayToHex } from './u8int';

describe('u8int', () => {
  describe('hexToUint8Array', () => {
    test('should convert a hex string to a Uint8Array', () => {
      deepEqual(
        hexToUint8Array('000102030405060708090a0b0c0d0e0f'),
        new Uint8Array([
          0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
          0x0f,
        ])
      );
    });
  });

  describe('uint8ArrayToHex', () => {
    test('should convert a Uint8Array to a hex string', () => {
      deepEqual(
        uint8ArrayToHex(
          new Uint8Array([
            0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,
            0x0e, 0x0f,
          ])
        ),
        '000102030405060708090a0b0c0d0e0f'
      );
    });
  });
});
