// @vitest-environment jsdom

/* needed build this packages to run tests:
    - @lam/crypto
*/
import { BrowserCryptoProvider } from '@lam/crypto';
import { HotSeedVault } from '../src/index.ts';
import { describe, expect, it } from 'vitest';
import { bytesToHex, hexToBytes, isZeroBytes } from '@lam/utils';

describe('HotSeedVault', () => {
	const hexSeed =
		'485baf62f8d05ce5c92f946d9fe1f9afaa96a7d4b6a98caaa92da4157439674dfb4acdd82b4ec970017f039c83ce060045d779d26c3e8af6d7c3e16f8ca65d23';

	const hexSeedEncrypted =
		'dee12fcb87f582c13167a9c84dbe6dd4b62134946b735856686eb4162002d9374797cab29ba6d0df5114ec7a49ad11510fde924552d7d28de14cfebd0c85b53f87011f89db6b63ac51d659cf78f84eea';
	const hexNonce = '452813ad343cb6e44a1045af';
	const hexSalt = 'bef70b45e3f765cd657bff3fe4dedf86cd65af2306bd151dee3c132166eb7bf3';

	const password = 'secure-password';

	const encryptedSeed = {
		seed: hexToBytes(hexSeedEncrypted),
		salt: hexToBytes(hexSalt),
		nonce: hexToBytes(hexNonce),
	};

	const browserCryptoProvider = new BrowserCryptoProvider();

	const hotSeedVault = new HotSeedVault(encryptedSeed, browserCryptoProvider);

	it('exceptions check', () => {
		expect(() => hotSeedVault.getSeed()).toThrow(new Error('HotSeedVault does not unlocked'));
	});

	it('unlock/get/lock', async () => {
		await hotSeedVault.unlock(password);

		const seed = hotSeedVault.getSeed();

		expect(bytesToHex(seed)).toBe(hexSeed);

		hotSeedVault.lock();

		expect(isZeroBytes(seed)).toBe(true);

		expect(() => hotSeedVault.getSeed()).toThrow(new Error('HotSeedVault does not unlocked'));
	});
});
