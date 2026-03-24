interface TransactionOptions {
	to: string;
	amount: string;
	from: string;
}

class Transaction {
	public from: string;
	public to: string;
	public amount: string;

	constructor(options: TransactionOptions) {
		this.from = options.from;
		this.to = options.to;
		this.amount = options.amount;
	}
}

export { Transaction, TransactionOptions };
