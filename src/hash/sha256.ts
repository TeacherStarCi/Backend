import  CryptoJS, { SHA256 } from 'crypto-js';

export const getIdHashedFromCurrentTimestamp = (): string => {
    let result: string = '';
    const hashSecret: string | undefined = process.env.HASH_SECRET;

    if (typeof hashSecret != 'undefined') {
        const currentTimestampString:string = Date.now().toString();
        result = SHA256(currentTimestampString + hashSecret).toString();
    }
    return result;
}
