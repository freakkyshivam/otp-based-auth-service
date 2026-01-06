import { CookieOptions } from "express";
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,              
  sameSite: "none",           
  path: "/",
  domain: "otp-based-auth-system.onrender.com",
};
