import generateBackupCode from "../../utils/generateBackupCodes.js";
import argon2 from "argon2";
import backupCodesTable from "../../db/schema/user_2fa_backupcode.scema.js";
import db
 from "../../db/db.js";
export const generateAndSaveBackupCode = async (id:string)=>{
    const plainBackupCodes: string[] = [];

    for (let i = 0; i < 6; i++) {
     const code = generateBackupCode();
  plainBackupCodes.push(code);
      const hash = await argon2.hash(code, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, 
        timeCost: 2,
        parallelism: 1,
      });

      await db.insert(backupCodesTable).values({
        userId : id,
        hashCode : hash
      })
    }

    return plainBackupCodes
}