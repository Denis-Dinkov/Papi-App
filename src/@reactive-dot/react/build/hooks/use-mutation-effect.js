import { MutationEventSubjectContext, } from "../contexts/mutation.js";
import { useContext, useEffect } from "react";
/**
 * Hook that watches for mutation events.
 *
 * @param effect - Callback when new mutation event is emitted
 */
export function useMutationEffect(effect) {
    const mutationEventSubject = useContext(MutationEventSubjectContext);
    useEffect(() => {
        const subscription = mutationEventSubject.subscribe({ next: effect });
        return () => subscription.unsubscribe();
    }, [mutationEventSubject, effect]);
}
