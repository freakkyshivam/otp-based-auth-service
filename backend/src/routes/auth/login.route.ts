import { Router } from "express";
import {
  login,
  logout,
  verify2faLogin
} from "../../controllers/auth/login.controller.js";
import { deviceInfo } from "../../middleware/deviceInfo.js";
 

import type { Router as RouterType } from "express";
import { verifyTemptoken } from "../../middleware/verifyTemptoken.js";

const router: RouterType = Router();

// login
router.post("/login",deviceInfo, login);

router.post('/2fa/verify-login',verifyTemptoken,deviceInfo, verify2faLogin)

// logout (protected)
router.post("/logout",   logout);

export default router;
