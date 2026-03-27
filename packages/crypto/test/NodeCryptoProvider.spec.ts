import { NodeCryptoProvider } from '../src/index.ts';
import { describe, it, expect } from 'vitest';
// needed build @lam/utils before run tests;
import { bytesToString, stringToBytes } from '@lam/utils';

describe('NodeCryptoProvider', () => {
	const nodeCryptoProvider = new NodeCryptoProvider();

	it('generate entropy', () => {
		const a = nodeCryptoProvider.generateEntropy(16);
		const b = nodeCryptoProvider.generateEntropy(16);

		expect(a).not.toEqual(b);
	});

	it('encrypt -> decrypt', async () => {
		const plaintext = stringToBytes('hello');
		const password = stringToBytes('secure-password');
		const encrypted = await nodeCryptoProvider.encrypt(plaintext, password);

		const decrypted = await nodeCryptoProvider.decrypt(encrypted, password);

		expect(bytesToString(decrypted.data)).toBe(bytesToString(plaintext));
	});
});
