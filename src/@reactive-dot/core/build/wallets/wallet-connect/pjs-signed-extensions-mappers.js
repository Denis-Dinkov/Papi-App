import { Bytes, Option, Struct, compact, compactBn, u32, } from "@polkadot-api/substrate-bindings";
import { toHex } from "@polkadot-api/utils";
function toPjsHex(value, minByteLen) {
    let inner = value.toString(16);
    inner = (inner.length % 2 ? "0" : "") + inner;
    const nPaddedBytes = Math.max(0, (minByteLen || 0) - inner.length / 2);
    return "0x" + "00".repeat(nPaddedBytes) + inner;
}
export function CheckGenesis({ additionalSigned }) {
    return {
        genesisHash: toHex(additionalSigned),
    };
}
export function CheckNonce({ value }) {
    // nonce is a u32 in pjs => 4 bytes
    return { nonce: toPjsHex(compact.dec(value), 4) };
}
export function CheckTxVersion({ additionalSigned }) {
    return { transactionVersion: toPjsHex(u32.dec(additionalSigned), 4) };
}
const assetTxPaymentDec = Struct({
    tip: compact,
    asset: Option(Bytes(Infinity)),
}).dec;
export function ChargeAssetTxPayment({ value }) {
    const { tip, asset } = assetTxPaymentDec(value);
    return {
        ...(asset ? { assetId: toHex(asset) } : {}),
        tip: toPjsHex(tip, 16),
    };
}
export function ChargeTransactionPayment({ value }) {
    return {
        tip: toPjsHex(compactBn.dec(value), 16),
    };
}
export function CheckMortality({ value, additionalSigned }, blockNumber) {
    return {
        era: toHex(value),
        blockHash: toHex(additionalSigned),
        blockNumber: toPjsHex(blockNumber, 4),
    };
}
export function CheckSpecVersion({ additionalSigned }) {
    return {
        specVersion: toPjsHex(u32.dec(additionalSigned), 4),
    };
}
// we create the tx without metadata hash, it's optional for PJS
export function CheckMetadataHash() {
    return {};
}
