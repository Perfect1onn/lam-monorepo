import { describe, it, expect } from 'vitest';
import {
	stringToBytes,
	bytesToString,
	hexToBytes,
	bytesToHex,
	concatBytes,
	equalBytes,
	isZeroBytes,
	sliceBytes,
	base64ToBytes,
	bytesToBase64,
} from '../src/index';

describe('Byte-utils tests', () => {
	// === string / bytes ===
	it('stringToBytes <-> bytesToString roundtrip', () => {
		const str = 'Hello, 世界';
		const bytes = stringToBytes(str);
		const result = bytesToString(bytes);
		expect(result).toBe(str);
	});

	// === hex ===
	it('hexToBytes <-> bytesToHex roundtrip', () => {
		const hex = 'deadbeef';
		const bytes = hexToBytes(hex);
		const result = bytesToHex(bytes);
		expect(result.toLowerCase()).toBe(hex);
	});

	it('hexToBytes handles 0x prefix', () => {
		const hex = '0xdeadbeef';
		const bytes = hexToBytes(hex);
		expect(bytesToHex(bytes).toLowerCase()).toBe('deadbeef');
	});

	// === concat / equal ===
	it('concatBytes combines arrays correctly', () => {
		const a = new Uint8Array([1, 2]);
		const b = new Uint8Array([3, 4]);
		const result = concatBytes(a, b);
		expect(Array.from(result)).toEqual([1, 2, 3, 4]);
	});

	it('equalBytes works correctly', () => {
		const a = new Uint8Array([1, 2, 3]);
		const b = new Uint8Array([1, 2, 3]);
		const c = new Uint8Array([1, 2, 4]);
		expect(equalBytes(a, b)).toBe(true);
		expect(equalBytes(a, c)).toBe(false);
	});

	// ===  zerobytes ===
	it('returns true for all zero bytes', () => {
		const bytes = new Uint8Array([0, 0, 0]);
		expect(isZeroBytes(bytes)).toBe(true);
	});

	it('returns false if any byte is non-zero', () => {
		const bytes = new Uint8Array([0, 1, 0]);
		expect(isZeroBytes(bytes)).toBe(false);
	});

	it('returns true for empty array', () => {
		const bytes = new Uint8Array([]);
		expect(isZeroBytes(bytes)).toBe(true);
	});

	// === slice ===
	it('slices correctly with start and end', () => {
		const bytes = new Uint8Array([1, 2, 3, 4, 5]);
		const result = sliceBytes(bytes, 1, 4);
		expect(Array.from(result)).toEqual([2, 3, 4]);
	});

	it('slices correctly with only start', () => {
		const bytes = new Uint8Array([1, 2, 3, 4]);
		const result = sliceBytes(bytes, 2);
		expect(Array.from(result)).toEqual([3, 4]);
	});

	it('returns empty array if start >= length', () => {
		const bytes = new Uint8Array([1, 2, 3]);
		const result = sliceBytes(bytes, 5);
		expect(result.length).toBe(0);
	});

	it('handles negative start', () => {
		const bytes = new Uint8Array([1, 2, 3, 4]);
		const result = sliceBytes(bytes, -2);
		expect(Array.from(result)).toEqual([3, 4]);
	});

	it('handles negative end', () => {
		const bytes = new Uint8Array([1, 2, 3, 4]);
		const result = sliceBytes(bytes, 0, -1);
		expect(Array.from(result)).toEqual([1, 2, 3]);
	});

	it('does not mutate original array', () => {
		const bytes = new Uint8Array([1, 2, 3]);
		const copy = sliceBytes(bytes, 0, 2);
		copy[0] = 99;
		expect(bytes[0]).toBe(1);
	});

	// base64 convertor
	it('bytesToBase64 <-> base64ToBytes roundtrip', () => {
		const bytes = new Uint8Array([104, 101, 108, 108, 111]); // hello
		const b64 = bytesToBase64(bytes);
		const result = base64ToBytes(b64);

		expect(Array.from(result)).toEqual(Array.from(bytes));
	});

	it('handles padding correctly', () => {
		const bytes = new Uint8Array([1, 2]);
		const b64 = bytesToBase64(bytes);
		const result = base64ToBytes(b64);

		expect(Array.from(result)).toEqual([1, 2]);
	});

	it('works with empty input', () => {
		const bytes = new Uint8Array([]);
		const b64 = bytesToBase64(bytes);
		const result = base64ToBytes(b64);

		expect(b64).toBe('');
		expect(result.length).toBe(0);
	});

	it('decodes known base64 string', () => {
		const b64 = 'aGVsbG8='; // hello
		const bytes = base64ToBytes(b64);

		expect(Array.from(bytes)).toEqual([104, 101, 108, 108, 111]);
	});
});
