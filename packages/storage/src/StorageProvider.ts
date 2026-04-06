import { Models } from './models';

type StorageNames = 'seeds' | 'derivationPaths';

type withId<T> = T & { id: number };

interface Storage<T extends Models> {
	get(id: number): Promise<withId<T> | undefined>;
	getAll(): Promise<withId<T>[]>;
	set(data: T): Promise<void>;
	remove(id: number): Promise<void>;
	removeAll(): Promise<void>;
}

interface StorageProvider {
	connect(): Promise<void>;
	getStorage<T extends Models>(storageName: StorageNames): Storage<T>;
	close(): Promise<void>;
}

export { StorageProvider, Storage, StorageNames, withId };
