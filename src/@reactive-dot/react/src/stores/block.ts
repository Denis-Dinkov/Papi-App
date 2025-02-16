import { clientAtomFamily } from "./client.js";
import type { ChainId } from "../../../core/src";
import { atomFamily, atomWithObservable } from "jotai/utils";
import { from } from "rxjs";
import { switchMap, map } from "rxjs/operators";

export const finalizedBlockAtomFamily = atomFamily((chainId: ChainId) =>
  atomWithObservable((get) =>
    from(get(clientAtomFamily(chainId))).pipe(
      switchMap((client) => client.finalizedBlock$),
    ),
  ),
);

export const bestBlockAtomFamily = atomFamily((chainId: ChainId) =>
  atomWithObservable((get) =>
    from(get(clientAtomFamily(chainId))).pipe(
      switchMap((client) => client.bestBlocks$),
      map((blocks) => blocks.at(0)!),
    ),
  ),
);
