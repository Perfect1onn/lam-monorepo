import type { Account } from '@lam/accounts';
import { type Network, NetworkPool } from '@lam/network';
import { HDKeyManager } from '@lam/hd';
import { type SeedGenerationStrategy, BIPSeedGenerationStrategy } from '@lam/seed';
import { type EnviromentDependencies, ColdSeedVault } from '@lam/cold-vault';
import type { CryptoProvider } from '@lam/crypto';
import type { StorageProvider } from '@lam/storage';
import { HotSeedVault } from '@lam/hot-vault';

class WalletCore {
	private seedGenerationStrategy: SeedGenerationStrategy;
	private coldSeedVault: ColdSeedVault;
	private hotSeedVault: HotSeedVault | null;
	private networkPool: NetworkPool;
	private hdKeyManager: HDKeyManager;
	private cryptoProvider: CryptoProvider;
	private storageProvider: StorageProvider;

	constructor(dependencies: EnviromentDependencies) {
		this.seedGenerationStrategy = new BIPSeedGenerationStrategy(dependencies.cryptoProvider);
		this.coldSeedVault = new ColdSeedVault(dependencies);
		this.networkPool = new NetworkPool();
		this.hdKeyManager = new HDKeyManager();
		this.cryptoProvider = dependencies.cryptoProvider;
		this.storageProvider = dependencies.storageProvider;
		this.hotSeedVault = null;
	}

	public async initializeWallet(password: string): Promise<string[]> {
		const rawSeed = this.seedGenerationStrategy.generateRawSeed();
		const seedPhrase: string[] = this.seedGenerationStrategy.generateSeedPhrase(rawSeed);
		const seed = this.seedGenerationStrategy.generateSeed(rawSeed);

		try {
			await this.coldSeedVault.saveSeed(seed, password);
			const encryptedSeed: string = await this.coldSeedVault.loadSeed(password);

			this.hotSeedVault = new HotSeedVault(encryptedSeed, this.cryptoProvider);

			return seedPhrase;
		} catch (e) {
			throw e;
		}
	}

	public async loadWallet(password: string) {
		if (this.hotSeedVault) return;

		try {
			const encryptedSeed: string = await this.coldSeedVault.loadSeed(password);

			this.hotSeedVault = new HotSeedVault(encryptedSeed, this.cryptoProvider);

			/*
				initAccounts by first 10 derives path
		 	*/
		} catch (e) {
			throw e;
		}
	}

	public async restoreWallet(seedPhrase: string, password: string) {
		const seed = this.seedGenerationStrategy.generateSeed(seedPhrase);

		try {
			await this.coldSeedVault.saveSeed(seed, password);
			const encryptedSeed: string = await this.coldSeedVault.loadSeed(password);

			this.hotSeedVault = new HotSeedVault(encryptedSeed, this.cryptoProvider);

			/*
				initAccounts by first 10 derives paths
		 	*/
		} catch (e) {
			throw e;
		}
	}

	public async lockWallet(password: string) {
		if (!this.hotSeedVault) throw new Error();
		/*
			here must be CheckSumVerifier usage part
	 	*/
		await this.hotSeedVault.lock();
	}

	public registerNetwork(network: Network) {
		if (this.networkPool.getNetworkById(network.getNetworkId())) return;

		this.networkPool.registerNetwork(network);
	}

	public async createAccount(networkId: string, password: string) {
		const network = this.networkPool.getNetworkById(networkId);

		if (!network) throw new Error();
		if (!this.hotSeedVault) throw new Error();

		try {
			await this.hotSeedVault.unlock(password);

			const seed = await this.hotSeedVault.getSeed();

			const { publicKey } = this.hdKeyManager.deriveKeyPair(
				seed,
				'44/0/0/0/1',
				network.getHDStrategy(),
				network.getKeyPairStrategy()
			);
			const account: Account = network.createAccount(publicKey, '44/0/0/0/1');

			this.hotSeedVault.lock();

			return account;
		} catch (e) {
			console.log(e);
		}
	}

	public getAccounts(networkId: string): Account[] {
		const network = this.networkPool.getNetworkById(networkId);

		if (!network) throw new Error('');

		return network.getAccounts();
	}

	public getNetworks(): Network[] {
		return this.networkPool.getNetworks();
	}
}

export default WalletCore;
