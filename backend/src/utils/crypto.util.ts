
import crypto from "node:crypto";

const ALGO = "aes-256-gcm";
const KEY = Buffer.from(process.env.APP_SECRET_KEY!, "hex"); // 32 bytes

export function encryptSecret(secret: string) {
  const nonce = crypto.randomBytes(12); // 12 bytes IV (recommended for GCM)

  const cipher = crypto.createCipheriv(ALGO, KEY, nonce);

  const encrypted = Buffer.concat([
    cipher.update(secret, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // 🔥 cipher = encrypted + authTag
  const finalCipher = Buffer.concat([encrypted, authTag]);

  return {
    cipher: finalCipher.toString("hex"),
    nonce: nonce.toString("hex"),
  };
}


export function decryptSecret(cipherHex: string, nonceHex: string) {
  const data = Buffer.from(cipherHex, "hex");
  const nonce = Buffer.from(nonceHex, "hex");

  // Last 16 bytes = authTag
  const authTag = data.subarray(data.length - 16);
  const encrypted = data.subarray(0, data.length - 16);

  const decipher = crypto.createDecipheriv(ALGO, KEY, nonce);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
