import type { ChainConfig, ChainId } from "../../../core/src";
import { atom } from "jotai";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chainConfigsAtom = atom<Record<ChainId, ChainConfig>>({} as any);
