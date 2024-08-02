export async function disconnectWallet(wallet) {
    const walletsToDisconnect = Array.isArray(wallet) ? wallet : [wallet];
    await Promise.all(walletsToDisconnect.map((wallet) => wallet.disconnect()));
}
