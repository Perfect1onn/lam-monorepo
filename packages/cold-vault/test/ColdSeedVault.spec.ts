// @vitest-environment jsdom

/* needed build this packages to run tests:
    - @lam/storage
    - @lam/crypto
    - @lam/utils
*/

import { BrowserStorageProvider, Seed } from '@lam/storage';
import { BrowserCryptoProvider } from '@lam/crypto';
import { describe, expect, it } from 'vitest';
import { setup } from 'vitest-indexeddb';
import { ColdSeedVault, ColdSeedVaultOptions } from '../src';
import { bytesToHex, stringToBytes } from '@lam/utils';

setup();

describe('ColdSeedVault', async () => {
	const browserStorageProvider = new BrowserStorageProvider();
	await browserStorageProvider.connect();
	const seedsStorage = browserStorageProvider.getStorage<Seed>('seeds');

	const browserCryptoProvider = new BrowserCryptoProvider();

	const coldSeedVaultOptions: ColdSeedVaultOptions = {
		seedsStorage: seedsStorage,
		cryptoProvider: browserCryptoProvider,
	};

	const coldSeedVault = new ColdSeedVault(coldSeedVaultOptions);

	const seed = browserCryptoProvider.generateEntropy(64);
	const password = 'secure-password';

	it('exceptions check', () => {
		expect(async () => coldSeedVault.loadSeed()).rejects.toThrow(new Error('Seed not found'));
	});

	it('save/load seed', async () => {
		await coldSeedVault.saveSeed(seed, password);

		const encryptedSeed = await coldSeedVault.loadSeed();

		const decryptedSeed = await browserCryptoProvider.decrypt(
			{
				salt: encryptedSeed.salt,
				nonce: encryptedSeed.nonce,
				ciphertext: encryptedSeed.seed,
			},
			stringToBytes(password)
		);

		expect(bytesToHex(seed)).toBe(bytesToHex(decryptedSeed.data));
	});
});
