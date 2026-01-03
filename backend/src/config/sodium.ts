import sodium from 'libsodium-wrappers'

let isReady = false;

export const initSodium = async ()=>{
    if(!isReady){
        await sodium.ready;
        isReady = true;
    }
}

export const getSodiumKey = ()=>{
    const keyHex = process.env.SODIUM_SECRET_KEY!

    if(!keyHex){
        throw new Error("SODIUM_SECRET_KEY missing")
    }

    const key = Buffer.from(keyHex, 'hex').subarray(0,32);

    if(key.length != 32){
        throw new Error("SODIUM_SECRET_KEY must be 32 bytes")
    }

    return key;
}

export default sodium;