import { walletsAtom } from "../stores/wallets.js";
import { useAsyncState } from "./use-async-state.js";
import { MutationError, PENDING, connectWallet } from "../../../core/src";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";
/**
 * Hook for connecting wallets
 *
 * @param wallets - Wallets to connect to, will connect to all available wallets if none is specified
 * @returns The wallet connection state & connect function
 */
export function useConnectWallet(wallets) {
    const hookWallets = wallets;
    const [success, setSuccess] = useAsyncState();
    const connect = useAtomCallback(useCallback(async (get, _, wallets) => {
        try {
            setSuccess(PENDING);
            const walletsToConnect = wallets ?? hookWallets ?? (await get(walletsAtom));
            await connectWallet(walletsToConnect);
            setSuccess(true);
        }
        catch (error) {
            setSuccess(MutationError.from(error));
        }
    }, [hookWallets, setSuccess]));
    return [success, connect];
}
