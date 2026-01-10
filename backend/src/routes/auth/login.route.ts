import { Router } from "express";
import {
  login,
  logout,
  verify2faLogin
} from "../../controllers/auth/login.controller.js";
import { deviceInfo } from "../../middleware/deviceInfo.js";
 

import type { Router as RouterType } from "express";
import { verifyTemptoken } from "../../middleware/verifyTemptoken.js";
import { rateLimiter } from "../../middleware/rateLimiter.js";
const router: RouterType = Router();

// login
router.post("/login",rateLimiter({ limit: 5, window: 60 }),deviceInfo, login);

router.post('/2fa/verify-login',rateLimiter({ limit: 5, window: 60 }),verifyTemptoken,deviceInfo, verify2faLogin)

// logout (protected)
router.post("/logout",   logout);

export default router;
