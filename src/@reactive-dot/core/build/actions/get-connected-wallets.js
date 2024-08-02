import { toObservable } from "../utils.js";
import { combineLatest } from "rxjs";
import { map, switchMap } from "rxjs/operators";
export function getConnectedWallets(wallets) {
    return toObservable(wallets).pipe(switchMap((wallets) => combineLatest(wallets.map((wallet) => wallet.connected$.pipe(map((connected) => [wallet, connected]))))), map((wallets) => wallets.filter(([_, connected]) => connected).map(([wallet]) => wallet)));
}
