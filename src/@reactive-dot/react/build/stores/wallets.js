import { aggregateWallets, getConnectedWallets } from "../../../core/src";
import { atom } from "jotai";
import { atomWithObservable } from "jotai/utils";
export const aggregatorsAtom = atom([]);
const aggregatorWallets = atomWithObservable((get) => aggregateWallets(get(aggregatorsAtom)));
export const directWalletsAtom = atom([]);
export const walletsAtom = atom(async (get) => [
    ...get(directWalletsAtom),
    ...(await get(aggregatorWallets)),
]);
export const connectedWalletsAtom = atomWithObservable((get) => getConnectedWallets(get(walletsAtom)));
