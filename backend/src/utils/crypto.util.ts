import sodium, {getSodiumKey} from '@/config/sodium.js'

export const encryptSecret = (secret : string)=>{
    const key = getSodiumKey();

    const nonce = sodium.randombytes_buf(
        sodium.crypto_aead_xchacha20poly1305_IETF_NPUBBYTES
    )

    const cipher = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        secret,
        null,
        null,
        nonce,
        key
    )

     return {
    cipher: Buffer.from(cipher).toString("base64"),
    nonce: Buffer.from(nonce).toString("base64"),
  };
}

export const decryptSecret = (cipherB64: string, nonceB64: string) => {
  const key = getSodiumKey();

  const plain = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
    null,
    Buffer.from(cipherB64, "base64"),
    null,
    Buffer.from(nonceB64, "base64"),
    key
  );

  return Buffer.from(plain).toString();
};
 