import HDStrategy from './HDStrategy';
import { KeyPairStrategy } from '@lam/keypair';

class HDKeyManager {
	public derivePrivateKey(seed: any, derivePath: string, hdStrategy: HDStrategy) {
		return hdStrategy.derive(seed, derivePath);
	}

	public deriveKeyPair(seed: any, derivePath: string, hdStrategy: HDStrategy, keyPairStrategy: KeyPairStrategy) {
		const privateKey = hdStrategy.derive(seed, derivePath);
		const publicKey = keyPairStrategy.generatePublicKey(privateKey);

		return { publicKey, privateKey };
	}
}

export default HDKeyManager;
