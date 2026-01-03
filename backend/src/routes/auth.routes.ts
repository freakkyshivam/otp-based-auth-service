import { Router } from "express";

import registerRoutes from "./auth/register.route.js";
import loginRoutes from "./auth/login.route.js";
import passwordRoutes from "./auth/password.route.js";
import sessionRoutes from "./auth/session.route.js";
import tokenRoutes from './auth/token.route.js'
import mfaRoutes from './auth/mfa.route.js'
import type { Router as RouterType } from "express";

const router: RouterType = Router();

router.use(registerRoutes);
router.use(loginRoutes);
router.use(passwordRoutes);
router.use(sessionRoutes);
router.use(tokenRoutes);
router.use(mfaRoutes);

export default router;
