import { Router } from "express";
import {
  terminateAllOtherDevice,
  revokeSession,
} from "../../controllers/auth/session.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import { allSessions } from "../../controllers/user.controller.js";
import { rateLimiter } from "../../middleware/rateLimiter.js";
import type { Router as RouterType } from "express";

const router: RouterType = Router();

router.get('/sessions',authMiddleware,allSessions);

// terminate all other sessions except current
router.post(
  "/sessions/terminate-others",
  rateLimiter({ limit: 5, window: 60 }),
  authMiddleware,
  terminateAllOtherDevice
);

// revoke a specific session
router.post(
  "/sessions/revoke",
  authMiddleware,
  revokeSession
);

export default router;
