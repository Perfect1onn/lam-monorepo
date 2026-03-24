interface CryptoProvider {
	encrypt(data: any, password: string): Promise<any>;
	decrypt(data: any, password: string): Promise<any>;
}

export { CryptoProvider };
