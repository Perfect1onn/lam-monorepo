interface Options {
	path: string;
	networkName: string;
}

class DerivationPath {
	public path: string;
	public networkName: string;

	constructor({ path, networkName }: Options) {
		this.path = path;
		this.networkName = networkName;
	}
}

export default DerivationPath;
