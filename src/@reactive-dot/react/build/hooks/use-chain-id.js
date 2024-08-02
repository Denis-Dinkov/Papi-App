import { ChainIdContext } from "../contexts/index.js";
import { ReDotError } from "../../../core/src";
import { useContext } from "react";
/**
 * Hook for getting the current chain ID.
 *
 * @param options - Additional options
 * @returns
 */
export function useChainId(options) {
    const chainId = useContext(ChainIdContext);
    if (chainId === undefined) {
        throw new ReDotError("No chain ID provided");
    }
    if (options?.allowlist?.includes(chainId) === false) {
        throw new ReDotError("Chain ID not allowed", { cause: chainId });
    }
    if (options?.denylist?.includes(chainId)) {
        throw new ReDotError("Chain ID denied", { cause: chainId });
    }
    return chainId;
}
export function useChainId_INTERNAL(options) {
    const contextChainId = useContext(ChainIdContext);
    const chainId = options?.chainId ?? contextChainId;
    if (chainId === undefined) {
        throw new ReDotError("No chain ID provided");
    }
    return chainId;
}
