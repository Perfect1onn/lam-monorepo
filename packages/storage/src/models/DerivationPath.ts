interface Options {
	path: string;
	networkName: string;
	networkId: string;
}

class DerivationPath {
	public path: string;
	public networkName: string;
	public networkId: string;

	constructor({ path, networkName, networkId }: Options) {
		this.path = path;
		this.networkName = networkName;
		this.networkId = networkId;
	}
}

export default DerivationPath;
