import { bestBlockAtomFamily, finalizedBlockAtomFamily, } from "../stores/block.js";
import { useChainId_INTERNAL } from "./use-chain-id.js";
import { useAtomValue } from "jotai";
/**
 * Hook for fetching information about the latest block.
 *
 * @param tag - Which block to target
 * @param options - Additional options
 * @returns The latest finalized or best block
 */
export function useBlock(tag = "finalized", options) {
    const chainId = useChainId_INTERNAL(options);
    return useAtomValue(tag === "finalized"
        ? finalizedBlockAtomFamily(chainId)
        : bestBlockAtomFamily(chainId));
}
