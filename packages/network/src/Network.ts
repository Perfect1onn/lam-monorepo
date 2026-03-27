import type { Account } from '@lam/accounts';
import { NetworkConfig } from './NetworkConfig';
import { Transaction } from '@lam/transaction';
import { HDStrategy } from '@lam/hd';
import { KeyPairStrategy } from '@lam/keypair';

class Network {
	private accounts: Map<string, Account>;
	private config: NetworkConfig;

	constructor(config: NetworkConfig) {
		this.accounts = new Map<string, Account>();
		this.config = Object.freeze(config);
	}

	public getNetworkId() {
		return this.config.networkId;
	}

	public getAccounts() {
		return [...this.accounts.values()];
	}

	public getAccountByAddress(address: string) {
		return this.accounts.get(address);
	}

	public getKeyPairStrategy(): KeyPairStrategy {
		return this.config.keyPairStrategy;
	}

	public getHDStrategy(): HDStrategy {
		return this.config.hdStrategy;
	}

	public createAccount(publicKey: string, derivePath: string): Account {
		throw new Error('Not implemented');
	}

	public signTransaction(transaction: Transaction, privateKey: string) {
		throw new Error('Not implemented');
	}
}

export default Network;
