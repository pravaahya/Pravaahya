import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.get('/orders', protect, userController.getUserOrders);

export default router;
