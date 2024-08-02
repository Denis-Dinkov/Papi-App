import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
export const ChainIdContext = createContext(undefined);
/**
 * React context provider for scoping to a specific chain.
 *
 * @param props - Component props
 * @returns React element
 */
export function ReDotChainProvider(props) {
    return (_jsx(ChainIdContext.Provider, { value: props.chainId, children: props.children }));
}
