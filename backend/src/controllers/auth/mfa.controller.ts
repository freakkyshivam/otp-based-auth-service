import { type Request, type Response } from "express";
import { generateQr } from "../../utils/qr.js";
import { redis } from "../../config/redis.js";
import db from "../../db/db.js";
import Users from "../../db/schema/users.schema.js";
import { eq } from "drizzle-orm";
import authenticator from "../../config/otplib.js";
import { encryptSecret, decryptSecret } from "../../utils/crypto.util.js";
import { generateAndSaveBackupCode } from "../../services/user/generateAndSaveBackupcode.js";


export const setup2fa = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    if (user.is2fa) {
      return res
        .status(400)
        .json({ success: false, msg: "2FA already enabled" });
    }
    const secret = authenticator.generateSecret();
    if (!secret)
      return res
        .status(400)
        .json({ success: false, msg: "2FA secret code not generated" });

    const otpAuth = authenticator.keyuri(user.email, "Secure Auth", secret);

    const data = {
        secret,
        attempts : 0
    }

    redis.set(`2fa:setup:${user.id}`, JSON.stringify(data), { EX: 300 });

    const qr = await generateQr(otpAuth);

    return res
      .status(200)
      .json({ success: true, msg: "Qrcode is generated for 2FA setup", qr,secret });
  } catch (error: any) {
    console.log("Internal server error ", error.message);

    return res.status(500).json({
      success: false,
      msg: `Internal serevr error ${error.message}`,
    });
  }
};

export const verify2faSetup = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    const user = req.user;

    if (!user?.id) {
      return res.status(400).json({ success: false, msg: "Unauthorized" });
    }

    if (!otp) {
      return res.status(400).json({ success: false, msg: "OTP is required" });
    }

    const dataRaw = await redis.get(`2fa:setup:${user.id}`);
    if (!dataRaw) throw new Error("2FA session expired");

    const data = JSON.parse(dataRaw);
    const { secret, attempts } = data;


    if (user.is2fa) {
      return res.status(400).json({ msg: "2FA already enabled" });
    }

    const isValid = authenticator.verify({
      token: otp,
      secret,
    });

    if (!isValid) {
        data.attempts += 1;

          if (data.attempts >= 5) {
    await redis.del(`2fa:setup:${user.id}`);
    return res.status(429).json({
      success: false,
      msg: "Too many invalid attempts. Restart 2FA setup.",
    });
  }

  await redis.set(
    `2fa:setup:${user.id}`,
    JSON.stringify(data),
    { EX: 300 }
  );

  return res.status(400).json({ success: false, msg: "Invalid OTP" });
    } 

    const { cipher, nonce } = encryptSecret(secret);

    await db
      .update(Users)
      .set({
        is2fa: true,
        twoFactorSecret: cipher,
        twoFactorNonce: nonce,
      })
      .where(eq(Users.id, user.id));

    await redis.del(`2fa:setup:${user.id}`);

    const plainBackupCodes = await generateAndSaveBackupCode(user.id)

    console.log(plainBackupCodes);
    

    return res.status(200).json({
  success: true,
  msg: "Two factor authentication is enabled",
  backupCodes: plainBackupCodes,
});
  } catch (error: any) {
    console.log("Internal server error (2FA verification) ", error.message);

    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};
