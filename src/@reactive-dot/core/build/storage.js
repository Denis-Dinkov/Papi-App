export class PrefixedStorage {
    prefix;
    #storage;
    constructor(options) {
        this.prefix = options.prefix;
        this.#storage = options.storage;
    }
    getItem(key) {
        return this.#storage.getItem(this.#prefixKey(key));
    }
    removeItem(key) {
        return this.#storage.removeItem(this.#prefixKey(key));
    }
    setItem(key, value) {
        return this.#storage.setItem(this.#prefixKey(key), value);
    }
    join(path) {
        return new PrefixedStorage({
            prefix: `${this.prefix}/${path}`,
            storage: this.#storage,
        });
    }
    #prefixKey(key) {
        return `${this.prefix}/${key}`;
    }
}
export const defaultStorage = new PrefixedStorage({
    prefix: "@reactive-dot",
    storage: globalThis.localStorage,
});
