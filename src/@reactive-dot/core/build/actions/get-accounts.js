import { toObservable } from "../utils.js";
import { combineLatest } from "rxjs";
import { map, switchMap } from "rxjs/operators";
export function getAccounts(wallets, chainSpec) {
    return combineLatest([toObservable(wallets), toObservable(chainSpec)]).pipe(switchMap(([wallets, chainSpec]) => combineLatest(wallets.map((wallet) => wallet.accounts$.pipe(map((accounts) => accounts.map((account) => ({ ...account, wallet })))))).pipe(map((accounts) => accounts.flat()), map(chainSpec === undefined
        ? (accounts) => accounts
        : (accounts) => accounts.filter((account) => !account.genesisHash ||
            chainSpec.genesisHash.includes(account.genesisHash))))));
}
