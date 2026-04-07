import type { Account } from '@lam/accounts';
import { type Network, NetworkPool } from '@lam/network';
import { HDKeyManager } from '@lam/hd';
import { type SeedGenerationStrategy, BIPSeedGenerationStrategy } from '@lam/seed';
import { type EnvironmentDependencies, ColdSeedVault } from '@lam/cold-vault';
import type { CryptoProvider } from '@lam/crypto';
import { DerivationPath, Seed, type StorageProvider } from '@lam/storage';
import { HotSeedVault } from '@lam/hot-vault';

class WalletCore {
	private seedGenerationStrategy: SeedGenerationStrategy;
	private coldSeedVault: ColdSeedVault;
	private hotSeedVault: HotSeedVault | null;
	private networkPool: NetworkPool;
	private hdKeyManager: HDKeyManager;
	private cryptoProvider: CryptoProvider;
	private storageProvider: StorageProvider;

	constructor(dependencies: EnvironmentDependencies) {
		this.storageProvider = dependencies.storageProvider;
		this.cryptoProvider = dependencies.cryptoProvider;

		const seedsStorage = this.storageProvider.getStorage<Seed>('seeds');

		this.coldSeedVault = new ColdSeedVault({ seedsStorage, cryptoProvider: this.cryptoProvider });
		this.hotSeedVault = null;

		this.seedGenerationStrategy = new BIPSeedGenerationStrategy(dependencies.cryptoProvider);
		this.networkPool = new NetworkPool();
		this.hdKeyManager = new HDKeyManager();
	}

	public async initializeWallet(password: string): Promise<string[]> {
		const rawSeed: Uint8Array = this.seedGenerationStrategy.generateRawSeed();
		const seedPhrase: string[] = this.seedGenerationStrategy.generateSeedPhrase(rawSeed);
		const seed: Uint8Array = this.seedGenerationStrategy.generateSeed(rawSeed);

		try {
			await this.coldSeedVault.saveSeed(seed, password);

			const encryptedSeed: Seed = await this.coldSeedVault.loadSeed();

			this.hotSeedVault = new HotSeedVault(encryptedSeed, this.cryptoProvider);

			return seedPhrase;
		} catch (e) {
			throw e;
		}
	}

	public async loadWallet(password: string) {
		if (this.hotSeedVault) return;

		try {
			const encryptedSeed: Seed = await this.coldSeedVault.loadSeed();

			this.hotSeedVault = new HotSeedVault(encryptedSeed, this.cryptoProvider);

			await this.hotSeedVault.unlock(password);

			const seed = this.hotSeedVault.getSeed();

			const derivationPathsStorage = this.storageProvider.getStorage<DerivationPath>('derivationPaths');

			const derivationPaths = await derivationPathsStorage.getAll();

			const accountCreations = derivationPaths.map((derivationPath) => {
				const network = this.networkPool.getNetworkById(derivationPath.networkId);

				if (!network) return Promise.reject(new Error('Network not found'));

				return this.executeAccountCreation(seed, network, derivationPath.path);
			});

			await Promise.allSettled(accountCreations);

			this.hotSeedVault.lock();
		} catch (e) {
			throw e;
		}
	}

	public async restoreWallet(seedPhrase: string, password: string) {
		const seed = this.seedGenerationStrategy.generateSeed(seedPhrase);

		try {
			await this.coldSeedVault.saveSeed(seed, password);
			const encryptedSeed: Seed = await this.coldSeedVault.loadSeed();

			this.hotSeedVault = new HotSeedVault(encryptedSeed, this.cryptoProvider);
		} catch (e) {
			throw e;
		}
	}

	public async lockWallet(password: string) {
		const hotSeedVault = this.hotSeedVault;

		if (!hotSeedVault) return;

		hotSeedVault.lock();
	}

	public registerNetwork(network: Network) {
		if (this.networkPool.getNetworkById(network.getNetworkId())) return;

		this.networkPool.registerNetwork(network);
	}

	private async executeAccountCreation(seed: Uint8Array, network: Network, derivePath: string) {
		const { publicKey } = this.hdKeyManager.deriveKeyPair(
			seed,
			derivePath,
			network.getHDStrategy(),
			network.getKeyPairStrategy()
		);

		const account: Account = network.createAccount(publicKey, derivePath);

		return account;
	}

	public async createAccount(networkId: string, password: string) {
		const network = this.networkPool.getNetworkById(networkId);

		if (!network) throw new Error('Network not found');

		if (!this.hotSeedVault) throw new Error('WalletCore does not loaded');

		try {
			await this.hotSeedVault.unlock(password);

			const seed = this.hotSeedVault.getSeed();

			const path = network.getDerivationPath();

			const account = await this.executeAccountCreation(seed, network, path);

			this.hotSeedVault.lock();

			const derivationPathsStorage = this.storageProvider.getStorage<DerivationPath>('derivationPaths');

			const derivationPath = new DerivationPath({
				path,
				networkName: network.getNetworkName(),
				networkId: networkId,
			});

			await derivationPathsStorage.set(derivationPath);

			return account;
		} catch (e) {
			console.log(e);
		}
	}

	public getAccounts(networkId: string): Account[] {
		const network = this.networkPool.getNetworkById(networkId);

		if (!network) throw new Error('Network not found');

		return network.getAccounts();
	}

	public getNetworks(): Network[] {
		return this.networkPool.getNetworks();
	}
}

export default WalletCore;
