import type { StorageProvider, StorageNames, Storage } from '../../StorageProvider.ts';
import { schemas } from './Schemas.ts';
import BrowserStorage from './BrowserStorage.ts';
import { Models } from '../../models';

class BrowserStorageProvider implements StorageProvider {
	private readonly dbName = 'wallet-core-db';
	private readonly dbVersion = 1;
	private db: IDBDatabase | null = null;
	private storages: Map<StorageNames, Storage<Models>> = new Map();

	constructor() {
		if (typeof window === 'undefined') {
			throw new Error('BrowserOnlyError: this provider can only run in browser environment');
		}

		if (!window.indexedDB) {
			throw new Error('IndexedDBUnavailableError: IndexedDB API is not available');
		}
	}

	public async connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			const dbConnectionRequest = window.indexedDB.open(this.dbName, this.dbVersion);

			dbConnectionRequest.onupgradeneeded = (event) => {
				this.initStorages(dbConnectionRequest.result);
			};
			dbConnectionRequest.onsuccess = () => {
				if (this.storages.size === 0) this.initStorages(dbConnectionRequest.result);
				resolve();
			};
			dbConnectionRequest.onerror = (error) => reject(error);
		});
	}

	private initStorages(db: IDBDatabase) {
		this.db = db;
		const storeNames = db.objectStoreNames;

		schemas.forEach(({ name, ...options }) => {
			if (!storeNames.contains(name)) {
				db.createObjectStore(name, options);
			}

			const storage = new BrowserStorage({
				withStore: this.createWithStore(name),
			});

			this.storages.set(name, storage);
		});
	}

	public async close() {
		return new Promise<void>((resolve, reject) => {
			const db = this.db;

			if (!db) return reject(new Error('Not connected to DB'));

			db.close();

			this.db = null;

			resolve();
		});
	}

	public getStorage<T extends Models>(storageName: StorageNames): Storage<T> {
		const db = this.db;

		if(!db) throw new Error("Not connected to DB")

		const storage = this.storages.get(storageName);

		if (!storage) throw new Error('Storage not found');

		return storage as Storage<T>;
	}

	private createWithStore(storageName: StorageNames) {
		return <T>(mode: IDBTransaction['mode'], operation: (store: IDBObjectStore) => IDBRequest<T>) =>
			this.withStore(storageName, mode, operation);
	}

	private async withStore<T>(
		storageName: StorageNames,
		mode: IDBTransaction['mode'],
		operation: (store: IDBObjectStore) => IDBRequest<T>
	): Promise<T> {
		return new Promise((resolve, reject) => {
			const db = this.db;

			if (!db) return reject(new Error('Not connected to DB'));

			const transaction = db.transaction(storageName, mode);
			const objectStore = transaction.objectStore(storageName);

			const request = operation(objectStore);

			transaction.oncomplete = () => resolve(request.result);
			transaction.onerror = () => reject(request.error);
		});
	}
}

export default BrowserStorageProvider;
