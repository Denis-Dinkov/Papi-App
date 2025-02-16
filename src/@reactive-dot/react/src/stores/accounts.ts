import { withAtomFamilyErrorCatcher } from "../utils/jotai.js";
import { chainSpecDataAtomFamily } from "./client.js";
import { walletsAtom } from "./wallets.js";

import {
  getAccounts,
  type ChainId,
  type PolkadotAccount,
} from "../../../core/src";
import type { Atom } from "jotai";
import { atomFamily, atomWithObservable } from "jotai/utils";

export const accountsAtom = atomFamily(
  (chainId: ChainId): Atom<PolkadotAccount[] | Promise<PolkadotAccount[]>> =>
    withAtomFamilyErrorCatcher(
      accountsAtom,
      chainId,
      atomWithObservable,
    )((get) =>
      getAccounts(get(walletsAtom), get(chainSpecDataAtomFamily(chainId))),
    ),
);
