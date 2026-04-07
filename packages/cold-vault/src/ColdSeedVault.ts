import type { CryptoProvider } from '@lam/crypto';
import { Seed, Storage, StorageProvider } from '@lam/storage';
import { stringToBytes } from '@lam/utils';

interface EnvironmentDependencies {
	cryptoProvider: CryptoProvider;
	storageProvider: StorageProvider;
}

interface ColdSeedVaultOptions {
	cryptoProvider: CryptoProvider;
	seedsStorage: Storage<Seed>;
}

class ColdSeedVault {
	private cryptoProvider: CryptoProvider;
	private seedsStorage: Storage<Seed>;

	constructor(dependencies: ColdSeedVaultOptions) {
		this.cryptoProvider = dependencies.cryptoProvider;
		this.seedsStorage = dependencies.seedsStorage;
	}

	public async loadSeed(): Promise<Seed> {
		try {
			const encryptedSeed = await this.seedsStorage.get(1);

			if (!encryptedSeed) throw new Error('Seed not found');

			return encryptedSeed;
		} catch (error) {
			throw error;
		}
	}

	public async saveSeed(seed: Uint8Array, password: string) {
		const passwordBytes = stringToBytes(password);

		try {
			const encrypted = await this.cryptoProvider.encrypt(seed, passwordBytes);

			const seedModel = new Seed({
				nonce: encrypted.nonce,
				salt: encrypted.salt,
				seed: encrypted.ciphertext,
			});

			await this.seedsStorage.set(seedModel);
		} catch (error) {
			throw error;
		}
	}
}

export { type EnvironmentDependencies, type ColdSeedVaultOptions, ColdSeedVault };
