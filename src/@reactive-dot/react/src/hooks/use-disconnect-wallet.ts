import { walletsAtom } from "../stores/wallets.js";
import { useAsyncState } from "./use-async-state.js";
import { MutationError, PENDING, disconnectWallet } from "../../../core/src";
import type { Wallet } from "../../../core/src/wallets";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";

/**
 * Hook for disconnecting wallets
 *
 * @param wallets - Wallets to disconnect from, will disconnect from all connected wallets if none is specified
 * @returns The wallet disconnection state & disconnect function
 */
export function useDisconnectWallet(wallets?: Wallet | Wallet[]) {
  const hookWallets = wallets;

  const [success, setSuccess] = useAsyncState<true>();

  const disconnect = useAtomCallback(
    useCallback(
      async (get, _, wallets?: Wallet | Wallet[]) => {
        try {
          setSuccess(PENDING);
          const walletsToDisconnect =
            wallets ?? hookWallets ?? (await get(walletsAtom));
          await disconnectWallet(walletsToDisconnect);
          setSuccess(true);
        } catch (error) {
          setSuccess(MutationError.from(error));
        }
      },
      [hookWallets, setSuccess],
    ),
  );

  return [success, disconnect] as [
    success: typeof success,
    disconnect: typeof disconnect,
  ];
}
