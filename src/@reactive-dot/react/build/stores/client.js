import { chainConfigsAtom } from "./config.js";
import { getClient, ReDotError } from "../../../core/src";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
export const clientAtomFamily = atomFamily((chainId) => atom(async (get) => {
    const chainConfig = get(chainConfigsAtom)[chainId];
    if (chainConfig === undefined) {
        throw new ReDotError(`No config provided for ${chainId}`);
    }
    return getClient(chainConfig);
}));
export const chainSpecDataAtomFamily = atomFamily((chainId) => atom(async (get) => {
    const client = await get(clientAtomFamily(chainId));
    return client.getChainSpecData();
}));
export const typedApiAtomFamily = atomFamily((chainId) => atom(async (get) => {
    const config = get(chainConfigsAtom)[chainId];
    if (config === undefined) {
        throw new ReDotError(`No config provided for chain ${chainId}`);
    }
    const client = await get(clientAtomFamily(chainId));
    return client.getTypedApi(config.descriptor);
}));
