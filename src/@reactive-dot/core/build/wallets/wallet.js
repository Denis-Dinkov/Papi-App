import { defaultStorage } from "../storage.js";
export class Wallet {
    #storage;
    get storage() {
        return this.#storage.join(this.id);
    }
    constructor(options) {
        this.#storage = (options?.storage ?? defaultStorage).join("wallet");
    }
}
