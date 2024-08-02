import { typedApiAtomFamily } from "../stores/client.js";
import { useChainId_INTERNAL } from "./use-chain-id.js";
import { useAtomValue } from "jotai";
/**
 * Hook for getting Polkadot-API typed API.
 *
 * @param options - Additional options
 * @returns Polkadot-API typed API
 */
export function useTypedApi(options) {
    return useAtomValue(typedApiAtomFamily(useChainId_INTERNAL(options)));
}
