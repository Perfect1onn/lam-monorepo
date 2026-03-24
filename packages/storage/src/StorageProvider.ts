interface StorageProvider {
	get(key: string): Promise<any>;
	set(key: string, data: any): Promise<any>;
	remove(key: string): Promise<any>;
}

export { StorageProvider };
