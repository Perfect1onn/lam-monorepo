interface KeyPairStrategy {
	generatePublicKey(privateKey: any): string;
}

export default KeyPairStrategy;
