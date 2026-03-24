import { CryptoProvider } from "@lam/crypto";

class HotSeedVault {
	private encryptedSeed: string;
	private decryptedSeed: any;
	private cryptoProvider: CryptoProvider;

	constructor(encryptedSeed: string, cryptoProvider: CryptoProvider) {
		this.encryptedSeed = encryptedSeed;
		this.decryptedSeed = null;
		this.cryptoProvider = cryptoProvider;
	}

	public async unlock(password: string) {
		throw new Error("Not implemented");
	}

	public async getSeed() {
		throw new Error("Not implemented");
	}

	public async lock() {
		throw new Error("Not implemented");
	}
}

export default HotSeedVault;
