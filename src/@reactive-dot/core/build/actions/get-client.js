import { createClient } from "polkadot-api";
export async function getClient(chainConfig) {
    const providerOrGetter = await chainConfig.provider;
    // Hack to detect wether function is a `JsonRpcProvider` or a getter of `JsonRpcProvider`
    const provider = await (providerOrGetter.length > 0
        ? providerOrGetter
        : providerOrGetter());
    return createClient(provider);
}
