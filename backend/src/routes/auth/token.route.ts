import { Router } from "express";
import {
  refreshToken
} from "@/controllers/auth/token.controller.js";
 import authMiddleware from "@/middleware/auth.middleware.js";

import type { Router as RouterType } from "express";
const router:RouterType = Router();

router.post("/token/refresh", authMiddleware, refreshToken);

 export default router;