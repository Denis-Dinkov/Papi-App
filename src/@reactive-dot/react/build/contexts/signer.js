import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
export const SignerContext = createContext(undefined);
/**
 * React context provider to assign a default signer.
 *
 * @param props - Component props
 * @returns React element
 */
export function ReDotSignerProvider(props) {
    return (_jsx(SignerContext.Provider, { value: props.signer, children: props.children }));
}
