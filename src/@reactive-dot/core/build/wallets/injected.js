import { ReDotError } from "../errors.js";
import { Wallet } from "./wallet.js";
import { connectInjectedExtension, } from "polkadot-api/pjs-signer";
import { BehaviorSubject, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
export class InjectedWallet extends Wallet {
    name;
    #extension$ = new BehaviorSubject(undefined);
    get id() {
        return `injected/${this.name}`;
    }
    constructor(name, options) {
        super(options);
        this.name = name;
    }
    async initialize() {
        if (this.storage.getItem("connected") !== null) {
            await this.connect();
        }
    }
    connected$ = this.#extension$.pipe(map((extension) => extension !== undefined));
    async connect() {
        if (this.#extension$.getValue() === undefined) {
            this.#extension$.next(await connectInjectedExtension(this.name));
            this.storage.setItem("connected", JSON.stringify(true));
        }
    }
    disconnect() {
        this.#extension$.getValue()?.disconnect();
        this.#extension$.next(undefined);
        this.storage.removeItem("connected");
    }
    accounts$ = this.#extension$.pipe(switchMap((extension) => new Observable((subscriber) => {
        if (extension === undefined) {
            subscriber.next([]);
        }
        else {
            subscriber.next(extension.getAccounts());
            subscriber.add(extension.subscribe((accounts) => subscriber.next(accounts)));
        }
    })));
    getAccounts() {
        const extension = this.#extension$.getValue();
        if (extension === undefined) {
            throw new ReDotError("Extension is not connected");
        }
        return extension.getAccounts();
    }
}
