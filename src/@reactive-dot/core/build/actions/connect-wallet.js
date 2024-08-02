export async function connectWallet(wallet) {
    const walletsToConnect = Array.isArray(wallet) ? wallet : [wallet];
    await Promise.all(walletsToConnect.map((wallet) => wallet.connect()));
}
