import { Router } from "express";
import {
  refreshToken
} from "../../controllers/auth/token.controller.js";

import type { Router as RouterType } from "express";
const router:RouterType = Router();

 
router.post("/token/refresh", refreshToken);

 export default router;