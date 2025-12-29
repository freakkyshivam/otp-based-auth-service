import { Router } from "express";
import {
  login,
  logout,
} from "@/controllers/auth/login.controller.js";
 

import type { Router as RouterType } from "express";

const router: RouterType = Router();

// login
router.post("/login", login);

// logout (protected)
router.post("/logout",   logout);

export default router;
