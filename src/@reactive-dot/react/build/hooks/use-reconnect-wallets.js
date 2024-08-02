import { useWallets } from "./use-wallets.js";
import { IDLE, PENDING, } from "../../../core/src";
import { initializeWallets } from "../../../core/src/wallets.js";
import { useCallback, useState } from "react";
/**
 * Hook for reconnecting wallets.
 *
 * @returns The reconnection state and reconnect function
 */
export function useReconnectWallets() {
    const wallets = useWallets();
    const [state, setState] = useState(IDLE);
    const reconnect = useCallback(async () => {
        setState(PENDING);
        initializeWallets(wallets);
    }, [wallets]);
    return [state, reconnect];
}
