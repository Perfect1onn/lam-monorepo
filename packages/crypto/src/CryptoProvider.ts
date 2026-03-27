interface Encrypted {
	salt: Uint8Array;
	nonce: Uint8Array;
	ciphertext: Uint8Array;
}

interface Decrypted {
	data: Uint8Array;
}

interface CryptoProvider {
	encrypt(data: Uint8Array, password: Uint8Array): Promise<Encrypted>;
	decrypt(data: Encrypted, password: Uint8Array): Promise<Decrypted>;
	generateEntropy(bytes: number): Uint8Array;
}

export { CryptoProvider, Encrypted, Decrypted };
