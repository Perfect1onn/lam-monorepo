import { HDStrategy } from "@lam/hd";
import { KeyPairStrategy } from "@lam/keypair";

interface NetworkConfigOptions {
	networkId: string;
	keyPairStrategy: KeyPairStrategy;
	hdStrategy: HDStrategy;
	derivationPathTemplate: string;
	addressFormat: string;
};

class NetworkConfig {
	public networkId: string;
	public keyPairStrategy: KeyPairStrategy;
	public hdStrategy: HDStrategy;
	public derivationPathTemplate: string;
	public addressFormat: string;

	constructor(options: NetworkConfigOptions) {
		this.networkId = options.networkId;
		this.keyPairStrategy = options.keyPairStrategy;
		this.hdStrategy = options.hdStrategy;
		this.derivationPathTemplate = options.derivationPathTemplate;
		this.addressFormat = options.addressFormat;
	}
}

export { type NetworkConfigOptions, NetworkConfig };
