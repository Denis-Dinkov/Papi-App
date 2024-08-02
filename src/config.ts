// `dot` is the name we gave to `npx papi add`
import { dot } from "@polkadot-api/descriptors";
import type { Config } from "./@reactive-dot/core/src";
import { InjectedWalletAggregator } from "./@reactive-dot/core/src/wallets";
import { chainSpec } from "polkadot-api/chains/polkadot";
import { getSmProvider } from "polkadot-api/sm-provider";
import { startFromWorker } from "polkadot-api/smoldot/from-worker";

const smoldot = startFromWorker(
  new Worker(new URL("polkadot-api/smoldot/worker", import.meta.url), {
    type: "module",
  }),
);

export const config = {
  chains: {
    // "polkadot" here can be any unique string value
    polkadot: {
      descriptor: dot,
      provider: getSmProvider(smoldot.addChain({ chainSpec })),
    },
  },
  wallets: [new InjectedWalletAggregator()],
} as const satisfies Config;