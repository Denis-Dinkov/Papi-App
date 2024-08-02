import { clientAtomFamily } from "../stores/client.js";
import { useChainId_INTERNAL } from "./use-chain-id.js";
import { useAtomValue } from "jotai";
/**
 * Hook for getting Polkadot-API client instance.
 *
 * @param options - Additional options
 * @returns Polkadot-API client
 */
export function useClient(options) {
    return useAtomValue(clientAtomFamily(useChainId_INTERNAL(options)));
}
