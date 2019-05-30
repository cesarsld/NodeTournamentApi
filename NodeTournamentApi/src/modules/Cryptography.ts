import * as ethUtil from 'ethereumjs-util';
export default function (signature: string, expectedAddress: string) {
    const msg = 'Axie Tournament';
    const msgBuffer = ethUtil.toBuffer(msg);
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    const signatureBuffer = ethUtil.toBuffer(signature);
    const signatureParams = ethUtil.fromRpcSig(signature);
    const publicKey = ethUtil.ecrecover(
        msgHash,
        signatureParams.v,
        signatureParams.r,
        signatureParams.s
    );
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const signingAddress = ethUtil.bufferToHex(addressBuffer);
    return expectedAddress.toLowerCase() === signingAddress.toLowerCase();
}