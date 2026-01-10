import { Router } from "express";
import {
  terminateAllOtherDevice,
  revokeSession,
} from "../../controllers/auth/session.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import { allSessions } from "../../controllers/user.controller.js";
import type { Router as RouterType } from "express";

const router: RouterType = Router();

router.get('/sessions',authMiddleware,allSessions);

// terminate all other sessions except current
router.post(
  "/sessions/terminate-others",
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
