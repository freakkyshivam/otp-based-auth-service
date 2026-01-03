import { Router } from "express";
import {
  login,
  logout,
  verify2faLogin
} from "@/controllers/auth/login.controller.js";
 

import type { Router as RouterType } from "express";
import { verifyTemptoken } from "@/middleware/verifyTemptoken.js";

const router: RouterType = Router();

// login
router.post("/login", login);

router.post('/login/verify2fa',verifyTemptoken, verify2faLogin)

// logout (protected)
router.post("/logout",   logout);

export default router;
