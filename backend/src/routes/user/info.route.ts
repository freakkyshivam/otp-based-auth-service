import {Router} from 'express'
import {  UserInfo,changePassword, updateProfile } from '../../controllers/user.controller.js';
import authMiddleware from '../../middleware/auth.middleware.js';
 
import type { Router as RouterType } from 'express';

const router:RouterType  = Router();

router.get('/me',authMiddleware,UserInfo);
router.post('/update-password', authMiddleware, changePassword);
router.put('/update-profile', authMiddleware, updateProfile);
export default router;