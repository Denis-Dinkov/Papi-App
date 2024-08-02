import { WalletAggregator } from "./aggregator/index.js";
export async function initializeWallets(walletsOrAggregators) {
    const wallets = (await Promise.all(walletsOrAggregators.map((walletOrAggregator) => walletOrAggregator instanceof WalletAggregator
        ? walletOrAggregator.scan()
        : [walletOrAggregator]))).flat();
    return Promise.all(wallets.map((wallet) => wallet.initialize()));
}
