import { SignerContext } from "../contexts/index.js";
import { MutationEventSubjectContext, } from "../contexts/mutation.js";
import { typedApiAtomFamily } from "../stores/client.js";
import { useAsyncState } from "./use-async-state.js";
import { useChainId_INTERNAL } from "./use-chain-id.js";
import { MutationError, PENDING } from "../../../core/src";
import { useAtomCallback } from "jotai/utils";
import { useCallback, useContext } from "react";
/**
 * Hook for sending transactions to chains.
 *
 * @param action - The function to create the transaction
 * @param options - Additional options
 * @returns The current transaction state & submit function
 */
export function useMutation(action, options) {
    const chainId = useChainId_INTERNAL(options);
    const mutationEventSubject = useContext(MutationEventSubjectContext);
    const contextSigner = useContext(SignerContext);
    const [event, setEvent] = useAsyncState();
    const setState = useCallback((event) => {
        setEvent(event.value);
        mutationEventSubject.next({ ...event, chainId });
    }, [chainId, mutationEventSubject, setEvent]);
    const submit = useAtomCallback(useCallback(async (get, _set, submitOptions) => {
        const id = globalThis.crypto.randomUUID();
        setState({ id, value: PENDING });
        const signer = submitOptions?.signer ?? options?.signer ?? contextSigner;
        if (signer === undefined) {
            const error = new MutationError("No signer provided");
            setState({
                id,
                value: MutationError.from(error),
            });
            throw error;
        }
        const api = await get(typedApiAtomFamily(chainId));
        const transaction = action(api.tx);
        setState({ id, call: transaction.decodedCall, value: PENDING });
        return new Promise((resolve, reject) => transaction
            .signSubmitAndWatch(signer, submitOptions ?? options?.txOptions)
            .subscribe({
            next: (value) => setState({ id, call: transaction.decodedCall, value }),
            error: (error) => {
                setState({
                    id,
                    call: transaction.decodedCall,
                    value: MutationError.from(error),
                });
                reject(error);
            },
            complete: resolve,
        }));
    }, [
        action,
        chainId,
        contextSigner,
        options?.signer,
        options?.txOptions,
        setState,
    ]));
    return [event, submit];
}
