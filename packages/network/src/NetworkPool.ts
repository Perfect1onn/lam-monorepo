import Network from "./Network";

class NetworkPool {
	private networks: Map<string, Network>;

	constructor() {
		this.networks = new Map<string, Network>();
	}

	public getNetworkById(id: string) {
		return this.networks.get(id);
	}

	public getNetworks() {
		return [...this.networks.values()];
	}

	public registerNetwork(network: Network) {
		const networkId = network.getNetworkId();

		if (this.getNetworkById(networkId)) throw new Error("Network already exists");

		this.networks.set(networkId, network);
	}
}

export default NetworkPool;
