import type { ChainId } from "../../../core/src";

export type ChainHookOptions<TChainId extends ChainId = ChainId> = {
  /**
   * Override default chain ID
   */
  chainId?: TChainId;
};
