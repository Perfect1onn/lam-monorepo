// @vitest-environment jsdom
import { BrowserCryptoProvider } from '../src/index.ts';
import { describe, it, expect } from 'vitest';
// needed build @lam/utils before run tests;
import { bytesToString, stringToBytes } from '@lam/utils';

describe('BrowserCryptoProvider', () => {
	const browserCryptoProvider = new BrowserCryptoProvider();

	it('generate entropy', () => {
		const a = browserCryptoProvider.generateEntropy(16);
		const b = browserCryptoProvider.generateEntropy(16);

		expect(a).not.toEqual(b);
	});

	it('encrypt -> decrypt', async () => {
		const plaintext = stringToBytes('hello');
		const password = stringToBytes('secure-password');
		const encrypted = await browserCryptoProvider.encrypt(plaintext, password);

		const decrypted = await browserCryptoProvider.decrypt(encrypted, password);

		expect(bytesToString(decrypted.data)).toBe(bytesToString(plaintext));
	});
});
