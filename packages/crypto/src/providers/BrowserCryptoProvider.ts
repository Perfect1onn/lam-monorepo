import { CryptoProvider, Decrypted, Encrypted } from '../CryptoProvider';
import { KEY_SIZE, NONCE_SIZE, SALT_SIZE } from './constants.ts';
import { argon2idAsync } from '@noble/hashes/argon2.js';

class BrowserCryptoProvider implements CryptoProvider {
	private crypto: Crypto;

	constructor() {
		if (typeof window === 'undefined') {
			throw new Error('BrowserOnlyError: this provider can only run in browser environment');
		}

		if (!window.crypto || typeof window.crypto.getRandomValues !== 'function') {
			throw new Error('CryptoUnavailableError: Web Crypto API is not available');
		}

		this.crypto = window.crypto;
	}

	public generateEntropy(bytes: number): Uint8Array {
		const buffer = new Uint8Array(bytes);

		return this.crypto.getRandomValues(buffer);
	}

	private async deriveKey(salt: Uint8Array, password: Uint8Array) {
		const rawKey = await argon2idAsync(password, salt, {
			m: 1 << 16,
			t: 3,
			p: 2,
			dkLen: KEY_SIZE,
		});

		// @ts-ignore
		return await this.crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM', length: KEY_SIZE << 3 }, false, [
			'encrypt',
			'decrypt',
		]);
	}

	public async encrypt(data: Uint8Array, password: Uint8Array): Promise<Encrypted> {
		const salt = this.generateEntropy(SALT_SIZE);
		const key = await this.deriveKey(salt, password);
		const nonce = this.generateEntropy(NONCE_SIZE);

		const encrypted = new Uint8Array(
			await crypto.subtle.encrypt(
				{
					name: 'AES-GCM',
					// @ts-ignore
					iv: nonce,
					tagLength: 128,
				},
				key,
				data
			)
		);

		return {
			salt,
			nonce,
			ciphertext: encrypted,
		};
	}

	public async decrypt(data: Encrypted, password: Uint8Array): Promise<Decrypted> {
		const { salt, nonce, ciphertext } = data;
		const key = await this.deriveKey(salt, password);

		const decrypted = await this.crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				// @ts-ignore
				iv: nonce,
				tagLength: 128,
			},
			key,
			ciphertext
		);

		return {
			data: new Uint8Array(decrypted),
		};
	}
}

export default BrowserCryptoProvider;
