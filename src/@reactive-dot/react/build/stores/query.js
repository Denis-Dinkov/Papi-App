import { withAtomFamilyErrorCatcher } from "../utils/jotai.js";
import { stringify } from "../utils/vanilla.js";
import { typedApiAtomFamily } from "./client.js";
import { preflight, query, } from "../../../core/src";
import { atom } from "jotai";
import { atomFamily, atomWithObservable, atomWithRefresh } from "jotai/utils";
import { from, switchMap } from "rxjs";
const instructionPayloadAtomFamily = atomFamily((param) => {
    switch (preflight(param.instruction)) {
        case "promise":
            return withAtomFamilyErrorCatcher(instructionPayloadAtomFamily, param, atomWithRefresh)(async (get, { signal }) => {
                const api = await get(typedApiAtomFamily(param.chainId));
                return query(api, param.instruction, { signal });
            });
        case "observable":
            return withAtomFamilyErrorCatcher(instructionPayloadAtomFamily, param, atomWithObservable)((get) => from(get(typedApiAtomFamily(param.chainId))).pipe(switchMap((api) => query(api, param.instruction))));
    }
}, (a, b) => stringify(a) === stringify(b));
export function getQueryInstructionPayloadAtoms(chainId, query) {
    return query.instructions.map((instruction) => {
        if (!("multi" in instruction)) {
            return instructionPayloadAtomFamily({
                chainId: chainId,
                instruction,
            });
        }
        return instruction.args.map((args) => {
            const { multi, ...rest } = instruction;
            return instructionPayloadAtomFamily({
                chainId: chainId,
                instruction: { ...rest, args },
            });
        });
    });
}
// TODO: should be memoized within render function instead
// https://github.com/pmndrs/jotai/discussions/1553
export const queryPayloadAtomFamily = atomFamily((param) => withAtomFamilyErrorCatcher(queryPayloadAtomFamily, param, atom)((get) => {
    const atoms = getQueryInstructionPayloadAtoms(param.chainId, param.query);
    return Promise.all(atoms.map((atomOrAtoms) => {
        if (Array.isArray(atomOrAtoms)) {
            return Promise.all(atomOrAtoms.map(get));
        }
        return get(atomOrAtoms);
    }));
}), (a, b) => a.chainId === b.chainId &&
    stringify(a.query.instructions) === stringify(b.query.instructions));
