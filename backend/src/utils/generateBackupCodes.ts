import crypto from "node:crypto";

function generateBackupCode(): string {
  return crypto
    .randomBytes(5)         
    .toString("hex")        
    .toUpperCase();        
}

export default generateBackupCode;