import { config } from "./config.ts";
import { ReDotChainProvider, ReDotProvider } from "./@reactive-dot/react/src";
import { Suspense } from "react";
import BlockData from "./compnents/blockData.tsx";

export default function App() {
  return (
    <ReDotProvider config={config}>
      {/* `chainId` match the ID previously specified via `polkadot: typeof dot` */}
      <ReDotChainProvider chainId="polkadot">
        {/* Make sure there is at least one Suspense boundary wrapping the app */}
        <Suspense>
          <BlockData />
        </Suspense>
      </ReDotChainProvider>
    </ReDotProvider>
  );
}
