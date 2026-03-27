import { CryptoProvider, Decrypted, Encrypted } from '../CryptoProvider';
import crypto from 'crypto';
import { KEY_SIZE, NONCE_SIZE, SALT_SIZE } from './constants.ts';
import { argon2idAsync } from '@noble/hashes/argon2.js';
import { sliceBytes } from '@lam/utils';

class NodeCryptoProvider implements CryptoProvider {
	private readonly ALGORITHM_NAME = 'aes-256-gcm';

	public generateEntropy(bytes: number): Uint8Array {
		return crypto.randomBytes(bytes);
	}

	private async deriveKey(salt: Uint8Array, password: Uint8Array) {
		return await argon2idAsync(password, salt, {
			m: 1 << 16,
			t: 3,
			p: 2,
			dkLen: KEY_SIZE,
		});
	}

	public async encrypt(data: Uint8Array, password: Uint8Array): Promise<Encrypted> {
		const salt = this.generateEntropy(SALT_SIZE);
		const key = await this.deriveKey(salt, password);
		const nonce = this.generateEntropy(NONCE_SIZE);

		const cipher = crypto.createCipheriv(this.ALGORITHM_NAME, key, nonce);
		const ciphertext = new Uint8Array([...cipher.update(data), ...cipher.final(), ...cipher.getAuthTag()]);

		return {
			ciphertext: ciphertext,
			nonce,
			salt,
		};
	}

	public async decrypt(data: Encrypted, password: Uint8Array): Promise<Decrypted> {
		const { ciphertext, salt, nonce } = data;
		const key = await this.deriveKey(salt, password);
		const [cipherTextWihoutTag, tag] = [
			sliceBytes(ciphertext, 0, ciphertext.length - 16),
			sliceBytes(ciphertext, ciphertext.length - 16),
		];

		const decipher = crypto.createDecipheriv(this.ALGORITHM_NAME, key, nonce);

		decipher.setAuthTag(tag);

		return {
			data: new Uint8Array([...decipher.update(cipherTextWihoutTag), ...decipher.final()]),
		};
	}
}

export default NodeCryptoProvider;
