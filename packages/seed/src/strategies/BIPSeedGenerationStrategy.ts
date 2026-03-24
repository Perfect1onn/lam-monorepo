import SeedGenerationStrategy from "../SeedGenerationStrategy";

class BIPSeedGenerationStrategy implements SeedGenerationStrategy {
	private generateEntropy() {
		throw new Error("Not implemented");
	}

	public generateRawSeed() {
		throw new Error("Not implemented");
	}

	public generateSeed(seedPhrase: string[]): any;
	public generateSeed(rawSeed: any): any;
	public generateSeed(undefSeed: string[] | number) {
		throw new Error("Not implemented");
	}

	generateSeedPhrase(rawSeed: any): string[] {
		throw new Error("Not implemented");
	}
}

export default BIPSeedGenerationStrategy;
