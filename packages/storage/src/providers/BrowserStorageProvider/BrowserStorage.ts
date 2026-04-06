import { Storage, withId } from '../../StorageProvider.ts';
import { Models } from '../../models';

interface BrowserStorageOptions {
	withStore<T>(mode: IDBTransaction['mode'], operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T>;
}

class BrowserStorage<T extends Models> implements Storage<T> {
	private readonly withStore: BrowserStorageOptions['withStore'];

	constructor({ withStore }: BrowserStorageOptions) {
		this.withStore = withStore;
	}

	public async set(data: T): Promise<void> {
		return this.withStore('readwrite', (store) => {
			return store.add(data) as IDBRequest;
		});
	}

	public async get(id: number): Promise<withId<T> | undefined> {
		return this.withStore('readonly', (store) => {
			return store.get(id);
		});
	}

	public async getAll(): Promise<withId<T>[]> {
		return this.withStore('readonly', (store) => {
			return store.getAll();
		});
	}

	public async remove(id: number): Promise<void> {
		return this.withStore('readwrite', (store) => {
			return store.delete(id);
		});
	}

	public async removeAll(): Promise<void> {
		return this.withStore('readwrite', (store) => {
			return store.clear();
		});
	}
}

export default BrowserStorage;
