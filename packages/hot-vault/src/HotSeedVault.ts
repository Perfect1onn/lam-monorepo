import { CryptoProvider, Decrypted, Encrypted } from '@lam/crypto';
import { Seed } from '@lam/storage';
import { stringToBytes } from '@lam/utils';

class HotSeedVault {
	private encryptedSeed: Encrypted;
	private decryptedSeed: Decrypted | null;
	private cryptoProvider: CryptoProvider;

	constructor(encryptedSeed: Seed, cryptoProvider: CryptoProvider) {
		this.encryptedSeed = {
			salt: encryptedSeed.salt,
			nonce: encryptedSeed.nonce,
			ciphertext: encryptedSeed.seed,
		};
		this.decryptedSeed = null;
		this.cryptoProvider = cryptoProvider;
	}

	public async unlock(password: string) {
		const passwordBytes = stringToBytes(password);

		try {
			this.decryptedSeed = await this.cryptoProvider.decrypt(this.encryptedSeed, passwordBytes);
		} catch (error) {
			throw error;
		}
	}

	public getSeed() {
		const decryptedSeed = this.decryptedSeed;

		if (!decryptedSeed) throw new Error('HotSeedVault does not unlocked');

		return decryptedSeed.data;
	}

	public lock() {
		const decryptedSeed = this.decryptedSeed;

		if (!decryptedSeed) return;

		decryptedSeed.data.fill(0);

		this.decryptedSeed = null;
	}
}

export default HotSeedVault;
