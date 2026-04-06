interface Options {
	seed: Uint8Array;
	salt: Uint8Array;
	nonce: Uint8Array;
}

class Seed {
	public seed: Uint8Array;
	public salt: Uint8Array;
	public nonce: Uint8Array;

	constructor({ seed, salt, nonce }: Options) {
		this.seed = seed;
		this.salt = salt;
		this.nonce = nonce;
	}
}

export default Seed;
