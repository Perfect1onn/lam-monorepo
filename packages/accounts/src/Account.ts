class Account {
	private derivePath: string;
	private publicKey: string;
	private address: string;

	constructor(derivePath: string, publicKey: string, address: string) {
		this.derivePath = derivePath;
		this.publicKey = publicKey;
		this.address = address;
	}

	public getDerivePath() {
		return this.derivePath;
	}

	public getPublicKey() {
		return this.publicKey;
	}

	public getAddress() {
		return this.address;
	}
}

export default Account;
