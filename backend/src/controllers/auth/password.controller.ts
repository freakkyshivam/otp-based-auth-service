import { response, type Request, type Response } from "express";
import argon2 from "argon2";
import { and, eq, ne } from "drizzle-orm";

import db from "../../db/db.js";
import Users from "../../db/schema/users.schema.js";

import {
  sendResetOtpValidation,
  resetPasswordValidation,
} from "../../validation/validation.js";

import { z } from "zod";

const verifyResetOtpValidation = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be at least 6 characters"),
});

import { findUserByEmail } from "../../services/user/user.service.js";

import {
  storeOtpInRedis,
  verifyOtpFromRedis,
} from "../../services/otp/otp.service.js";

import { enqueueMail } from "../../queues/mail.queue.js";

export const sendResetOtp = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(`[SEND RESET OTP] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    const validationResult = await sendResetOtpValidation.safeParseAsync(
      req.body
    );

    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        msg: "Please enter valid details",
        error: validationResult.error,
      });
    }

    const { email } = validationResult.data;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid email address" });
    }

    const exitingUser = await findUserByEmail(email);

    if (!exitingUser) {
      return res.status(400).json({
        success: false,
        msg: `User with this email ${email} is not exits`,
      });
    }

    const otp = await storeOtpInRedis({
      identifier: email,
      purpose: "RESET_PASSWORD",
    });

    await enqueueMail("PASSWORD_RESET", {
      name: exitingUser.name,
      email,
      otp,
    });

    return res.status(200).json({
      success: true,
      msg: `Otp sent on email ${email}, please verify OTP`,
    });
  } catch (error: any) {
    console.error("Server error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const verifyResetOtp = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(`[VERIFY RESET OTP] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    const validationResult = await verifyResetOtpValidation.safeParseAsync(
      req.body
    );

    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        msg: "Please enter valid details",
        error: validationResult.error,
      });
    }

    const { email, otp } = validationResult.data;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        msg: "Email and OTP are required",
      });
    }

    const result = await verifyOtpFromRedis({
      identifier: email,
      purpose: "RESET_PASSWORD",
      otp,
    });

    if (!result.valid) {
      return res.status(400).json({ success: false, msg: result.reason });
    }

    return res.status(200).json({
      success: true,
      msg: "OTP verified successfully",
    });
  } catch (error: any) {
    console.error("Verify reset OTP error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(`[RESET PASSWORD] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    const validationResult = await resetPasswordValidation.safeParseAsync(
      req.body
    );

    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        msg: "Please enter valid details",
        error: validationResult.error,
      });
    }

    const { email, newPassword, otp } = validationResult.data;

    if (!email || !newPassword || !otp) {
      return res.status(400).json({
        success: false,
        msg: "Invalid details, please enter valid detail",
      });
    }

    

    const exitingUser = await findUserByEmail(email);

    if (!exitingUser) {
      return res.status(400).json({
        success: false,
        msg: `User with this email ${email} is not exits`,
      });
    }

    const hashedPassword = await argon2.hash(newPassword);

    const [updatedUser] = await db
      .update(Users)
      .set({
        password: hashedPassword,
      })
      .where(eq(Users.email, email))
      .returning({
        id: Users.id,
        name: Users.name,
        email: Users.email,
      });

    await enqueueMail("PASSWORD_RESET_ALERT", {
      name: exitingUser.name,
      email,
    });

    return res.status(200).json({
      success: true,
      msg: `Password updated successfully, new password is ${newPassword}`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error: any) {
    console.error("Server error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};
