import { useWallets } from "./use-wallets.js";


import {
  IDLE,
  PENDING,
  type AsyncValue,
  type ReDotError,
} from "../../../core/src";
import { initializeWallets } from "../../../core/src/wallets";
import { useCallback, useState } from "react";

/**
 * Hook for reconnecting wallets.
 *
 * @returns The reconnection state and reconnect function
 */
export function useReconnectWallets() {
  const wallets = useWallets();

  const [state, setState] = useState<AsyncValue<true, ReDotError>>(IDLE);

  const reconnect = useCallback(async () => {
    setState(PENDING);
    initializeWallets(wallets);
  }, [wallets]);

  return [state, reconnect] as [
    state: typeof state,
    reconnect: typeof reconnect,
  ];
}
