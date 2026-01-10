import {Router} from 'express'
import {  UserInfo,changePassword, updateProfile } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import sessionRoutes from './user/session.route.js'
import UserRoutes from './user/info.route.js'
import type { Router as RouterType } from 'express';

const router:RouterType  = Router();

 router.use(UserRoutes)
router.use(sessionRoutes)
export default router;