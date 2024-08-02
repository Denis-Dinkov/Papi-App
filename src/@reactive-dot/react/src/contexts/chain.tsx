import type { ChainId } from "../../../core/src";
import { createContext, type PropsWithChildren } from "react";

export const ChainIdContext = createContext<ChainId | undefined>(undefined);

export type ReDotChainProviderProps = PropsWithChildren<{
  chainId: ChainId;
}>;

/**
 * React context provider for scoping to a specific chain.
 *
 * @param props - Component props
 * @returns React element
 */
export function ReDotChainProvider(props: ReDotChainProviderProps) {
  return (
    <ChainIdContext.Provider value={props.chainId}>
      {props.children}
    </ChainIdContext.Provider>
  );
}
