import type { CryptoProvider } from "@lam/crypto";
import type { StorageProvider } from "@lam/storage";

interface EnviromentDependencies {
	cryptoProvider: CryptoProvider;
	storageProvider: StorageProvider;
}

class ColdSeedVault {
	private cryptoProvider: CryptoProvider;
	private storageProvider: StorageProvider;

	constructor(dependencies: EnviromentDependencies) {
		this.cryptoProvider = dependencies.cryptoProvider;
		this.storageProvider = dependencies.storageProvider;
	}

	public async loadSeed(password: string): Promise<string> {
		throw new Error("Not implemented");
	}

	public async saveSeed(seed: any, password: string) {
		throw new Error("Not implemented");
	}
}

export { type EnviromentDependencies, ColdSeedVault };
