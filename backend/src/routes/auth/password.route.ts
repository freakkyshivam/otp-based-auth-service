import { Router } from "express";
import {
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
} from "../../controllers/auth/password.controller.js";
 

import type { Router as RouterType } from "express";

const router: RouterType = Router();

router.post("/password/reset-otp", sendResetOtp);
router.post("/password/verify-otp", verifyResetOtp);
router.post("/password/reset", resetPassword);

export default router;
