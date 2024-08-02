import { InjectedWallet } from "../injected.js";
import { WalletAggregator } from "./aggregator.js";
import { getInjectedExtensions } from "polkadot-api/pjs-signer";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
export class InjectedWalletAggregator extends WalletAggregator {
    #walletOptions;
    constructor(options) {
        super();
        this.#walletOptions = options;
    }
    #walletMap$ = new BehaviorSubject(new Map());
    wallets$ = this.#walletMap$.pipe(map((walletMap) => Array.from(walletMap.values())));
    scan() {
        const injectedNames = getInjectedExtensions() ?? [];
        const current = new Map(this.#walletMap$.value);
        for (const name of injectedNames) {
            if (!current.has(name)) {
                current.set(name, new InjectedWallet(name, this.#walletOptions));
            }
        }
        this.#walletMap$.next(current);
        return Array.from(current.values());
    }
}
