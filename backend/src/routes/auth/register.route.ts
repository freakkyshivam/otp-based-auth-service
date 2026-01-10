import { Router } from "express";
import {
  register,
  verifyRegisterOtp,
} from "../../controllers/auth/register.controller.js";

import { deviceInfo } from "../../middleware/deviceInfo.js";
import { rateLimiter } from "../../middleware/rateLimiter.js";
import type { Router as RouterType } from "express";

const router: RouterType = Router();

router.post("/register",rateLimiter({ limit: 5, window: 60 }), register);
router.post("/verify-register-otp",rateLimiter({ limit: 5, window: 60 }), deviceInfo, verifyRegisterOtp);

export default router;