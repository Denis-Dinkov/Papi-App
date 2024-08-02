export class Query {
    #instructions;
    constructor(instructions) {
        this.#instructions = instructions;
    }
    get instructions() {
        return Object.freeze(this.#instructions.slice());
    }
    getConstant(pallet, constant) {
        return this.#append({
            instruction: "get-constant",
            pallet,
            constant,
        });
    }
    readStorage(pallet, storage, args, options) {
        return this.#append({
            instruction: "read-storage",
            pallet,
            storage,
            args,
            at: options?.at,
        });
    }
    readStorages(pallet, storage, args, options) {
        return this.#append({
            instruction: "read-storage",
            pallet,
            storage,
            args,
            at: options?.at,
            multi: true,
        });
    }
    readStorageEntries(pallet, storage, args, options) {
        return this.#append({
            instruction: "read-storage-entries",
            pallet,
            storage,
            args,
            at: options?.at,
        });
    }
    callApi(pallet, api, args, options) {
        return this.#append({
            instruction: "call-api",
            pallet,
            api,
            args,
            at: options?.at,
        });
    }
    callApis(pallet, api, args, options) {
        return this.#append({
            instruction: "call-api",
            pallet,
            api,
            args,
            at: options?.at,
            multi: true,
        });
    }
    #append(instruction) {
        return new Query([...this.#instructions, instruction]);
    }
}
