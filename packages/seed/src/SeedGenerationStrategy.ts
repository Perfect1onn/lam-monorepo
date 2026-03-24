interface SeedGenerationStrategy {
	generateRawSeed(): any;
	generateSeedPhrase(rawSeed: any): string[];
	generateSeed(rawSeed: any): any;
	generateSeed(seedPhrase: string[]): any;
}

export default SeedGenerationStrategy;
