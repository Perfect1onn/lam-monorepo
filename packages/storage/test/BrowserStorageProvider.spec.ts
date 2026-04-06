// @vitest-environment jsdom
import { BrowserStorageProvider } from '../src/index.ts';
import {describe, expect, it} from "vitest";
import { setup } from "vitest-indexeddb";
import BrowserStorage from "../src/providers/BrowserStorageProvider/BrowserStorage.ts";
import {DerivationPath, Seed} from "../src";

setup();

describe('BrowserCryptoProvider', () => {
    it('expections check', async () => {
        const browserStorageProvider = new BrowserStorageProvider();

        expect(() => browserStorageProvider.getStorage('seeds')).toThrow(new Error("Not connected to DB"));
        expect(async () => browserStorageProvider.close()).rejects.toThrow(new Error("Not connected to DB"));

        await browserStorageProvider.connect();

        expect(() => browserStorageProvider.getStorage('randomvalue' as any)).toThrow(new Error("Storage not found"));

        const seedStorage = browserStorageProvider.getStorage<Seed>("seeds")
        const derivationPathsStorage = browserStorageProvider.getStorage<DerivationPath>("derivationPaths");

        expect(seedStorage).instanceOf(BrowserStorage);
        expect(derivationPathsStorage).instanceOf(BrowserStorage);

        await browserStorageProvider.close();

        expect(async () => seedStorage.getAll()).rejects.toThrow(new Error("Not connected to DB"))

        indexedDB.deleteDatabase('wallet-core-db');
    })

    it('create db', async () => {
        const browserStorageProvider = new BrowserStorageProvider();

        await browserStorageProvider.connect()

        const databases = await indexedDB.databases();
        expect(databases.length).toBe(1);
        expect(databases[0].name).toBe("wallet-core-db");
    });

    it('reinit db', async () => {
        const browserStorageProvider = new BrowserStorageProvider();

        await browserStorageProvider.connect()

        const seedStorage = browserStorageProvider.getStorage<Seed>("seeds");
        const derivationPathsStorage = browserStorageProvider.getStorage<DerivationPath>("derivationPaths");

        expect(seedStorage).instanceOf(BrowserStorage);
        expect(derivationPathsStorage).instanceOf(BrowserStorage)
    });

    it('storage (set/get/getAll/remove/removeAll)', async () => {
        const browserStorageProvider = new BrowserStorageProvider();

        await browserStorageProvider.connect()

        const seedStorage = browserStorageProvider.getStorage<Seed>("seeds");

        const seed = new Seed({
            seed: new Uint8Array(),
            salt: new Uint8Array(),
            nonce: new Uint8Array()
        })

        await seedStorage.set(seed);
        await seedStorage.set(seed);

        const seedDTO = await seedStorage.get(1);
        const notExistSeedDTO = await seedStorage.get(21312);

        expect(notExistSeedDTO).toBe(undefined);

        if(!seedDTO) throw new Error("seedDTO does not exist");

        const seeds = await seedStorage.getAll();

        expect(seeds.length).toBe(2);


        await seedStorage.remove(1);

        const seedsAfterRemove = await seedStorage.getAll();

        expect(seedsAfterRemove.length).toBe(1);

        const seedAfterRemove = await seedStorage.get(1);

        expect(seedAfterRemove).toBe(undefined);


        await seedStorage.removeAll();

        const seedsAfterRemoveAll = await seedStorage.getAll();

        expect(seedsAfterRemoveAll.length).toBe(0);
    });
});