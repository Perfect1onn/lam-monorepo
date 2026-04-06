import type { CryptoProvider } from '@lam/crypto';
import {Seed, Storage, StorageProvider} from '@lam/storage';

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

	public async loadSeed(password: string): Promise<string> {
		throw new Error('Not implemented');
	}

	public async saveSeed(seed: any, password: string) {
		throw new Error('Not implemented');
	}
}

export { type EnvironmentDependencies, ColdSeedVault };
