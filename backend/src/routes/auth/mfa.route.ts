import { Router } from "express";
 import { setup2fa,verify2faSetup,disable2Fa,generateNewBackupCode } from "../../controllers/auth/mfa.controller.js";
 import { rateLimiter } from "../../middleware/rateLimiter.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import type { Router as RouterType } from "express";

const router: RouterType = Router();

router.post('/mfa/setup',authMiddleware ,setup2fa);
router.post('/mfa/verify',rateLimiter({ limit: 5, window: 60 }),authMiddleware,verify2faSetup)
router.post('/mfa/disable',authMiddleware,disable2Fa)
router.post('/mfa/generate-new-backup-codes',rateLimiter({ limit: 5, window: 60 }),authMiddleware,generateNewBackupCode)

export default router;