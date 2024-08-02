import { getQueryInstructionPayloadAtoms, queryPayloadAtomFamily, } from "../stores/query.js";
import { flatHead, stringify } from "../utils/vanilla.js";
import { useChainId_INTERNAL } from "./use-chain-id.js";
import { IDLE, Query, } from "../../../core/src";
import { atom, useAtomValue } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useCallback, useMemo } from "react";
/**
 * Hook for refreshing cached query.
 *
 * @param builder - The function to create the query
 * @param options - Additional options
 * @returns The function to refresh the query
 */
export function useQueryRefresher(builder, options) {
    const chainId = useChainId_INTERNAL(options);
    const refresh = useAtomCallback(useCallback((_, set) => {
        if (!builder) {
            return;
        }
        const query = builder(new Query([]));
        if (!query) {
            return;
        }
        const atoms = getQueryInstructionPayloadAtoms(chainId, query).flat();
        for (const atom of atoms) {
            if ("write" in atom) {
                set(atom);
            }
        }
    }, [builder, chainId]));
    return refresh;
}
/**
 * Hook for querying data from chain, returning the response & a refresher function.
 *
 * @param builder - The function to create the query
 * @param options - Additional options
 * @returns The data response & a function to refresh it
 */
export function useLazyLoadQueryWithRefresh(builder, options) {
    const chainId = useChainId_INTERNAL(options);
    const query = useMemo(() => (!builder ? undefined : builder(new Query([]))), [builder]);
    const hashKey = useMemo(() => (!query ? query : stringify(query.instructions)), [query]);
    const rawData = useAtomValue(useMemo(() => !query
        ? atom(IDLE)
        : queryPayloadAtomFamily({
            chainId,
            query,
        }), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hashKey]));
    const data = useMemo(() => query && query.instructions.length === 1 ? flatHead(rawData) : rawData, [query, rawData]);
    const refresh = useQueryRefresher(builder, options);
    return [
        // @ts-expect-error complex type
        data,
        refresh,
    ];
}
/**
 * Hook for querying data from chain, and returning the response.
 *
 * @param builder - The function to create the query
 * @param options - Additional options
 * @returns The data response
 */
export function useLazyLoadQuery(builder, options) {
    const [data] = useLazyLoadQueryWithRefresh(builder, options);
    return data;
}
