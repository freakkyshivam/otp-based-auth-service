import { Router } from "express";
import {
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
} from "../../controllers/auth/password.controller.js";
 import { rateLimiter } from "../../middleware/rateLimiter.js";

import type { Router as RouterType } from "express";

const router: RouterType = Router();

router.post("/password/reset-otp",rateLimiter({ limit: 5, window: 60 }), sendResetOtp);
router.post("/password/verify-otp",rateLimiter({ limit: 5, window: 60 }), verifyResetOtp);
router.post("/password/reset", resetPassword);

export default router;
