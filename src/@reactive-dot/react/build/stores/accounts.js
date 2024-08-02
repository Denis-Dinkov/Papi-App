import { withAtomFamilyErrorCatcher } from "../utils/jotai.js";
import { chainSpecDataAtomFamily } from "./client.js";
import { walletsAtom } from "./wallets.js";
import { getAccounts, } from "../../../core/src";
import { atomFamily, atomWithObservable } from "jotai/utils";
export const accountsAtom = atomFamily((chainId) => withAtomFamilyErrorCatcher(accountsAtom, chainId, atomWithObservable)((get) => getAccounts(get(walletsAtom), get(chainSpecDataAtomFamily(chainId)))));
