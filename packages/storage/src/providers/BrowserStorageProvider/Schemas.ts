import { StorageNames } from '../../StorageProvider.ts';

interface Schema {
	name: StorageNames;
	keyPath: string;
	autoIncrement: boolean;
}

const schemas: Schema[] = [
	{
		name: 'seeds',
		keyPath: 'id',
		autoIncrement: true,
	},
	{
		name: 'derivationPaths',
		keyPath: 'id',
		autoIncrement: true,
	},
];

export { schemas };
