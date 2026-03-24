interface HDStrategy {
	derive(seed: any, derivePath: string): string;
}

export default HDStrategy;
