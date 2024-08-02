import type { config } from "./config";
import type { InferChains } from "../../../core/src";

declare module "../../../core/src" {
  export interface Chains extends InferChains<typeof config> {}
}
