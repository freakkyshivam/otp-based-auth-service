import { CookieOptions } from "express";
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  path: "/",
  // Remove hardcoded domain - let browser set it automatically
  // domain: "otp-based-auth-system.onrender.com",
};
