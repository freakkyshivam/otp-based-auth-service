import { Router } from "express";
import {
  register,
  verifyRegisterOtp,
} from "@/controllers/auth/register.controller.js";

import { deviceInfo } from "@/middleware/deviceInfo.js";

import type { Router as RouterType } from "express";

const router: RouterType = Router();

router.post("/register", register);
router.post("/verify-register-otp", deviceInfo, verifyRegisterOtp);

export default router;