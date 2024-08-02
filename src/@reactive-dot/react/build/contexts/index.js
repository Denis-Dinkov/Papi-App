import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useReconnectWallets } from "../hooks/use-reconnect-wallets.js";
import { chainConfigsAtom } from "../stores/config.js";
import { aggregatorsAtom, directWalletsAtom } from "../stores/wallets.js";
import { MutationEventSubjectContext } from "./mutation.js";
import { Wallet, WalletAggregator } from "../../../core/src/wallets.js";
import { ScopeProvider } from "jotai-scope";
import { useHydrateAtoms } from "jotai/utils";
import { Suspense, useEffect, useMemo } from "react";
import { Subject } from "rxjs";
export { ChainIdContext, ReDotChainProvider, } from "./chain.js";
export { ReDotSignerProvider, SignerContext, } from "./signer.js";
function ReDotHydrator(props) {
    useHydrateAtoms(useMemo(() => 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Map([
        [chainConfigsAtom, props.config.chains],
        [
            directWalletsAtom,
            props.config.wallets?.filter((wallet) => wallet instanceof Wallet) ?? [],
        ],
        [
            aggregatorsAtom,
            props.config.wallets?.filter((aggregator) => aggregator instanceof WalletAggregator) ?? [],
        ],
    ]), [props.config]));
    return null;
}
function WalletsReconnector() {
    const [_, reconnect] = useReconnectWallets();
    useEffect(() => {
        reconnect();
    }, [reconnect]);
    return null;
}
/**
 * React context provider for Reactive DOT.
 *
 * @param props - Component props
 * @returns React element
 */
export function ReDotProvider({ autoReconnectWallets = true, ...props }) {
    return (_jsxs(ScopeProvider, { atoms: [chainConfigsAtom], children: [_jsx(ReDotHydrator, { ...props }), autoReconnectWallets && (_jsx(Suspense, { children: _jsx(WalletsReconnector, {}) })), _jsx(MutationEventSubjectContext.Provider, { value: useMemo(() => new Subject(), []), children: props.children })] }));
}
