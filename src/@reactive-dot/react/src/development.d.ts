import type { ChainDefinition } from "polkadot-api";

declare module "../../../core/src" {
  export interface Chains {
    [id: string]: ChainDefinition;
  }
}
